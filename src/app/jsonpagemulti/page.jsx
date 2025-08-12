// /app/vehicle-upload/page.js
"use client";

import { useState } from "react";

export default function VehicleUploader() {
  const [vehicleJson, setVehicleJson] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    setMessage("Uploading...");
    try {
      const cleaned = vehicleJson.trim();
      const parsed = JSON.parse(cleaned);

      // Ensure it's an array
      if (!Array.isArray(parsed)) {
        setMessage("❌ Please provide an array of vehicle objects.");
        return;
      }

      const res = await fetch("/api/vehicle-upload-multi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(`✅ ${parsed.length} vehicle(s) inserted successfully.`);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      setMessage(`❌ Invalid JSON: ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Paste Vehicle JSON Array</h1>
      <textarea
        className="w-full h-80 p-4 border rounded font-mono text-sm"
        placeholder='Example: [{"vehicle": {...}}, {...}]'
        value={vehicleJson}
        onChange={(e) => setVehicleJson(e.target.value)}
      />
      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Submit Vehicles
      </button>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
