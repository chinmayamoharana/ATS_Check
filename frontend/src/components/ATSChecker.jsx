import { useState } from "react";
import axios from "axios";

const ATSChecker = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState({
    ats_score: 0,
    missing_keywords: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload a resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/ats/check/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error checking ATS score");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          ATS Resume Checker
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Upload your resume and get an instant ATS score
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-xl p-6 cursor-pointer hover:bg-indigo-50 transition">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              className="hidden"
              required
            />
            <span className="text-indigo-600 font-medium">
              {resume ? resume.name : "Click to upload resume (.pdf, .docx)"}
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Analyzing Resume..." : "Check ATS Score"}
          </button>
        </form>

        {/* Result */}
        {!loading && result && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              ATS Score
            </h2>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700"
                style={{ width: `${result.ats_score}%` }}
              ></div>
            </div>

            <p className="mt-2 text-xl font-bold text-green-600">
              {result.ats_score}%
            </p>

            {/* Missing Keywords */}
            {/* {result.missing_keywords.length > 0 && (
              <div className="mt-5">
                <h3 className="font-semibold text-red-600 mb-2">
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords.map((word, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSChecker;
