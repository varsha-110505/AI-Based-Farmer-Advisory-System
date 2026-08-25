from fastapi import APIRouter, HTTPException

from app.database.mongodb import db

router = APIRouter(
    prefix="/api/farmer",
    tags=["Farmer Profile"]
)


@router.get("/{farmer_id}/profile")
async def get_farmer_profile(farmer_id: int):

    farmer = await db.farmers.find_one(
        {"farmer_id": farmer_id},
        {"password": 0}
    )

    if not farmer:
        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )

    farmer["_id"] = str(farmer["_id"])

    return farmer