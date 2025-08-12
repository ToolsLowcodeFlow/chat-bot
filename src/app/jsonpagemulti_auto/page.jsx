// /app/vehicle-upload/page.js
"use client";

import { useState } from "react";

export default function VehicleUploader() {
  const [vehicleJson, setVehicleJson] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      const res = await fetch("/api/vehicle-upload-Automatic", {
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

  const handleAutoImport = async () => {
    setIsLoading(true);
    setMessage("🔄 Fetching vehicles from AutoTrader API...");

    try {
      const res = await fetch("/api/vehicle-upload-Automatic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(
          `✅ Successfully imported ${result.count} vehicles from AutoTrader API`
        );
        // Optionally clear the textarea since we're importing from API
        setVehicleJson("");
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      setMessage(`❌ Network error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Vehicle Data Management</h1>

      {/* Auto Import Section */}
      <div className="mb-8 p-4 border rounded-lg bg-blue-50">
        <h2 className="text-lg font-semibold mb-3">
          🚀 Auto Import from AutoTrader
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Automatically fetch vehicle data from AutoTrader API and import to
          database
        </p>
        <button
          onClick={handleAutoImport}
          disabled={isLoading}
          className={`px-6 py-3 rounded font-semibold text-white transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? "⏳ Importing..." : "🔄 Import Vehicles Automatically"}
        </button>
      </div>

      {/* Manual Upload Section */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-3">📝 Manual JSON Upload</h2>
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
      </div>

      {message && (
        <div
          className={`mt-4 p-3 rounded text-sm ${
            message.includes("✅")
              ? "bg-green-100 text-green-800"
              : message.includes("❌")
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
