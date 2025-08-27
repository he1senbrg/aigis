from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pred_level
import pred_quality
import json

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Info": "AIGIS API"}


@app.post("/analyze")
def analyze_data(data: dict):
    print("Analyzing data:", data)
    quality_input = {
        "pH": float(data.get("ph", 0.0) or 0.0),
        "EC": int(data.get("ec", 0) or 0),
        "TDS": int(data.get("tds", 0) or 0),
        "TH": int(data.get("th", 0) or 0),
        "Ca": int(data.get("ca", 0) or 0),
        "Mg": int(data.get("mg", 0) or 0),
        "Na": int(data.get("na", 0) or 0),
        "K": int(data.get("k", 0) or 0),
        "Cl": int(data.get("cl", 0) or 0),
        "SO4": int(data.get("so4", 0) or 0),
        "NO3": int(data.get("nitrate", 0) or 0),
        "F": float(data.get("fluoride", 0.0) or 0.0),
        "U(ppb)": int(data.get("uranium", 0) or 0),
    }

    quality_analysis = pred_quality.predict(quality_input)

    level_input = [
        float(data.get("annualDomesticIndustryDraft", 0.0) or 0.0),
        float(data.get("annualIrrigationDraft", 0.0) or 0.0),
        float(data.get("annualGroundwaterDraftTotal", 0.0) or 0.0),
        float(data.get("annualReplenishableGroundwaterResources", 0.0) or 0.0),
        float(data.get("naturalDischargeNonMonsoon", 0.0) or 0.0),
        float(data.get("netGroundwaterAvailability", 0.0) or 0.0),
    ]

    level_analysis = pred_level.predict(level_input)

    retJSON = {"quality_analysis": quality_analysis, "level_analysis": level_analysis}
    print("Analysis result:", retJSON)
    return json.dumps(retJSON)


@app.post("/predict")
def predict_data(data: dict):
    print("Analyzing data:", data)
    return {"message": "Data analyzed successfully", "data": data}
