import joblib
import pandas as pd
import numpy as np
import shap
import json

model = joblib.load("models/gw_quality.pkl")

features = [
    "pH",
    "EC",
    "TDS",
    "TH",
    "Ca",
    "Mg",
    "Na",
    "K",
    "Cl",
    "SO4",
    "NO3",
    "F",
    "U(ppb)",
]

LIMITS = {
    "pH": (6.5, 8.5),
    "TDS": 500,
    "EC": 1500,
    "TH": 300,
    "Ca": 75,
    "Mg": 30,
    "Na": 200,
    "K": 12,
    "Cl": 250,
    "SO4": 250,
    "NO3": 45,
    "F": 1.5,
    "U(ppb)": 30,
}

TOXIC = {"NO3", "F", "U(ppb)"}


def within_limit(col, val):
    if col == "pH":
        lo, hi = LIMITS["pH"]
        return (val >= lo) and (val <= hi)
    else:
        return val <= LIMITS[col]


def compute_potability_score(row):
    checks, passed = 0, 0
    for col in features:
        if within_limit(col, row[col]):
            passed += 1
        checks += 1
    return 100.0 * passed / checks


def final_label(row):
    if (
        (row["NO3"] > LIMITS["NO3"])
        or (row["F"] > LIMITS["F"])
        or (row["U(ppb)"] > LIMITS["U(ppb)"])
    ):
        return "Critical"
    if not (LIMITS["pH"][0] <= row["pH"] <= LIMITS["pH"][1]):
        return "Critical"
    for c in features:
        if c == "pH":
            continue
        if row[c] > LIMITS[c]:
            return "Critical"
    return "Safe"


def recompute_rule_score(row_like_dict):
    checks, passed = 0, 0
    for col in features:
        val = row_like_dict[col]
        if within_limit(col, val):
            passed += 1
        checks += 1
    return 100.0 * passed / checks


def what_if(original_row, **changes):
    base = {c: float(original_row[c]) for c in features}
    new = base.copy()
    for k, v in changes.items():
        if k not in new:
            raise ValueError(f"{k} not in features")
        new[k] = float(v)

    base_rule = recompute_rule_score(base)
    new_rule = recompute_rule_score(new)

    base_pred = float(model.predict(pd.DataFrame([base]))[0])
    new_pred = float(model.predict(pd.DataFrame([new]))[0])

    def label_from_vals(vals):
        if (
            (vals["NO3"] > LIMITS["NO3"])
            or (vals["F"] > LIMITS["F"])
            or (vals["U(ppb)"] > LIMITS["U(ppb)"])
        ):
            return "Critical"
        if not (LIMITS["pH"][0] <= vals["pH"] <= LIMITS["pH"][1]):
            return "Critical"
        for c in features:
            if c == "pH":
                continue
            if vals[c] > LIMITS[c]:
                return "Critical"
        return "Safe"

    base_label = label_from_vals(base)
    new_label = label_from_vals(new)

    return {
        "base_rule_score": base_rule,
        "new_rule_score": new_rule,
        "base_model_pred": base_pred,
        "new_model_pred": new_pred,
        "base_label": base_label,
        "new_label": new_label,
        "delta_rule": new_rule - base_rule,
        "delta_model": new_pred - base_pred,
    }


def failed_parameters(row):
    fails = {}
    if not (LIMITS["pH"][0] <= row["pH"] <= LIMITS["pH"][1]):
        fails["pH"] = f"{row['pH']} (limit {LIMITS['pH'][0]}–{LIMITS['pH'][1]})"
    for c in features:
        if c == "pH":
            continue
        if row[c] > LIMITS[c]:
            fails[c] = f"{row[c]} (limit {LIMITS[c]})"
    return fails if fails else {"Status": "All within limits"}


def explain_prediction(row):
    try:
        explainer = shap.TreeExplainer(model)

        x_row = row[features].values.reshape(1, -1)

        pred = float(model.predict(x_row)[0])

        shap_vals = explainer.shap_values(x_row)[0]

        contributions = dict(zip(features, shap_vals))
        sorted_contribs = dict(
            sorted(contributions.items(), key=lambda kv: abs(kv[1]), reverse=True)
        )

        return {"Predicted Score": pred, "Contributions": sorted_contribs}
    except ImportError:
        x_row = row[features].values.reshape(1, -1)
        pred = float(model.predict(x_row)[0])

        return {
            "Predicted Score": pred,
            "Contributions": "SHAP not available - install with: pip install shap",
        }


def analyze_sample(sample_data):
    if isinstance(sample_data, dict):
        sample_data = pd.Series(sample_data)

    sample_df = pd.DataFrame([sample_data])[features]
    model_score = model.predict(sample_df)[0]

    rule_score = compute_potability_score(sample_data)

    safety_label = final_label(sample_data)

    failed_params = failed_parameters(sample_data)

    explanation = explain_prediction(sample_data)

    return {
        "model_score": float(model_score),
        "rule_score": float(rule_score),
        "safety_label": safety_label,
        "failed_parameters": failed_params,
        "explanation": explanation,
    }


def predict(pred_input):
    input_df = pd.DataFrame([pred_input])[features]

    pred_score = model.predict(input_df)[0]
    print(f"Predicted Potability Score: {pred_score:.2f}")

    print("=== Complete Water Quality Analysis ===")
    input_series = pd.Series(pred_input)
    analysis = analyze_sample(input_series)

    retJSON = {
        "potability_score": analysis["model_score"],
        "rule_based_score": analysis["rule_score"],
        "safety_label": analysis["safety_label"],
        "failed_parameters": analysis["failed_parameters"],
        "explanation": analysis["explanation"],
    }

    return json.dumps(retJSON)
