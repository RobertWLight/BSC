import React, { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    // Redirect to your site immediately
    window.location.href = "https://tr.ee/NoCost";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Redirecting to FICA Reduction Program...
        </h2>
        <p className="text-gray-600 mb-4">
          Business owners! Apply for your FICA reduction program today!<br/>
          Give your employees added health benefits and PERMANENT life insurance.
        </p>
        <p className="text-sm text-gray-500">
          If you're not redirected automatically, 
          <a 
            href="https://tr.ee/NoCost" 
            className="text-blue-600 hover:text-blue-800 ml-1"
            target="_blank" 
            rel="noopener noreferrer"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;