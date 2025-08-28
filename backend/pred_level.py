import joblib
import json

model = joblib.load("models/gw_level.pkl")


def classify_stage(stage):
    if stage <= 70:
        return "Safe"
    elif stage <= 90:
        return "Semi-Critical"
    elif stage <= 100:
        return "Critical"
    else:
        return "Over-Exploited"


def predict_stage(sample):
    pred_stage = model.predict([sample])[0]
    category = classify_stage(pred_stage)
    return pred_stage, category


numeric_cols = [
    "Annual Domestic and Industry Draft",
    "Annual Irrigation Draft",
    "Annual Groundwater Draft (Total)",
    "Annual Replenishable Groundwater Resources (Total)",
    "Natural Discharge During Non-Monsoon Season",
    "Net Groundwater Availability",
]


def predict(level_input):
    predicted_stage, category = predict_stage(level_input)

    retJSON = {"predicted_stage": float(predicted_stage), "classification": category}

    return json.dumps(retJSON)
