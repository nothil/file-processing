"use client";
import { useState } from "react";
import axios from "axios";

// The  endpoint for submitting the document and form data.
const API_ENDPOINT = "http://localhost:3001/api/process";

// List of allowed MIME types for file uploads.
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

export default function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    processMethod: "standard", // Default currently not working
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * the file input change, validates the file type, and updates the file state.
   * @param {Object} e - The DOM event object.
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]; // Use optional chaining for safety

    if (selectedFile) {
      // Check if the selected file's MIME type is in our allowed list
      if (!ALLOWED_MIME_TYPES.includes(selectedFile.type)) {
        setError(
          "Invalid file type. Please upload a PDF, JPEG, or PNG document."
        );
        setFile(null);
        return;
      }
      // If valid, store the file and clear any previous errors
      setFile(selectedFile);
      setError("");
    }
  };

  /**
   * Submits the form data and file to the backend API.
   * Handles loading state, error display, and navigation upon success.
   
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!file) {
      setError("Please select a document to upload.");
      setLoading(false);
      return;
    }

    try {
      // data payload using the FormData object for file uploads
      const submitData = new FormData();
      submitData.append("file", file);
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("dateOfBirth", formData.dateOfBirth);
      // submitData.append("processingMethod", formData.processMethod);

      // Use axios to post the multipart/form-data to the API
      const response = await axios.post(API_ENDPOINT, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Navigate to the results page, passing the response data via a URL query string
      const queryString = `data=${encodeURIComponent(
        JSON.stringify(response.data)
      )}`;
      // Replaced Next.js router.push with native window.location.href for broader compatibility
      window.location.href = `./results?${queryString}`;
    } catch (err) {
      // Handle API errors or network issues
      console.error("Submission error:", err);
      setError(
        err.response?.data?.error ||
          "A network or processing error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8 transition duration-300 hover:shadow-blue-300/50">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-3">
          Secure Document Processor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-gray-600 mb-6">
            Please fill in your details and upload the document for processing.
          </p>

          {/* Personal Information Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-150"
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
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-150"
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
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-150"
              required
            />
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Upload
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, JPEG, PNG. Maximum size 5MB.
            </p>
          </div>

          {/* Processing Method Selector */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Processing Method
            </legend>
            <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="processMethod"
                  value="standard"
                  checked={formData.processMethod === "standard"}
                  onChange={handleInputChange}
                  className="mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-700">
                  Standard Extraction (Fastest)
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="processMethod"
                  value="ai"
                  checked={formData.processMethod === "ai"}
                  onChange={handleInputChange}
                  className="mr-3 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-700">AI Extraction</span>
              </label>
            </div>
          </fieldset>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Submission Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {loading ? "Processing Document..." : "Submit & Process Document"}
          </button>
        </form>
      </div>
    </div>
  );
}
