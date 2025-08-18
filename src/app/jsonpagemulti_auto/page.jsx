"use client";
import { useState } from "react";

// Alert Component
const Alert = ({ type, message, onClose }) => {
  const baseClasses =
    "fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-lg border-l-4 z-50 transition-all duration-300";
  const typeClasses = {
    success: "bg-green-50 border-green-500 text-green-800",
    error: "bg-red-50 border-red-500 text-red-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
  };

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 text-lg">{icons[type]}</div>
        <div className="flex-1">
          <p className="font-medium text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
);

export default function VehicleUploader() {
  const [vehicleJson, setVehicleJson] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // Add alert function
  const addAlert = (type, message) => {
    const id = Date.now();
    const newAlert = { id, type, message };
    setAlerts((prev) => [...prev, newAlert]);

    // Auto-remove alert after 5 seconds
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };

  // Remove alert function
  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const handleUpload = async () => {
    if (!vehicleJson.trim()) {
      addAlert("warning", "Please enter vehicle JSON data before uploading.");
      return;
    }

    setIsManualLoading(true);
    setMessage("🔄 Processing JSON data...");

    try {
      const cleaned = vehicleJson.trim();
      const parsed = JSON.parse(cleaned);

      // Ensure it's an array
      if (!Array.isArray(parsed)) {
        addAlert("error", "Please provide an array of vehicle objects.");
        setMessage("❌ Invalid format: Expected an array of vehicles.");
        return;
      }

      if (parsed.length === 0) {
        addAlert("warning", "The vehicle array is empty.");
        setMessage("⚠️ No vehicles to upload.");
        return;
      }

      setMessage(`🔄 Uploading ${parsed.length} vehicle(s)...`);

      const res = await fetch("/api/vehicle-upload-Automatic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      const result = await res.json();

      if (res.ok) {
        const successMsg = `Successfully uploaded ${parsed.length} vehicle(s) to database!`;
        setMessage(`✅ ${successMsg}`);
        addAlert("success", successMsg);
        setVehicleJson(""); // Clear the textarea on success
      } else {
        const errorMsg = result.error || "Upload failed with unknown error";
        setMessage(`❌ Error: ${errorMsg}`);
        addAlert("error", `Upload failed: ${errorMsg}`);
      }
    } catch (err) {
      let errorMsg = "Invalid JSON format";
      if (err.message.includes("JSON")) {
        errorMsg = "Invalid JSON: Please check your JSON syntax";
      } else if (err.message.includes("Network")) {
        errorMsg = "Network error: Please check your connection";
      } else {
        errorMsg = err.message;
      }

      setMessage(`❌ Error: ${errorMsg}`);
      addAlert("error", errorMsg);
    } finally {
      setIsManualLoading(false);
    }
  };

  const handleAutoImport = async () => {
    setIsLoading(true);
    setMessage("🔄 Connecting to AutoTrader API...");
    addAlert("info", "Starting AutoTrader API import...");

    try {
      const res = await fetch("/api/vehicle-upload-Automatic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        if (result.count > 0) {
          const successMsg = `Successfully imported ${result.count} vehicles from AutoTrader API!`;
          setMessage(`✅ ${successMsg}`);
          addAlert("success", successMsg);
          setVehicleJson(""); // Clear textarea since we imported from API
        } else {
          const warningMsg =
            "AutoTrader API connected but no vehicles were found.";
          setMessage(`⚠️ ${warningMsg}`);
          addAlert("warning", warningMsg);
        }
      } else {
        const errorMsg = result.error || "AutoTrader API import failed";
        setMessage(`❌ Error: ${errorMsg}`);
        addAlert("error", `AutoTrader Import Failed: ${errorMsg}`);
      }
    } catch (err) {
      let errorMsg = "Network error: Unable to connect to AutoTrader API";
      if (err.message.includes("fetch")) {
        errorMsg = "Connection failed: Please check your internet connection";
      } else {
        errorMsg = `Import failed: ${err.message}`;
      }

      setMessage(`❌ ${errorMsg}`);
      addAlert("error", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Alert Container */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              🚗 Vehicle Data Management
            </h1>
            <p className="text-blue-100 mt-1">
              Import vehicles from AutoTrader API or upload JSON data
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Auto Import Section */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 p-2 rounded-lg mr-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  🚀 Auto Import from AutoTrader
                </h2>
              </div>

              <p className="text-gray-600 mb-4">
                Automatically fetch vehicle data from AutoTrader API and import
                to database
              </p>

              <button
                onClick={handleAutoImport}
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Importing from AutoTrader...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    🔄 Import Vehicles Automatically
                  </>
                )}
              </button>
            </div>

            {/* Manual Upload Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="bg-purple-500 p-2 rounded-lg mr-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  📝 Manual JSON Upload
                </h2>
              </div>

              <p className="text-gray-600 mb-4">
                Paste your vehicle JSON data below (must be an array format)
              </p>

              <div className="space-y-4">
                <textarea
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                  placeholder='Paste your vehicle JSON array here, e.g.:
[
  {
    "make": "BMW",
    "model": "X5",
    "year": 2023,
    "price": 45000
  },
  {
    "make": "Audi",
    "model": "A4",
    "year": 2022,
    "price": 35000
  }
]'
                  value={vehicleJson}
                  onChange={(e) => setVehicleJson(e.target.value)}
                />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {vehicleJson.trim() ? (
                      <>
                        <span className="text-green-600 font-medium">
                          {vehicleJson.trim().length} characters
                        </span>
                        {vehicleJson.trim().startsWith("[") ? (
                          <span className="text-green-600 ml-2">
                            ✓ Looks like valid array format
                          </span>
                        ) : (
                          <span className="text-orange-600 ml-2">
                            ⚠ Should start with '['
                          </span>
                        )}
                      </>
                    ) : (
                      "No data entered"
                    )}
                  </div>

                  <button
                    onClick={() => setVehicleJson("")}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Clear textarea"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={isManualLoading || !vehicleJson.trim()}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                    isManualLoading || !vehicleJson.trim()
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  {isManualLoading ? (
                    <>
                      <LoadingSpinner />
                      Processing Upload...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Submit Vehicles
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Status Message */}
            {message && (
              <div className="bg-white border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    {isLoading || isManualLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    ) : message.includes("✅") ? (
                      <div className="text-green-500 text-xl">✅</div>
                    ) : message.includes("❌") ? (
                      <div className="text-red-500 text-xl">❌</div>
                    ) : message.includes("⚠️") ? (
                      <div className="text-yellow-500 text-xl">⚠️</div>
                    ) : (
                      <div className="text-blue-500 text-xl">ℹ️</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        message.includes("✅")
                          ? "text-green-800"
                          : message.includes("❌")
                          ? "text-red-800"
                          : message.includes("⚠️")
                          ? "text-yellow-800"
                          : "text-blue-800"
                      }`}
                    >
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">💡 Quick Tips:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Use <strong>Auto Import</strong> to fetch data directly from
                  AutoTrader API
                </li>
                <li>
                  • For <strong>Manual Upload</strong>, ensure your JSON is a
                  valid array format
                </li>
                <li>• Large datasets are processed in batches automatically</li>
                <li>
                  • Check browser console for detailed error information if
                  needed
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
