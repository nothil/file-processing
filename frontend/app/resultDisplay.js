"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultsDisplay() {
  const searchInfo = useSearchParams();
  const [resultData, setResultData] = useState(null);
  const dataInfo = searchInfo.get(data);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataParam = searchInfo.get("data"); // Fixed: Added quotes around 'data'

    if (dataParam) {
      try {
        const decodedData = decodeURIComponent(dataParam);
        const parsedData = JSON.parse(decodedData);
        setResultData(parsedData);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
    setLoading(false);
  }, [searchInfo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No Results Found
          </h1>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Go Back to Upload
          </button>
        </div>
      </div>
    );
  }
}

// const responseData = JSON.parse(decodeURIComponent(dataInfo));

return (
  <div className="py-12 px-4">
    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
      Processing Results
    </h1>
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Extracted Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <p className="mt-1 text-lg text-gray-900">{resultData.fullName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <p className="mt-1 text-lg text-gray-900">{resultData.age} years</p>
        </div>
      </div>
    </div>
    {resultData.standardExtraction && (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Standard Extraction Results
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raw Extracted Text
            </label>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-60 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {resultData.standardExtraction.rawText || "No text extracted"}
              </pre>
            </div>
          </div>
          {resultData.standardExtraction.structuredData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Structured Data
              </label>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(
                    resultData.standardExtraction.structuredData,
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);
