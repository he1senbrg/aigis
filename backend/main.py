from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import ai_report
import pred_level
import pred_quality
import json
import os
import shutil
from contextlib import asynccontextmanager
import numpy as np
from scipy.optimize import fsolve
from pydantic import BaseModel, Field

# ---------------------------
# Helper Functions (Formulas)
# ---------------------------

def calculate_conservative_mixing(
    q_river: float, c_river: float, q_effluent: float, c_effluent: float
) -> float:
    """
    Calculates the concentration of a conservative tracer in a mixed water body
    using mass balance. This is based on a fundamental principle of
    environmental chemistry.
    """
    numerator = (q_river * c_river) + (q_effluent * c_effluent)
    denominator = q_river + q_effluent
    if denominator == 0:
        return 0.0
    return numerator / denominator


def calculate_nitrate_mixing(
    q_river: float, c_river_no3: float, q_effluent: float, c_effluent_no3: float,
    distance: float, velocity: float, k_decay: float
) -> float:
    """
    Calculates downstream nitrate concentration using a first-order decay model
    combined with conservative mixing. This model assumes that nitrate removal
    is proportional to its concentration and is a standard approach for
    non-conservative substances.[1, 2]
    """
    # First, calculate the initial mixed concentration
    c_mixed_no3 = calculate_conservative_mixing(q_river, c_river_no3, q_effluent, c_effluent_no3)

    # Calculate time of travel for decay based on distance and velocity
    time_of_travel_seconds = distance / velocity
    time_of_travel_days = time_of_travel_seconds / (60 * 60 * 24)

    # Apply first-order decay formula
    c_downstream = c_mixed_no3 * np.exp(-k_decay * time_of_travel_days)

    return c_downstream

# NOTE: The pK1 and pK2 equations below are taken from Millero et al. (2002) and are
# validated for a wide range of temperatures and salinities in natural waters.[3, 4, 5]
# The pKw formula is also a standard temperature-dependent calculation.[4]
def get_equilibrium_constants(temperature_celsius: float, salinity: float) -> tuple[float, float, float]:
    """
    Calculates temperature and salinity-dependent equilibrium constants for the
    carbonate system. The formulas are based on the Mojica-Prieto and Millero (2002)
    dataset, which is considered more reliable for natural seawater than constants
    derived from artificial seawater.[5]
    """
    temp_kelvin = temperature_celsius + 273.15
    
    # Mojica-Prieto and Millero (2002) polynomial for pK1
    pk1 = (-43.6977 - 0.0129037 * salinity + 1.364e-4 * salinity**2 +
           2885.378 / temp_kelvin + 7.045159 * np.log(temp_kelvin))

    # Mojica-Prieto and Millero (2002) polynomial for pK2
    pk2 = (-452.0940 + 13.142162 * salinity - 8.101e-4 * salinity**2 +
           21263.61 / temp_kelvin + 68.483143 * np.log(temp_kelvin) +
           (-581.4428 * salinity + 0.259601 * salinity**2) / temp_kelvin -
           1.967035 * salinity * np.log(temp_kelvin))
    
    # A standard temperature-dependent formula for pKw [4]
    pkw = 13.8052 - 4471.33 / temp_kelvin + 0.017053 * temp_kelvin
    
    return 10**-pk1, 10**-pk2, 10**-pkw


def calculate_tic(ph: float, alkalinity: float, temperature_celsius: float, salinity: float) -> float:
    """
    Calculates Total Inorganic Carbon (TIC) from pH, alkalinity, temperature,
    and salinity, solving the system of carbonate equilibrium equations.[6]
    """
    k1, k2, kw = get_equilibrium_constants(temperature_celsius, salinity)
    h_ion = 10**-ph
    oh_ion = kw / h_ion
    
    # Convert alkalinity from mg/L as CaCO3 to eq/L for consistency in the calculation
    alk_eq_per_l = alkalinity / 50000.0

    alpha_denom = h_ion**2 + k1 * h_ion + k1 * k2
    if alpha_denom == 0:
        return 0.0
    alpha1 = (k1 * h_ion) / alpha_denom
    alpha2 = (k1 * k2) / alpha_denom

    tic_numerator = alk_eq_per_l - oh_ion + h_ion
    tic_denominator = alpha1 + 2 * alpha2
    if tic_denominator == 0:
        return 0.0
    return tic_numerator / tic_denominator


