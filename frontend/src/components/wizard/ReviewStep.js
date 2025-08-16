import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../App";

const ReviewStep = ({
  businessOwner,
  employees,
  selectedHealthPlan,
  selectedLifePlan,
  ficaCalculation,
  businessOwnerId,
  prevStep,
  submitApplication,
  setError,
  setLoading
}) => {
  const [eligibility, setEligibility] = useState(null);
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  useEffect(() => {
    if (businessOwnerId) {
      checkEligibility();
    }
  }, [businessOwnerId]);

  const checkEligibility = async () => {
    try {
      const response = await axios.get(`${API}/eligibility-check/${businessOwnerId}`);
      setEligibility(response.data);
    } catch (error) {
      console.error("Error checking eligibility:", error);
    }
  };

  const handleSubmit = async () => {
    if (!agreementAccepted) {
      setError("Please accept the terms and conditions to submit your application");
      return;
    }

    if (!eligibility || !eligibility.eligible) {
      setError("Your business does not meet the eligibility requirements");
      return;
    }

    await submitApplication();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateTotalBenefitCost = () => {
    let total = 0;
    if (selectedHealthPlan) {
      total += selectedHealthPlan.monthly_premium_per_employee * employees.length * 12;
    }
    if (selectedLifePlan) {
      total += selectedLifePlan.monthly_premium_per_employee * employees.length * 12;
    }
    return total;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit Application</h2>
        <p className="text-gray-600">
          Please review your information before submitting your FICA reduction program application.
        </p>
      </div>

      {/* Eligibility Check */}
      {eligibility && (
        <div className={`mb-6 p-4 rounded-lg border ${
          eligibility.eligible 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {eligibility.eligible ? (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                eligibility.eligible ? 'text-green-800' : 'text-red-800'
              }`}>
                {eligibility.eligible ? 'Eligible for FICA Reduction Program' : 'Eligibility Requirements Not Met'}
              </h3>
              <div className="mt-2 space-y-1">
                {eligibility.reasons.map((reason, index) => (
                  <p key={index} className={`text-sm ${
                    eligibility.eligible ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {reason}
                  </p>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Employees: {eligibility.employee_count} | Years in Business: {eligibility.years_in_business} | Industry: {eligibility.industry}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Owner Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Owner Information</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-sm text-gray-900">{businessOwner?.first_name} {businessOwner?.last_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-sm text-gray-900">{businessOwner?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-sm text-gray-900">{businessOwner?.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Business Name</label>
              <p className="text-sm text-gray-900">{businessOwner?.business_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Business Type</label>
              <p className="text-sm text-gray-900 capitalize">{businessOwner?.business_type?.replace('_', ' ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Industry</label>
              <p className="text-sm text-gray-900 capitalize">{businessOwner?.industry?.replace('_', ' ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Tax ID</label>
              <p className="text-sm text-gray-900">{businessOwner?.tax_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Years in Business</label>
              <p className="text-sm text-gray-900">{businessOwner?.years_in_business} years</p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Employee Summary ({employees.length} employees)
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
              <div className="text-sm text-gray-600">Total Employees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(employees.reduce((sum, emp) => sum + emp.annual_salary, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Annual Payroll</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(employees.reduce((sum, emp) => sum + emp.annual_salary, 0) / employees.length || 0)}
              </div>
              <div className="text-sm text-gray-600">Average Salary</div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current Benefits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.slice(0, 5).map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-3 py-2 text-sm text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-900">{employee.job_title}</td>
                    <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(employee.annual_salary)}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">
                      {employee.has_current_health_insurance && "Health"}
                      {employee.has_current_health_insurance && employee.has_current_life_insurance && ", "}
                      {employee.has_current_life_insurance && "Life"}
                      {!employee.has_current_health_insurance && !employee.has_current_life_insurance && "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {employees.length > 5 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                ... and {employees.length - 5} more employees
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Benefits */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Benefits</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          {selectedHealthPlan && (
            <div className="mb-4 p-4 bg-white rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedHealthPlan.name}</h4>
                  <p className="text-sm text-gray-600">{selectedHealthPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(selectedHealthPlan.monthly_premium_per_employee * employees.length)}/month
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(selectedHealthPlan.monthly_premium_per_employee * employees.length * 12)}/year
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Coverage: {formatCurrency(selectedHealthPlan.coverage_amount)} | 
                Deductible: {formatCurrency(selectedHealthPlan.deductible)}
              </div>
            </div>
          )}

          {selectedLifePlan && (
            <div className="mb-4 p-4 bg-white rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedLifePlan.name}</h4>
                  <p className="text-sm text-gray-600">{selectedLifePlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(selectedLifePlan.monthly_premium_per_employee * employees.length)}/month
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(selectedLifePlan.monthly_premium_per_employee * employees.length * 12)}/year
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Coverage: {formatCurrency(selectedLifePlan.coverage_amount)}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total Annual Benefit Cost:</span>
              <span>{formatCurrency(calculateTotalBenefitCost())}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FICA Savings Summary */}
      {ficaCalculation && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">FICA Savings Projection</h3>
          <div className={`rounded-lg p-6 ${
            ficaCalculation.net_savings >= 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(ficaCalculation.projected_fica_savings)}
                </div>
                <div className="text-sm text-gray-600">Annual FICA Savings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(calculateTotalBenefitCost())}
                </div>
                <div className="text-sm text-gray-600">Benefit Cost</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  ficaCalculation.net_savings >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(ficaCalculation.net_savings)}
                </div>
                <div className="text-sm text-gray-600">Net Savings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {ficaCalculation.net_savings >= 0 
                    ? Math.round((ficaCalculation.net_savings / calculateTotalBenefitCost()) * 100) || 0
                    : 0
                  }%
                </div>
                <div className="text-sm text-gray-600">Savings Rate</div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              ficaCalculation.net_savings >= 0 ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <p className={`text-sm ${
                ficaCalculation.net_savings >= 0 ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {ficaCalculation.net_savings >= 0 
                  ? `🎉 Your business will save ${formatCurrency(ficaCalculation.net_savings)} annually while providing comprehensive employee benefits.`
                  : `⚠️ While the benefits cost more than FICA savings, your employees will receive valuable health and life insurance coverage worth ${formatCurrency(calculateTotalBenefitCost())} annually.`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
        <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto text-sm text-gray-700">
          <p className="mb-3">
            By submitting this application, you acknowledge and agree to the following:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>All information provided is accurate and complete to the best of your knowledge.</li>
            <li>You understand that FICA savings are estimates and actual savings may vary based on IRS regulations and your specific business situation.</li>
            <li>Benefit plan premiums and coverage are subject to insurance carrier approval and may change.</li>
            <li>This application does not guarantee acceptance into the FICA reduction program.</li>
            <li>You authorize us to verify the information provided and contact you regarding this application.</li>
            <li>You understand that professional tax advice is recommended before making final decisions.</li>
            <li>All personal and business information will be kept confidential and secure.</li>
          </ul>
        </div>
        
        <div className="mt-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={agreementAccepted}
              onChange={(e) => setAgreementAccepted(e.target.checked)}
              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
              I have read and agree to the terms and conditions above, and I certify that all information provided is accurate.
            </span>
          </label>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={prevStep}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-200"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!agreementAccepted || (eligibility && !eligibility.eligible)}
          className={`px-8 py-3 rounded-lg font-semibold transition duration-200 ${
            agreementAccepted && (!eligibility || eligibility.eligible)
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;