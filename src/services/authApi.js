import api from "./axios";

/**
 * Login user via DummyJSON auth endpoint OR Custom Admin credentials (Yashodip / Yashodip1234)
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} user data with accessToken
 */
export const loginUser = async (username, password) => {
  const cleanUsername = username.trim();
  const cleanPassword = password.trim();

  // 1. Check if matches custom admin credentials
  if (
    cleanUsername.toLowerCase() === "yashodip" &&
    (cleanPassword === "Yashodip1234" || cleanPassword === "Yash@123")
  ) {
    return {
      id: 1,
      username: "Yashodip",
      firstName: "Yashodip",
      lastName: "",
      email: "yashodip@nexgensis.com",
      gender: "male",
      image: "https://dummyjson.com/icon/emilys/128",
      accessToken: "mock_jwt_token_yashodip_" + Date.now(),
      refreshToken: "mock_refresh_token_yashodip_" + Date.now(),
    };
  }

  // 2. Otherwise send request to DummyJSON POST /auth/login
  try {
    const response = await api.post("/auth/login", {
      username: cleanUsername,
      password: cleanPassword,
      expiresInMins: 120,
    });
    return response.data;
  } catch (error) {
    // Fallback for custom credentials
    if (
      cleanUsername.toLowerCase() === "yashodip" &&
      (cleanPassword === "Yashodip1234" || cleanPassword === "Yash@123")
    ) {
      return {
        id: 1,
        username: "Yashodip",
        firstName: "Yashodip",
        lastName: "",
        email: "yashodip@nexgensis.com",
        image: "https://dummyjson.com/icon/emilys/128",
        accessToken: "mock_jwt_token_yashodip_" + Date.now(),
      };
    }
    throw error;
  }
};

/**
 * Get current authenticated user profile
 */
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