def ph_equilibrium_equation(h_ion: float, alk_mixed: float, tic_mixed: float, temperature_celsius: float, salinity: float) -> float:
    """
    The main equation for the pH mixing model, which is set to zero to be solved
    by a root-finding algorithm.
    """
    k1, k2, kw = get_equilibrium_constants(temperature_celsius, salinity)
    oh_ion = kw / h_ion
    
    alpha_denom = h_ion**2 + k1 * h_ion + k1 * k2
    if alpha_denom == 0:
        return 0.0
    alpha1 = (k1 * h_ion) / alpha_denom
    alpha2 = (k1 * k2) / alpha_denom
    
    return tic_mixed * (alpha1 + 2 * alpha2) + oh_ion - h_ion - alk_mixed


def calculate_ph_mixing(
    q_river: float, ph_river: float, alk_river: float, temp_river: float, sal_river: float,
    q_effluent: float, ph_effluent: float, alk_effluent: float, temp_effluent: float, sal_effluent: float
) -> float:
    """
    Calculates the final pH of a mixed water body by solving the chemical
    equilibrium for the carbonate system. It uses a numerical solver to find
    the root of the charge balance equation.[6, 7]
    """
    temp_mixed = calculate_conservative_mixing(q_river, temp_river, q_effluent, temp_effluent)
    sal_mixed = calculate_conservative_mixing(q_river, sal_river, q_effluent, sal_effluent)

    tic_river = calculate_tic(ph_river, alk_river, temp_river, sal_river)
    tic_effluent = calculate_tic(ph_effluent, alk_effluent, temp_effluent, sal_effluent)

    alk_mixed_mg_per_l = calculate_conservative_mixing(q_river, alk_river, q_effluent, alk_effluent)
    alk_mixed_eq_per_l = alk_mixed_mg_per_l / 50000.0  # Convert to eq/L for the solver
    tic_mixed_mol_per_l = calculate_conservative_mixing(q_river, tic_river, q_effluent, tic_effluent)

    # Initial guess for the solver is a simple weighted average of pH, converted to H+ concentration
    initial_h_guess = 10**-calculate_conservative_mixing(q_river, ph_river, q_effluent, ph_effluent)
    
    # Use fsolve with a verification protocol to ensure a valid solution is found
    # [12]
    h_final, info_dict, ier, msg = fsolve(
        ph_equilibrium_equation,
        initial_h_guess,
        args=(alk_mixed_eq_per_l, tic_mixed_mol_per_l, temp_mixed, sal_mixed),
        full_output=True
    )

    # A verification step to check for successful convergence and accurate roots.
    # If the exit flag is 1 and the residual is close to zero, the solution is trustworthy.[8, 9]
    if ier == 1 and np.allclose(ph_equilibrium_equation(h_final, alk_mixed_eq_per_l, tic_mixed_mol_per_l, temp_mixed, sal_mixed), 0, atol=1e-8):
        return -np.log10(h_final)
    else:
        raise ValueError(f"pH calculation failed to converge. Reason: {msg}")


# ---------------------------
# FastAPI App Setup
# ---------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    dir_path = "static"
    shutil.rmtree(dir_path, ignore_errors=True)
    os.makedirs(dir_path, exist_ok=True)
    print(f"Reset directory: {dir_path}")
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://aigis.vishnu.studio"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Pydantic models for API input validation, ensuring data integrity.[10, 11]
class QualityParameters(BaseModel):
    ph: float = Field(default=0.0, ge=0.0, le=14.0)
    ec: float = Field(default=0.0, ge=0)
    tds: float = Field(default=0.0, ge=0)
    th: float = Field(default=0.0, ge=0)
    ca: float = Field(default=0.0, ge=0)
    mg: float = Field(default=0.0, ge=0)
    na: float = Field(default=0.0, ge=0)
    k: float = Field(default=0.0, ge=0)
    cl: float = Field(default=0.0, ge=0)
    so4: float = Field(default=0.0, ge=0)
    nitrate: float = Field(default=0.0, ge=0)
    fluoride: float = Field(default=0.0, ge=0)
    uranium: float = Field(default=0.0, ge=0)
    alkalinity: float = Field(default=100.0, ge=0)
    temp: float = Field(default=20.0, ge=0)
    flow: float = Field(default=15.0, gt=0)
    salinity: float = Field(default=0.0, ge=0)

