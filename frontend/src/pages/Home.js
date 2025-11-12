// frontend/src/pages/Home.js
import React, { useState } from "react";
import EquipmentList from "../components/EquipmentList";

export default function Home() {
  const [refresh] = useState(false);

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "2rem auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "1rem", color: "#222" }}>🧰 Gestión de Equipos</h1>
      <EquipmentList refreshTrigger={refresh} />
    </div>
  );
}
