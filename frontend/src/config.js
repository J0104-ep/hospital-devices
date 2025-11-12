const isProduction = process.env.NODE_ENV === "production";

export const API_BASE_URL = isProduction
  ? "https://hospital-devices.onrender.com/api" // ✅ Backend en Render
  : "http://localhost:4000/api"; // 💻 Backend local para desarrollo