class GroundwaterParameters(BaseModel):
    annual_domestic_industry_draft: float = Field(default=0.0, ge=0.0)
    annual_irrigation_draft: float = Field(default=0.0, ge=0.0)
    annual_groundwater_draft_total: float = Field(default=0.0, ge=0.0)
    annual_replenishable_groundwater_resources: float = Field(default=0.0, ge=0.0)
    natural_discharge_non_monsoon: float = Field(default=0.0, ge=0.0)
    net_groundwater_availability: float = Field(default=0.0, ge=0.0)

class PredictRequestBody(BaseModel):
    existing: dict # This dict will contain both QualityParameters and GroundwaterParameters data
    for_prediction: dict # This dict will contain both QualityParameters and GroundwaterParameters data

class AnalyzeRequestBody(BaseModel):
    ph: float = 0.0
    ec: float = 0
    tds: float = 0
    th: float = 0
    ca: float = 0
    mg: float = 0
    na: float = 0
    k: float = 0
    cl: float = 0
    so4: float = 0
    nitrate: float = 0
    fluoride: float = 0.0
    uranium: float = 0
    annual_domestic_industry_draft: float = 0.0
    annual_irrigation_draft: float = 0.0
    annual_groundwater_draft_total: float = 0.0
    annual_replenishable_groundwater_resources: float = 0.0
    natural_discharge_non_monsoon: float = 0.0
    net_groundwater_availability: float = 0.0

@app.get("/")
def read_root():
    return {"Info": "AIGIS API"}


@app.post("/analyze")
def analyze_data(data: AnalyzeRequestBody):
    quality_input = {
        "pH": data.ph,
        "EC": data.ec,
        "TDS": data.tds,
        "TH": data.th,
        "Ca": data.ca,
        "Mg": data.mg,
        "Na": data.na,
        "K": data.k,
        "Cl": data.cl,
        "SO4": data.so4,
        "NO3": data.nitrate,
        "F": data.fluoride,
        "U(ppb)": data.uranium,
    }

    quality_analysis = pred_quality.predict(quality_input)

    level_input = [
        data.annual_domestic_industry_draft,
        data.annual_irrigation_draft,
        data.annual_groundwater_draft_total,
        data.annual_replenishable_groundwater_resources,
        data.natural_discharge_non_monsoon,
        data.net_groundwater_availability,
    ]

    level_analysis = pred_level.predict(level_input)

    retJSON = {"quality_analysis": quality_analysis, "level_analysis": level_analysis}
    print("Analysis result:", retJSON)
    return json.dumps(retJSON)

