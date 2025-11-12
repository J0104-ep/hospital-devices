const isProduction = process.env.NODE_ENV === "production";

export const API_BASE_URL = isProduction
  ? "https://hospital-devices.onrender.com/api"
  : "http://localhost:4000/api";

// 👇 Agrega esta línea para compatibilidad con imports antiguos
export const API_BASE = API_BASE_URL;
