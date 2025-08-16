import React, { useState } from "react";

const LandingPage = () => {
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

    try {
      // Save lead to backend
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: leadData.firstName,
          last_name: leadData.lastName,
          email: leadData.email,
          phone: leadData.phone,
          business_name: leadData.businessName,
          number_of_employees: leadData.numberOfEmployees,
          industry: leadData.industry
        })
      });

      if (response.ok) {
        setSubmitted(true);
        
        // After successful lead capture, redirect to your URL
        setTimeout(() => {
          window.open("https://tr.ee/NoCost", "_blank");
        }, 2000);
      } else {
        throw new Error('Failed to submit lead');
      }

    } catch (error) {
      console.error("Error capturing lead:", error);
      alert("There was an error submitting your information. Please try again.");
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
            <div className="flex items-center space-x-4">
              <button
                onClick={handleApplyNow}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
              >
                Apply Now
              </button>
              <a 
                href="/admin" 
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Reduce Your FICA Taxes While Providing
            <span className="text-blue-600"> Better Employee Benefits</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Help your employees with added health benefits and permanent life insurance 
            while significantly reducing your business's FICA tax burden.
          </p>
          <div className="space-x-4">
            <button
              onClick={handleApplyNow}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Get Your Free Quote
            </button>
            <button
              onClick={handleLearnMore}
              className="bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition duration-200"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our FICA Reduction Program?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our program helps businesses save on taxes while providing valuable benefits to employees.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Reduce FICA Taxes</h4>
              <p className="text-gray-600">
                Significantly lower your business's FICA tax burden through our structured benefit program.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Better Health Benefits</h4>
              <p className="text-gray-600">
                Provide your employees with comprehensive health coverage that they'll truly value.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Permanent Life Insurance</h4>
              <p className="text-gray-600">
                Offer your employees permanent life insurance coverage with cash value accumulation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our simple process gets you started with FICA savings in just a few steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Apply Online</h4>
              <p className="text-gray-600">Complete our simple application with your business and employee information.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Choose Benefits</h4>
              <p className="text-gray-600">Select the health and life insurance plans that work best for your employees.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Approved</h4>
              <p className="text-gray-600">Our team reviews your application and provides approval within 24 hours.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Saving</h4>
              <p className="text-gray-600">Begin reducing your FICA taxes while providing better employee benefits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Reduce Your FICA Taxes?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already saving with our FICA reduction program.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={() => navigate("/apply")}
              className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              Apply for FICA Reduction
            </button>
            <button
              onClick={() => window.open("https://tr.ee/NoCost", "_blank")}
              className="w-full sm:w-auto bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition duration-200"
            >
              Get More Information
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">FICA Reduction Program</h4>
              <p className="text-gray-400">
                Helping businesses save on taxes while providing better employee benefits.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>FICA Tax Reduction</li>
                <li>Health Insurance</li>
                <li>Life Insurance</li>
                <li>Employee Benefits</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Contact Us</li>
                <li>Help Center</li>
                <li>Documentation</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FICA Reduction Program. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;