// frontend/src/components/EquipmentForm.js
import React, { useState } from "react";
import { API_BASE_URL } from "../config";

export default function EquipmentForm({ onEquipmentCreated }) {
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("type", type);
      formData.append("brand", brand);
      formData.append("model", model);
      formData.append("serial", serial);
      formData.append("ownerName", ownerName);
      formData.append("notes", notes);
      if (image) formData.append("image", image);

      const res = await fetch(`${API_BASE_URL}/equipments`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Equipo registrado correctamente");
        setType("");
        setBrand("");
        setModel("");
        setSerial("");
        setOwnerName("");
        setNotes("");
        setImage(null);
        setPreview(null);
        if (onEquipmentCreated) onEquipmentCreated();
      } else {
        setMessage(data.error || "❌ Error al registrar el equipo");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="equipment-form"
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        background: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "1rem", color: "#333" }}>➕ Registrar nuevo equipo</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
        }}
      >
        <input
          type="text"
          placeholder="Tipo"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Marca"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          type="text"
          placeholder="Modelo"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          type="text"
          placeholder="Número de serie"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Propietario"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />
        <textarea
          placeholder="Notas"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>

        <div style={{ textAlign: "center" }}>
          <label>📸 Imagen del equipo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "block", margin: "0.5rem auto" }}
          />
          {preview && (
            <img
              src={preview}
              alt="Vista previa"
              style={{
                marginTop: "0.5rem",
                width: "100px",
                height: "100px",
                borderRadius: "10px",
                objectFit: "cover",
                border: "1px solid #ccc",
              }}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.8rem",
            border: "none",
            background: "#007bff",
            color: "white",
            fontSize: "1rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Guardando..." : "Registrar equipo"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#333" }}>{message}</p>
      )}
    </div>
  );
}
