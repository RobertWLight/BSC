import React, { useState } from "react";
import "./App.css";

function App() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    numberOfEmployees: "",
    industry: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeadData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate lead capture (you can integrate with your CRM here)
    try {
      // Store lead data to backend or send to your system
      console.log("Lead captured:", leadData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      
      // After successful lead capture, redirect to your URL
      setTimeout(() => {
        window.open("https://tr.ee/NoCost", "_blank");
      }, 2000);

    } catch (error) {
      console.error("Error capturing lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyNow = () => {
    setShowLeadForm(true);
  };

  const handleLearnMore = () => {
    setShowLeadForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">FICA Reduction Program</h1>
            </div>
            <button
              onClick={handleApplyNow}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Apply Now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            <span className="text-blue-600">Save Up To $1,100/Year</span>
            <br />Per Employee
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Business owners! Apply for your FICA reduction program today! 
            Give your employees added health benefits and PERMANENT life insurance.
          </p>
          <div className="space-x-4">
            <button
              onClick={handleApplyNow}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Get Started - No Cost Application
            </button>
            <button
              onClick={handleLearnMore}
              className="bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition duration-200"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Key Benefit Box */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 mb-12 text-center">
          <h3 className="text-3xl font-bold text-green-800 mb-4">
            $100,000 Whole Life Insurance
          </h3>
          <p className="text-lg text-green-700 mb-2">
            Zero cost - guaranteed issue, no health questions
          </p>
          <p className="text-2xl font-bold text-gray-900">
            ALL at Zero $ net cost to Employer or Employee!!!
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">What Your Employees Receive</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.781 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">GenericRx - $0 Copay</h4>
              <p className="text-gray-600">
                Over 1000 of the most common generic prescriptions at NO cost or copay, with more additional discounted prescriptions.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Labs - $0 Copay</h4>
              <p className="text-gray-600">
                Over 1200 labs including: blood, urine, cytology, pathology, and cultures.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">In-Person Urgent Care - $0 Copay</h4>
              <p className="text-gray-600">
                Get up to 3 in-person urgent care visits each year.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Virtual Primary & Urgent Care</h4>
              <p className="text-gray-600">
                Get virtual care & urgent care 24/7/365.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">TeleCounseling</h4>
              <p className="text-gray-600">
                Get virtual counseling with US based Masters-Level Clinicians.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-6">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Care Monitoring & Management</h4>
              <p className="text-gray-600">
                Tailored healthcare experience for employees & their household.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-12 bg-gray-50 rounded-lg p-8">
            <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Hospital Bill Eraser & Care Navigation
            </h4>
            <p className="text-lg text-gray-600 text-center">
              Reduce or even eliminate large medical hospital bills, find low-cost providers, 
              know the cost before stepping in the door.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-4">
            Ready to Save Up To $1,100 Per Employee?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Apply for your FICA reduction program today and give your employees 
            incredible benefits at zero net cost!
          </p>
          <button
            onClick={handleApplyNow}
            className="bg-white text-blue-600 px-10 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition duration-200"
          >
            Apply Now - Get Started Today!
          </button>
          <div className="mt-4">
            <p className="text-blue-100 text-sm">
              Click to visit: <span className="font-mono">tr.ee/NoCost</span>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h4 className="text-2xl font-bold mb-4">FICA Reduction Program</h4>
          <p className="text-gray-400 mb-6">
            Business owners! Apply for your FICA reduction program today!<br />
            Give your employees added health benefits and PERMANENT life insurance.
          </p>
          <button
            onClick={handleApplyNow}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Visit tr.ee/NoCost
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;