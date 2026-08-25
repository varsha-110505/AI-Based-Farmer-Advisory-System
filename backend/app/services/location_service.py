import os
import httpx


async def get_location_and_weather(pincode: str):

    api_key = os.getenv("OPENWEATHER_API_KEY")

    empty_location = {
        "pincode": pincode,
        "district": "",
        "state": "",
        "latitude": None,
        "longitude": None
    }

    if not api_key:
        return {
            "location": empty_location,
            "weather": None
        }

    async with httpx.AsyncClient() as client:

#get coordinates from pincode

        geo_url = (
            f"https://api.openweathermap.org/geo/1.0/zip"
            f"?zip={pincode},IN&appid={api_key}"
        )

        geo_response = await client.get(geo_url)

        if geo_response.status_code != 200:
            return {
                "location": empty_location,
                "weather": None
            }

        geo_data = geo_response.json()

        latitude = geo_data.get("lat")
        longitude = geo_data.get("lon")

        # ZIP API gives us the area's name
        area_name = geo_data.get("name", "")

#reverse geocoding

        reverse_url = (
            f"https://api.openweathermap.org/geo/1.0/reverse"
            f"?lat={latitude}&lon={longitude}"
            f"&limit=1&appid={api_key}"
        )

        reverse_response = await client.get(reverse_url)

        district = area_name
        state = ""

        if reverse_response.status_code == 200:

            reverse_data = reverse_response.json()

            if reverse_data:
                location_data = reverse_data[0]

                district = location_data.get(
                    "name",
                    area_name
                )

                state = location_data.get(
                    "state",
                    ""
                )
#to get weather
        weather_url = (
            f"https://api.openweathermap.org/data/2.5/weather"
            f"?lat={latitude}&lon={longitude}"
            f"&appid={api_key}&units=metric"
        )

        weather_response = await client.get(weather_url)

        if weather_response.status_code != 200:
            return {
                "location": {
                    "pincode": pincode,
                    "district": district,
                    "state": state,
                    "latitude": latitude,
                    "longitude": longitude
                },
                "weather": None
            }

        weather_data = weather_response.json()

        return {
            "location": {
                "pincode": pincode,
                "district": district,
                "state": state,
                "latitude": latitude,
                "longitude": longitude
            },

            "weather": {
                "temperature": weather_data["main"]["temp"],
                "humidity": weather_data["main"]["humidity"],
                "condition": weather_data["weather"][0]["main"],
                "description": weather_data["weather"][0]["description"],
                "wind_speed": weather_data["wind"]["speed"]
            }
        }