import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function uploadForm() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const router = useRouter();
  const [error, setError] = useState("");

  // form initial state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    processMethod: "standard",
  });

  // handle submit file function
  inputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // to do see if i can move this array outside
      const fileType = [
        "image/jpe",
        "image/png",
        "mage/jpg",
        "application/pdf",
      ];
      if (fileType.includes(file.type)) {
        setError("please upload a PDF or image");
      }
      setFile(file);
      setError("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Document Processor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={inputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={inputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={inputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Upload
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, JPEG, PNG
            </p>
          </div>

          {/* Processing Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processing Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="processMethod"
                  value="standard"
                  checked={formData.processMethod === "standard"}
                  onChange={inputChange}
                  className="mr-2"
                />
                <span>Standard Extraction (Tesseract.js)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="processMethod"
                  value="ai"
                  checked={formData.processMethod === "ai"}
                  onChange={inputChange}
                  className="mr-2"
                />
                <span>AI Extraction (Gemini AI)</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Process Document"}
          </button>
        </form>
      </div>
    </div>
  );
}
