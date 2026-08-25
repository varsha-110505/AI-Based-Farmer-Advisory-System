from pydantic import BaseModel, Field


class FarmerRegister(BaseModel):
    name: str
    phone: str = Field(..., min_length=10, max_length=10)
    password: str = Field(..., min_length=6)
    language: str
    pincode: str = Field(..., min_length=6, max_length=6)


class FarmerLogin(BaseModel):
    farmer_id: int
    password: str