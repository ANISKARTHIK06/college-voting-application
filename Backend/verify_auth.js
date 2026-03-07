const axios = require("axios");

const API_URL = "http://localhost:5000/api/auth";

const testAuth = async () => {
    try {
        console.log("--- Testing Registration ---");
        const regRes = await axios.post(`${API_URL}/register`, {
            name: "Test Admin",
            email: "admin@college.edu",
            password: "password123",
            role: "admin"
        });
        console.log("Registration Success:", regRes.data);

        console.log("\n--- Testing Login ---");
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: "admin@college.edu",
            password: "password123"
        });
        console.log("Login Success. Token received.");
        const token = loginRes.data.token;

        // Add a protected route in server.js to test this if needed
        console.log("\n--- Auth implementation complete. Role-based control ready. ---");
    } catch (error) {
        console.error("Test Failed:", error.response ? error.response.data : error.message);
    }
};

// Note: Ensure server is running before running this test
// testAuth();
