import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import BusinessInfoStep from "./wizard/BusinessInfoStep";
import EmployeeManagementStep from "./wizard/EmployeeManagementStep";
import BenefitSelectionStep from "./wizard/BenefitSelectionStep";
import ReviewStep from "./wizard/ReviewStep";
import LoadingSpinner from "./LoadingSpinner";

const ApplicationWizard = ({ businessOwnerId, setBusinessOwnerId }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form data
  const [businessOwner, setBusinessOwner] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedHealthPlan, setSelectedHealthPlan] = useState(null);
  const [selectedLifePlan, setSelectedLifePlan] = useState(null);
  const [ficaCalculation, setFicaCalculation] = useState(null);
  const [benefitPlans, setBenefitPlans] = useState([]);

  const steps = [
    { number: 1, name: "Business Information", component: BusinessInfoStep },
    { number: 2, name: "Employee Management", component: EmployeeManagementStep },
    { number: 3, name: "Benefit Selection", component: BenefitSelectionStep },
    { number: 4, name: "Review & Submit", component: ReviewStep }
  ];

  // Load benefit plans on mount
  useEffect(() => {
    loadBenefitPlans();
    if (businessOwnerId) {
      loadBusinessOwner(businessOwnerId);
      loadEmployees(businessOwnerId);
    }
  }, [businessOwnerId]);

  const loadBenefitPlans = async () => {
    try {
      const response = await axios.get(`${API}/benefit-plans`);
      setBenefitPlans(response.data);
    } catch (error) {
      console.error("Error loading benefit plans:", error);
    }
  };

  const loadBusinessOwner = async (ownerId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/business-owners/${ownerId}`);
      setBusinessOwner(response.data);
    } catch (error) {
      console.error("Error loading business owner:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async (ownerId) => {
    try {
      const response = await axios.get(`${API}/employees/business/${ownerId}`);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const calculateFICA = async () => {
    if (!businessOwnerId || employees.length === 0) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedHealthPlan) params.append('health_plan_id', selectedHealthPlan.id);
      if (selectedLifePlan) params.append('life_plan_id', selectedLifePlan.id);
      
      const url = `${API}/fica-calculation/${businessOwnerId}?${params.toString()}`;
      const response = await axios.post(url);
      setFicaCalculation(response.data);
    } catch (error) {
      console.error("Error calculating FICA:", error);
      setError("Error calculating FICA savings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  const submitApplication = async () => {
    try {
      setLoading(true);
      
      // Create application
      const applicationData = {
        business_owner_id: businessOwnerId,
        selected_health_plan_id: selectedHealthPlan?.id || null,
        selected_life_plan_id: selectedLifePlan?.id || null,
        notes: `Application submitted with ${employees.length} employees`
      };

      const response = await axios.post(`${API}/applications`, applicationData);
      
      // Update application status to submitted
      await axios.put(`${API}/applications/${response.data.id}`, {
        status: "submitted"
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting application:", error);
      setError("Error submitting application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">FICA Reduction Application</h1>
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between">
            {steps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => goToStep(step.number)}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  currentStep === step.number
                    ? "border-blue-500 text-blue-600"
                    : currentStep > step.number
                    ? "border-green-500 text-green-600"
                    : "border-gray-300 text-gray-500"
                } hover:text-gray-700 hover:border-gray-400`}
              >
                <span className="flex items-center justify-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 text-xs ${
                    currentStep === step.number
                      ? "bg-blue-500 text-white"
                      : currentStep > step.number
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}>
                    {currentStep > step.number ? "✓" : step.number}
                  </span>
                  <span className="hidden sm:block">{step.name}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CurrentStepComponent
          businessOwner={businessOwner}
          setBusinessOwner={setBusinessOwner}
          employees={employees}
          setEmployees={setEmployees}
          selectedHealthPlan={selectedHealthPlan}
          setSelectedHealthPlan={setSelectedHealthPlan}
          selectedLifePlan={selectedLifePlan}
          setSelectedLifePlan={setSelectedLifePlan}
          ficaCalculation={ficaCalculation}
          setFicaCalculation={setFicaCalculation}
          benefitPlans={benefitPlans}
          businessOwnerId={businessOwnerId}
          setBusinessOwnerId={setBusinessOwnerId}
          loadEmployees={loadEmployees}
          calculateFICA={calculateFICA}
          nextStep={nextStep}
          prevStep={prevStep}
          currentStep={currentStep}
          submitApplication={submitApplication}
          setError={setError}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default ApplicationWizard;