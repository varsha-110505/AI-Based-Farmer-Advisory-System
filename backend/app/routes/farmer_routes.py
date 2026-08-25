from fastapi import APIRouter
from app.database.mongodb import db
from app.schemas.farmer_schema import FarmerRegister, FarmerLogin
from app.services.location_service import get_location_and_weather
from app.services.farmer_service import (
    hash_password,
    generate_farmer_id,
    verify_password,
)
from app.models.farmer_model import create_farmer


router = APIRouter(prefix="/api/farmer", tags=["Farmer"])


@router.post("/register")
async def register_farmer(farmer: FarmerRegister):

    existing_farmer = await db.farmers.find_one(
        {"phone": farmer.phone}
    )

    if existing_farmer:
        return {"message": "Phone number already registered"}

    while True:
        farmer_id = generate_farmer_id()
        exists = await db.farmers.find_one(
            {"farmer_id": farmer_id}
        )

        if not exists:
            break

    hashed_password = hash_password(farmer.password)

    location = await get_location_and_weather(farmer.pincode)

    if location is None:
        return {"message": "Invalid Pincode"}

    farmer_data = create_farmer(
        farmer,
        hashed_password,
        farmer_id,
        location
    )

    await db.farmers.insert_one(farmer_data)

    return {
        "message": "Registration Successful",
        "farmer_id": farmer_id
    }


@router.post("/login")
async def login_farmer(farmer: FarmerLogin):

    existing_farmer = await db.farmers.find_one(
        {"farmer_id": farmer.farmer_id}
    )

    if not existing_farmer:
        return {"message": "Farmer ID not found"}

    if not verify_password(
        farmer.password,
        existing_farmer["password"]
    ):
        return {"message": "Incorrect password"}

    return {
        "message": "Login Successful",
        "farmer_id": existing_farmer["farmer_id"],
        "name": existing_farmer["name"]
    }


@router.get("/{farmer_id}/profile")
async def get_farmer_profile(farmer_id: int):

    farmer = await db.farmers.find_one(
        {"farmer_id": farmer_id}
    )

    if not farmer:
        return {"message": "Farmer not found"}

    return {
        "farmer_id": farmer["farmer_id"],
        "name": farmer["name"],
        "phone": farmer["phone"],
        "language": farmer["language"],
        "location": farmer["location"],
        "weather": farmer["weather"],
    }