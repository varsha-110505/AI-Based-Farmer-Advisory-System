from app.database.mongodb import db

async def create_indexes():
    await db.farmers.create_index("farmer_id", unique=True)
    await db.farmers.create_index("phone", unique=True)