from fastapi import FastAPI

app = FastAPI(
    title="AI-Based Farmer Query Support & Advisory System",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to AI-Based Farmer Query Support & Advisory System 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "Healthy"
    }