

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import shap
from sklearn.model_selection import (
    train_test_split, GroupKFold, KFold, RandomizedSearchCV, cross_validate
)
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance

path = "/kaggle/input/ground-water/gwq.csv"  
df = pd.read_csv(path, low_memory=False)

features = ["pH","EC","TDS","TH","Ca","Mg","Na","K","Cl","SO4","NO3","F","U(ppb)"]

for c in features:
    df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0)

LIMITS = {
    "pH":   (6.5, 8.5),     
    "TDS":  500,            
    "EC":   1500,           
    "TH":   300,            
    "Ca":   75,           
    "Mg":   30,           
    "Na":   200,            
    "K":    12,            
    "Cl":   250,           
    "SO4":  250,            
    "NO3":  45,            
    "F":    1.5,          
    "U(ppb)": 30            
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

df["PotabilityScore"] = df.apply(compute_potability_score, axis=1)

def final_label(row):
    if (row["NO3"] > LIMITS["NO3"]) or (row["F"] > LIMITS["F"]) or (row["U(ppb)"] > LIMITS["U(ppb)"]):
        return "Critical"
    if not (LIMITS["pH"][0] <= row["pH"] <= LIMITS["pH"][1]): return "Critical"
    for c in features:
        if c == "pH": 
            continue
        if row[c] > LIMITS[c]:
            return "Critical"
    return "Safe"

df["FinalLabel"] = df.apply(final_label, axis=1)

print("PotabilityScore examples:\n", df["PotabilityScore"].head(), "\n")
print("Strict labels:\n", df["FinalLabel"].value_counts(), "\n")

X = df[features].copy()
y = df["PotabilityScore"].astype(float).copy()

if "Well ID" in df.columns:
    wells = df["Well ID"].astype(str)
    unique_wells = wells.drop_duplicates()
    rng = np.random.RandomState(42)
    test_wells = set(unique_wells.sample(frac=0.2, random_state=42))
    mask_test = wells.isin(test_wells)
    X_train, X_test = X[~mask_test], X[mask_test]
    y_train, y_test = y[~mask_test], y[mask_test]
    cv = GroupKFold(n_splits=5)
    cv_groups = wells[~mask_test] 
else:
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    cv = KFold(n_splits=5, shuffle=True, random_state=42)
    cv_groups = None

base_rf = RandomForestRegressor(
    random_state=42,
    n_jobs=-1
)

param_dist = {
    "n_estimators": [100, 300, 600],       
    "max_depth": [None, 10, 20],           
    "min_samples_split": [2, 5],
    "min_samples_leaf": [1, 2, 4],
    "max_features": ["sqrt", "log2"],
    "bootstrap": [True]
}

search = RandomizedSearchCV(
    estimator=base_rf,
    param_distributions=param_dist,
    n_iter=10,  
    scoring="neg_root_mean_squared_error",
    cv=3,       
    verbose=1,
    n_jobs=-1,
    random_state=42,
    refit=True
)

search.fit(X_train, y_train)

best_rf = search.best_estimator_
print("Best RF params:\n", search.best_params_, "\n")

cv_scores = cross_validate(
    best_rf, X_train, y_train,
    cv=cv if cv_groups is None else [(tr, va) for tr, va in cv.split(X_train, y_train, groups=cv_groups)],
    scoring=("r2", "neg_root_mean_squared_error", "neg_mean_absolute_error"),
    n_jobs=-1,
    return_train_score=False
)
print("CV performance (mean ± std):")
print(f"  R²         : {cv_scores['test_r2'].mean():.3f} ± {cv_scores['test_r2'].std():.3f}")
print(f"  RMSE       : {(-cv_scores['test_neg_root_mean_squared_error']).mean():.3f} ± {(-cv_scores['test_neg_root_mean_squared_error']).std():.3f}")
print(f"  MAE        : {(-cv_scores['test_neg_mean_absolute_error']).mean():.3f} ± {(-cv_scores['test_neg_mean_absolute_error']).std():.3f}\n")

y_pred = best_rf.predict(X_test)
mse  = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae  = mean_absolute_error(y_test, y_pred)
r2   = r2_score(y_test, y_pred)

print("Held-out TEST performance:")
print(f"  MSE  : {mse:.3f}")
print(f"  RMSE : {rmse:.3f}")
print(f"  MAE  : {mae:.3f}")
print(f"  R²   : {r2:.3f}\n")

plt.figure(figsize=(6,6))
plt.scatter(y_test, y_pred, s=6, alpha=0.5)
plt.plot([0,100],[0,100], ls="--")
plt.xlabel("True PotabilityScore")
plt.ylabel("Predicted PotabilityScore")
plt.title("Calibration: True vs Predicted")
plt.show()

fi = pd.Series(best_rf.feature_importances_, index=features).sort_values(ascending=False)
plt.figure(figsize=(8,5))
fi.plot(kind="bar")
plt.title("RandomForest Feature Importance")
plt.ylabel("Importance")
plt.tight_layout()
plt.show()
print("\nRF internal importances:\n", fi, "\n")

perm = permutation_importance(best_rf, X_test, y_test, n_repeats=10, random_state=42, n_jobs=-1)
pi = pd.Series(perm.importances_mean, index=features).sort_values(ascending=False)
plt.figure(figsize=(8,5))
pi.plot(kind="bar")
plt.title("Permutation Importance (on TEST)")
plt.ylabel("Δ RMSE when permuted")
plt.tight_layout()
plt.show()
print("\nPermutation importances (mean):\n", pi, "\n")

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
    new_rule  = recompute_rule_score(new)

    base_pred = float(best_rf.predict(pd.DataFrame([base]))[0])
    new_pred  = float(best_rf.predict(pd.DataFrame([new]))[0])

    def label_from_vals(vals):
        if (vals["NO3"] > LIMITS["NO3"]) or (vals["F"] > LIMITS["F"]) or (vals["U(ppb)"] > LIMITS["U(ppb)"]):
            return "Critical"
        if not (LIMITS["pH"][0] <= vals["pH"] <= LIMITS["pH"][1]): return "Critical"
        for c in features:
            if c == "pH": continue
            if vals[c] > LIMITS[c]: return "Critical"
        return "Safe"

    base_label = label_from_vals(base)
    new_label  = label_from_vals(new)

    return {
        "base_rule_score": base_rule,
        "new_rule_score": new_rule,
        "base_model_pred": base_pred,
        "new_model_pred": new_pred,
        "base_label": base_label,
        "new_label": new_label,
        "delta_rule": new_rule - base_rule,
        "delta_model": new_pred - base_pred
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


explainer = shap.TreeExplainer(best_rf)

def explain_prediction(row):
    x_row = row[features].values.reshape(1, -1)
    
    pred = float(best_rf.predict(x_row)[0])
    
    shap_vals = explainer.shap_values(x_row)[0]
    
    contributions = dict(zip(features, shap_vals))
    sorted_contribs = dict(sorted(contributions.items(), key=lambda kv: abs(kv[1]), reverse=True))
    
    return {
        "Predicted Score": pred,
        "Contributions": sorted_contribs
    }

