import React, { useEffect, useState } from "react";

const BenefitSelectionStep = ({
  employees,
  selectedHealthPlan,
  setSelectedHealthPlan,
  selectedLifePlan,
  setSelectedLifePlan,
  benefitPlans,
  ficaCalculation,
  calculateFICA,
  nextStep,
  prevStep,
  setError
}) => {
  const [healthPlans, setHealthPlans] = useState([]);
  const [lifePlans, setLifePlans] = useState([]);

  useEffect(() => {
    // Separate plans by type
    const health = benefitPlans.filter(plan => 
      plan.plan_type === 'health_basic' || plan.plan_type === 'health_premium'
    );
    const life = benefitPlans.filter(plan => 
      plan.plan_type === 'life_basic' || plan.plan_type === 'life_premium'
    );
    
    setHealthPlans(health);
    setLifePlans(life);
  }, [benefitPlans]);

  useEffect(() => {
    // Recalculate FICA when plans are selected
    if ((selectedHealthPlan || selectedLifePlan) && employees.length > 0) {
      calculateFICA();
    }
  }, [selectedHealthPlan, selectedLifePlan, calculateFICA, employees.length]);

  const handleHealthPlanSelect = (plan) => {
    setSelectedHealthPlan(plan);
  };

  const handleLifePlanSelect = (plan) => {
    setSelectedLifePlan(plan);
  };

  const handleContinue = () => {
    if (!selectedHealthPlan && !selectedLifePlan) {
      setError("Please select at least one benefit plan to continue");
      return;
    }
    nextStep();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateMonthlyCost = (plan) => {
    if (!plan || employees.length === 0) return 0;
    return plan.monthly_premium_per_employee * employees.length;
  };

  const calculateAnnualCost = (plan) => {
    return calculateMonthlyCost(plan) * 12;
  };

  const PlanCard = ({ plan, isSelected, onSelect, type }) => (
    <div
      className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={() => onSelect(plan)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            type === 'health' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {plan.plan_type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(plan.monthly_premium_per_employee)}
          </div>
          <div className="text-sm text-gray-500">per employee/month</div>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{plan.description}</p>

      {plan.coverage_amount && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">Coverage: </span>
          <span className="text-sm text-gray-600">{formatCurrency(plan.coverage_amount)}</span>
        </div>
      )}

      {plan.deductible && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">Deductible: </span>
          <span className="text-sm text-gray-600">{formatCurrency(plan.deductible)}</span>
        </div>
      )}

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Features:</div>
        <ul className="space-y-1">
          {plan.features.map((feature, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start">
              <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Monthly Cost ({employees.length} employees):</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(calculateMonthlyCost(plan))}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Total Annual Cost:</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(calculateAnnualCost(plan))}
          </span>
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 flex items-center text-blue-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Selected
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Benefit Selection</h2>
        <p className="text-gray-600">
          Choose the health and life insurance plans that work best for your {employees.length} employees.
        </p>
      </div>

      {employees.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                Please add employees in the previous step to see benefit plan costs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Health Insurance Plans */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Health Insurance Plans</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {healthPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedHealthPlan?.id === plan.id}
              onSelect={handleHealthPlanSelect}
              type="health"
            />
          ))}
        </div>
        {!selectedHealthPlan && healthPlans.length > 0 && (
          <button
            onClick={() => setSelectedHealthPlan(null)}
            className={`mt-4 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors ${
              selectedHealthPlan === null ? 'border-blue-500 text-blue-600 bg-blue-50' : ''
            }`}
          >
            Skip Health Insurance (Not Recommended)
          </button>
        )}
      </div>

      {/* Life Insurance Plans */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Life Insurance Plans</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lifePlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedLifePlan?.id === plan.id}
              onSelect={handleLifePlanSelect}
              type="life"
            />
          ))}
        </div>
        {!selectedLifePlan && lifePlans.length > 0 && (
          <button
            onClick={() => setSelectedLifePlan(null)}
            className={`mt-4 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors ${
              selectedLifePlan === null ? 'border-blue-500 text-blue-600 bg-blue-50' : ''
            }`}
          >
            Skip Life Insurance (Not Recommended)
          </button>
        )}
      </div>

      {/* FICA Calculation Summary */}
      {ficaCalculation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            💰 Your Projected FICA Savings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(ficaCalculation.projected_fica_savings)}
              </div>
              <div className="text-sm text-gray-600">Annual FICA Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(ficaCalculation.health_benefit_cost + ficaCalculation.life_insurance_cost)}
              </div>
              <div className="text-sm text-gray-600">Total Benefit Cost</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${ficaCalculation.net_savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(ficaCalculation.net_savings)}
              </div>
              <div className="text-sm text-gray-600">Net Annual Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(ficaCalculation.total_employee_salaries)}
              </div>
              <div className="text-sm text-gray-600">Total Payroll</div>
            </div>
          </div>
          
          {ficaCalculation.net_savings >= 0 ? (
            <div className="mt-4 p-4 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800">
                🎉 Great news! Your business could save {formatCurrency(ficaCalculation.net_savings)} annually while providing better employee benefits.
              </p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ The selected benefits cost more than the FICA savings, but your employees will receive valuable health and life insurance coverage.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selection Summary */}
      {(selectedHealthPlan || selectedLifePlan) && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Benefits Summary</h3>
          <div className="space-y-3">
            {selectedHealthPlan && (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{selectedHealthPlan.name}</div>
                  <div className="text-sm text-gray-600">Health Insurance</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(calculateMonthlyCost(selectedHealthPlan))}/month
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(calculateAnnualCost(selectedHealthPlan))}/year
                  </div>
                </div>
              </div>
            )}
            {selectedLifePlan && (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{selectedLifePlan.name}</div>
                  <div className="text-sm text-gray-600">Life Insurance</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(calculateMonthlyCost(selectedLifePlan))}/month
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(calculateAnnualCost(selectedLifePlan))}/year
                  </div>
                </div>
              </div>
            )}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Benefits Cost:</span>
                <div className="text-right">
                  <div>
                    {formatCurrency(
                      (selectedHealthPlan ? calculateMonthlyCost(selectedHealthPlan) : 0) +
                      (selectedLifePlan ? calculateMonthlyCost(selectedLifePlan) : 0)
                    )}/month
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(
                      (selectedHealthPlan ? calculateAnnualCost(selectedHealthPlan) : 0) +
                      (selectedLifePlan ? calculateAnnualCost(selectedLifePlan) : 0)
                    )}/year
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={prevStep}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-200"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default BenefitSelectionStep;