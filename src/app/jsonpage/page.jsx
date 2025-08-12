// /app/vehicle-upload/page.js (for Next.js 13+ with App Router)
"use client";

import { useState } from "react";

export default function VehicleUploader() {
  const [vehicleJson, setVehicleJson] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    setMessage("Uploading...");
    try {
      const parsed = JSON.parse(vehicleJson);

      const res = await fetch("/api/vehicle-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("✅ Vehicle inserted successfully.");
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      setMessage(`❌ Invalid JSON: ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Paste Full Vehicle JSON</h1>
      <textarea
        className="w-full h-80 p-4 border rounded font-mono text-sm"
        placeholder="Paste JSON here..."
        value={vehicleJson}
        onChange={(e) => setVehicleJson(e.target.value)}
      />
      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Submit Vehicle
      </button>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
