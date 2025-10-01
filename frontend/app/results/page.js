"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaUser,
  FaBirthdayCake,
  FaBolt,
  FaFileAlt,
  FaRobot,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";

export default function ResultsDisplay() {
  const searchParams = useSearchParams();
  const [resultData, setResultData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataParam = searchParams.get("data");

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
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            No Results Found
          </h1>
          <p className="text-gray-600 mb-6">
            Please go back and process a document first.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            ← Go Back to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"></div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Processing Results
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 p-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <span className="text-xl">
                <FaUser className="w-6 h-6" />
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Full Name</h3>
              <p className="text-blue-100 text-sm">Extracted from document</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold truncate">{resultData.fullName}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <span className="text-xl">
                <FaBirthdayCake className="w-6 h-6" />
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Age</h3>
              <p className="text-green-100 text-sm">
                Calculated from date of birth
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">{resultData.age} years old</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <span className="text-xl">
                <FaBolt className="w-6 h-6" />
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Processing Method</h3>
              <p className="text-purple-100 text-sm">Analyzing method</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold capitalize">
              {resultData.processingMethod}
            </p>
            <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
              {resultData.processingMethod === "ai" ? "AI Powered" : "Standard"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-xl text-white">
                <FaFileAlt className="w-6 h-6" />
              </span>
            </div>
            <div className="p-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Raw Extracted Text
              </h2>
              <p className="text-gray-600">
                {resultData.standardExtraction?.extractionMethod === "pdf-parse"
                  ? "Text extracted from PDF document"
                  : "Content from your uploaded file"}
              </p>
            </div>
          </div>
          {resultData.standardExtraction?.fileType && (
            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              {resultData.standardExtraction.fileType}
            </span>
          )}
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl">
          {resultData.standardExtraction?.rawText ? (
            <div className="max-h-96 overflow-y-auto">
              <pre className="text-gray-800 whitespace-pre-wrap font-mono leading-relaxed text-sm">
                {resultData.standardExtraction.rawText}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-orange-600">
                  <FaRobot className="w-6 h-6" />
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Text Extracted
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                The document processing didn't return any text content. This
                could be due to the document type or content format.
              </p>
            </div>
          )}
        </div>

        {resultData.standardExtraction?.rawText && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">
                {resultData.standardExtraction.rawText.length.toLocaleString()}
              </div>
              <div className="text-sm text-blue-800">Characters</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="text-2xl font-bold text-green-600">
                {resultData.standardExtraction.rawText
                  .split(/\s+/)
                  .filter((word) => word.length > 0)
                  .length.toLocaleString()}
              </div>
              <div className="text-sm text-green-800">Words</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="text-2xl font-bold text-purple-600">
                {resultData.standardExtraction.rawText
                  .split("\n")
                  .length.toLocaleString()}
              </div>
              <div className="text-sm text-purple-800">Lines</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="text-2xl font-bold text-orange-600">
                {Math.ceil(
                  resultData.standardExtraction.rawText.length / 5 / 200
                )}
              </div>
              <div className="text-sm text-orange-800">Reading Minutes</div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl inline-flex items-center"
        >
          <span className="mr-2">
            <FaArrowLeft className="w-6 h-6" />
          </span>
          Process Another Document
        </button>
      </div>
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Processed on {new Date(resultData.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
