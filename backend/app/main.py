from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.mongodb import db
from app.routes.farmer_routes import router as farmer_router
from app.routes.chat_routes import router as chat_router
from app.routes.disease_routes import router as disease_router
from app.routes.profile_routes import router as profile_router
from app.routes.tts_routes import router as tts_router

app = FastAPI(
    title="AI-Based Farmer Query Support & Advisory System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(farmer_router)
app.include_router(chat_router)
app.include_router(disease_router)
app.include_router(profile_router)
app.include_router(tts_router)


@app.get("/")
async def home():
    return {"message": "Backend Running Successfully 🚀"}


@app.get("/health")
async def health():
    try:
        await db.command("ping")
        return {
            "status": "Healthy",
            "database": "Connected ✅"
        }
    except Exception as e:
        return {
            "status": "Failed",
            "database": str(e)
        }