@app.post("/predict")
def predict_data(data: PredictRequestBody):
    # Validate and parse quality parameters for river and effluent
    try:
        # Use existing_data for river, for_prediction_data for effluent
        river_quality_data = QualityParameters(**data.existing)
        effluent_quality_data = QualityParameters(**data.for_prediction)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid input data for existing or prediction quality parameters: {e}"
        )

    # Validate and parse groundwater parameters for existing and for_prediction
    try:
        # For existing: directly from data.existing
        parsed_existing_groundwater = GroundwaterParameters(
            annual_domestic_industry_draft=data.existing.get("annualDomesticIndustryDraft", 0.0),
            annual_irrigation_draft=data.existing.get("annualIrrigationDraft", 0.0),
            annual_groundwater_draft_total=data.existing.get("annualGroundwaterDraftTotal", 0.0),
            annual_replenishable_groundwater_resources=data.existing.get("annualReplenishableGroundwaterResources", 0.0),
            natural_discharge_non_monsoon=data.existing.get("naturalDischargeNonMonsoon", 0.0),
            net_groundwater_availability=data.existing.get("netGroundwaterAvailability", 0.0),
        )

        # For for_prediction: parse from the nested list structure
        temp_for_prediction_groundwater_dict = {}
        for item in data.for_prediction.get("groundwaterParameters", []):
            if isinstance(item, dict) and "type" in item and "value" in item:
                temp_for_prediction_groundwater_dict[item["type"]] = item["value"]

        parsed_for_prediction_groundwater = GroundwaterParameters(
            annual_domestic_industry_draft=temp_for_prediction_groundwater_dict.get("annualDomesticIndustryDraft", 0.0),
            annual_irrigation_draft=temp_for_prediction_groundwater_dict.get("annualIrrigationDraft", 0.0),
            annual_groundwater_draft_total=temp_for_prediction_groundwater_dict.get("annualGroundwaterDraftTotal", 0.0),
            annual_replenishable_groundwater_resources=temp_for_prediction_groundwater_dict.get("annualReplenishableGroundwaterResources", 0.0),
            natural_discharge_non_monsoon=temp_for_prediction_groundwater_dict.get("naturalDischargeNonMonsoon", 0.0),
            net_groundwater_availability=temp_for_prediction_groundwater_dict.get("netGroundwaterAvailability", 0.0),
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid input data for existing or prediction groundwater parameters: {e}"
        )


    river = {
        "flow": river_quality_data.flow,
        "temp": river_quality_data.temp,
        "pH": river_quality_data.ph,
        "EC": river_quality_data.ec,
        "TDS": river_quality_data.tds,
        "TH": river_quality_data.th,
        "Ca": river_quality_data.ca,
        "Mg": river_quality_data.mg,
        "Na": river_quality_data.na,
        "K": river_quality_data.k,
        "Cl": river_quality_data.cl,
        "SO4": river_quality_data.so4,
        "NO3": river_quality_data.nitrate,
        "F": river_quality_data.fluoride,
        "U(ppb)": river_quality_data.uranium,
        "Alkalinity": river_quality_data.alkalinity,
        "Salinity": river_quality_data.salinity
    }

    effluent = {
        "flow": effluent_quality_data.flow,
        "temp": effluent_quality_data.temp,
        "pH": effluent_quality_data.ph,
        "EC": effluent_quality_data.ec,
        "TDS": effluent_quality_data.tds,
        "TH": effluent_quality_data.th,
        "Ca": effluent_quality_data.ca,
        "Mg": effluent_quality_data.mg,
        "Na": effluent_quality_data.na,
        "K": effluent_quality_data.k,
        "Cl": effluent_quality_data.cl,
        "SO4": effluent_quality_data.so4,
        "NO3": effluent_quality_data.nitrate,
        "F": effluent_quality_data.fluoride,
        "U(ppb)": effluent_quality_data.uranium,
        "Alkalinity": effluent_quality_data.alkalinity,
        "Salinity": effluent_quality_data.salinity
    }

    # --- Conservative parameters ---
    conservative_params = [
        "EC", "TDS", "TH", "Ca", "Mg", "Na", "K", "Cl", "SO4", "F", "U(ppb)"
    ]
    quality_analysis = {}

    for param in conservative_params:
        quality_analysis[param] = calculate_conservative_mixing(
            river["flow"], river[param], effluent["flow"], effluent[param]
        )

    # --- Non-conservative: Nitrate ---
    distance = float(data.for_prediction.get("distance", 10000))  # meters
    velocity = float(data.for_prediction.get("velocity", 0.5))    # m/s
    k_decay = float(data.for_prediction.get("k_decay", 0.1))      # per day

    quality_analysis["NO3"] = calculate_nitrate_mixing(
        river["flow"], river["NO3"], effluent["flow"], effluent["NO3"],
        distance, velocity, k_decay
    )

    # --- System variable: pH ---
    try:
        quality_analysis["pH"] = calculate_ph_mixing(
            river["flow"], river["pH"], river["Alkalinity"], river["temp"], river["Salinity"],
            effluent["flow"], effluent["pH"], effluent["Alkalinity"], effluent["temp"], effluent["Salinity"]
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"pH calculation error: {e}"
        )

    # --- Level Prediction ---
    level_existing = [
        parsed_existing_groundwater.annual_domestic_industry_draft,
        parsed_existing_groundwater.annual_irrigation_draft,
        parsed_existing_groundwater.annual_groundwater_draft_total,
        parsed_existing_groundwater.annual_replenishable_groundwater_resources,
        parsed_existing_groundwater.natural_discharge_non_monsoon,
        parsed_existing_groundwater.net_groundwater_availability,
    ]

    level_for_prediction = [
        parsed_for_prediction_groundwater.annual_domestic_industry_draft,
        parsed_for_prediction_groundwater.annual_irrigation_draft,
        parsed_for_prediction_groundwater.annual_groundwater_draft_total,
        parsed_for_prediction_groundwater.annual_replenishable_groundwater_resources,
        parsed_for_prediction_groundwater.natural_discharge_non_monsoon,
        parsed_for_prediction_groundwater.net_groundwater_availability,
    ]

    level_input = [level_existing[i] + level_for_prediction[i] for i in range(len(level_existing))]
    level_analysis = pred_level.predict(level_input)

    # --- Final return ---
    retJSON = {"quality_analysis": quality_analysis, "level_analysis": level_analysis}
    print("Analysis result:", json.dumps(retJSON, indent=2))
    return json.dumps(retJSON)


@app.post("/gen_report")
def generate_report(data: dict):
    pdf_url = ai_report.generate(data)
    return pdf_url
