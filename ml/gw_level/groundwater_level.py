import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from xgboost import XGBRegressor
import joblib
import optuna
#Loading the dataset and preprocessing it
df = pd.read_csv("datasets/gwr.csv")
df = df.dropna(axis=1, how='all')
df = df.dropna(subset=[
    'Annual Domestic and Industry Draft',
    'Annual Irrigation Draft',
    'Annual Groundwater Draft (Total)',
    'Annual Replenishable Groundwater Resources (Total)',
    'Natural Discharge During Non-Monsoon Season',
    'Net Groundwater Availability',
    'Stage of Groundwater Development (%)'
])

numeric_cols = [
    'Annual Domestic and Industry Draft',
    'Annual Irrigation Draft',
    'Annual Groundwater Draft (Total)',
    'Annual Replenishable Groundwater Resources (Total)',
    'Natural Discharge During Non-Monsoon Season',
    'Net Groundwater Availability',
    'Stage of Groundwater Development (%)'
]
for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors='coerce')

df = df.dropna()
X = df.drop(columns=['Stage of Groundwater Development (%)'], errors='ignore')
y = df['Stage of Groundwater Development (%)']

drop_cols = ['state', 'District Name', 'block']
X = X.drop(columns=[c for c in drop_cols if c in X.columns], errors='ignore')
#train test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
#Optuna hyperparameter tuning
def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 500, 2000, step=100),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.2, log=True),
        'max_depth': trial.suggest_int('max_depth', 3, 12),
        'subsample': trial.suggest_float('subsample', 0.5, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.5, 1.0),
        'reg_alpha': trial.suggest_float('reg_alpha', 1e-8, 10.0, log=True),
        'reg_lambda': trial.suggest_float('reg_lambda', 1e-8, 10.0, log=True)
    }
    model = XGBRegressor(**params, random_state=42, objective='reg:squarederror', early_stopping_rounds=50)
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    preds = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    return rmse

print("Running Optuna optimization... This may take a while.")
study = optuna.create_study(direction='minimize')
study.optimize(objective, n_trials=40) 
print("\nBest RMSE:", study.best_value)
print("Best Parameters:", study.best_params)
best_params = study.best_params
best_params.update({'random_state': 42, 'objective': 'reg:squarederror'})
model = XGBRegressor(**best_params)
model.fit(X_train, y_train)

# Evaluation
y_pred = model.predict(X_test)
r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print("\nFinal Model Performance After Optuna Tuning:")
print(f"R² Score: {r2:.4f}")
print(f"MAE: {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
#Classification the predicted results
def classify_stage(stage):
    if stage <= 70:
        return 'Safe'
    elif stage <= 90:
        return 'Semi-Critical'
    elif stage <= 100:
        return 'Critical'
    else:
        return 'Over-Exploited'

def predict_stage(sample):
    pred_stage = model.predict([sample])[0]
    category = classify_stage(pred_stage)
    return pred_stage, category

#testing the model
sample_input = [278.49, 607.78, 886.27, 6415.13, 0.073, 6089.62]
predicted_stage, category = predict_stage(sample_input)
print(f"\nPredicted Stage of Groundwater Development (%): {predicted_stage:.2f}")
print(f"Classification: {category}")

# Save trained model

joblib.dump(model, "gw_level.pkl")
