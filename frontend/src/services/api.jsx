const API_URL = "http://127.0.0.1:8000";

// ==================== REGISTER ====================

export async function registerFarmer(
  name,
  phone,
  password,
  language,
  pincode
) {
  const response = await fetch(
    `${API_URL}/api/farmer/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        password: password,
        language: language,
        pincode: pincode,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.message ||
      "Registration failed"
    );
  }

  if (
    data.message !==
    "Registration Successful"
  ) {
    throw new Error(
      data.message ||
      "Registration failed"
    );
  }

  return data;
}


// ==================== LOGIN ====================

export async function loginFarmer(
  farmerId,
  password
) {
  const response = await fetch(
    `${API_URL}/api/farmer/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        farmer_id: Number(farmerId),
        password: password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Login failed"
    );
  }

  if (
    data.message !==
    "Login Successful"
  ) {
    throw new Error(
      data.message ||
      "Login failed"
    );
  }

  return data;
}


// ==================== FARMER PROFILE ====================

export async function getFarmerProfile(
  farmerId
) {
  const response = await fetch(
    `${API_URL}/api/farmer/${farmerId}/profile`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to fetch farmer profile"
    );
  }

  return data;
}


// ==================== AI CHAT ====================

export async function sendChatMessage(
  farmerId,
  message,
  language = "English"
) {
  const response = await fetch(
    `${API_URL}/api/chat/`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        farmer_id: Number(farmerId),
        message: message,
        language: language,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.message ||
      "Failed to get AI response"
    );
  }

  if (
    data.message ===
    "Farmer not found"
  ) {
    throw new Error(
      "Farmer not found"
    );
  }

  return data.response;
}