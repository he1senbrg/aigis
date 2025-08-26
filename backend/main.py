from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
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
    return {"message": "Data analyzed successfully", "data": data}

@app.post("/predict")
def predict_data(data: dict):
    print("Analyzing data:", data)
    return {"message": "Data analyzed successfully", "data": data}