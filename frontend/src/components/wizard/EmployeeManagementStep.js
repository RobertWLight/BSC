import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../App";

const EmployeeManagementStep = ({
  employees,
  setEmployees,
  businessOwnerId,
  loadEmployees,
  nextStep,
  prevStep,
  setError,
  setLoading
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    job_title: "",
    annual_salary: "",
    hire_date: "",
    birth_date: "",
    has_current_health_insurance: false,
    has_current_life_insurance: false,
    current_health_premium: "",
    current_life_premium: ""
  });

  useEffect(() => {
    if (businessOwnerId) {
      loadEmployees(businessOwnerId);
    }
  }, [businessOwnerId, loadEmployees]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setEmployeeForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      job_title: "",
      annual_salary: "",
      hire_date: "",
      birth_date: "",
      has_current_health_insurance: false,
      has_current_life_insurance: false,
      current_health_premium: "",
      current_life_premium: ""
    });
    setShowAddForm(false);
    setEditingEmployee(null);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    const requiredFields = [
      "first_name", "last_name", "email", "phone", "job_title",
      "annual_salary", "hire_date", "birth_date"
    ];
    
    for (const field of requiredFields) {
      if (!employeeForm[field]) {
        setError(`Please fill in all required fields. Missing: ${field.replace('_', ' ')}`);
        return;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employeeForm.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate salary
    if (isNaN(employeeForm.annual_salary) || employeeForm.annual_salary <= 0) {
      setError("Annual salary must be a valid positive number");
      return;
    }

    try {
      setLoading(true);
      
      const employeeData = {
        ...employeeForm,
        business_owner_id: businessOwnerId,
        annual_salary: parseFloat(employeeForm.annual_salary),
        current_health_premium: employeeForm.current_health_premium ? parseFloat(employeeForm.current_health_premium) : null,
        current_life_premium: employeeForm.current_life_premium ? parseFloat(employeeForm.current_life_premium) : null
      };

      await axios.post(`${API}/employees`, employeeData);
      
      // Reload employees list
      await loadEmployees(businessOwnerId);
      
      resetForm();
    } catch (error) {
      console.error("Error adding employee:", error);
      setError("Error adding employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API}/employees/${employeeId}`);
      await loadEmployees(businessOwnerId);
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Error deleting employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (employees.length === 0) {
      setError("Please add at least one employee to continue");
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Management</h2>
        <p className="text-gray-600">
          Add your employees to calculate potential FICA savings and benefit costs.
        </p>
      </div>

      {/* Current Employees */}
      {employees.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Current Employees ({employees.length})
            </h3>
            <div className="text-sm text-gray-600">
              Total Annual Payroll: {formatCurrency(employees.reduce((sum, emp) => sum + emp.annual_salary, 0))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Annual Salary
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Benefits
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.job_title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(employee.annual_salary)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col space-y-1">
                        {employee.has_current_health_insurance && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Health: {employee.current_health_premium ? formatCurrency(employee.current_health_premium) : 'Yes'}
                          </span>
                        )}
                        {employee.has_current_life_insurance && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Life: {employee.current_life_premium ? formatCurrency(employee.current_life_premium) : 'Yes'}
                          </span>
                        )}
                        {!employee.has_current_health_insurance && !employee.has_current_life_insurance && (
                          <span className="text-gray-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Button */}
      {!showAddForm && (
        <div className="text-center py-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Employee
          </button>
        </div>
      )}

      {/* Add Employee Form */}
      {showAddForm && (
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Employee</h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={employeeForm.first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={employeeForm.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={employeeForm.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={employeeForm.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={employeeForm.job_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Salary *
                </label>
                <input
                  type="number"
                  name="annual_salary"
                  value={employeeForm.annual_salary}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hire Date *
                </label>
                <input
                  type="date"
                  name="hire_date"
                  value={employeeForm.hire_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Date *
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={employeeForm.birth_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Current Benefits */}
            <div className="border-t pt-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Current Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="has_current_health_insurance"
                      checked={employeeForm.has_current_health_insurance}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Has Current Health Insurance</span>
                  </label>
                  {employeeForm.has_current_health_insurance && (
                    <div className="mt-2">
                      <input
                        type="number"
                        name="current_health_premium"
                        value={employeeForm.current_health_premium}
                        onChange={handleInputChange}
                        placeholder="Monthly premium ($)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="has_current_life_insurance"
                      checked={employeeForm.has_current_life_insurance}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Has Current Life Insurance</span>
                  </label>
                  {employeeForm.has_current_life_insurance && (
                    <div className="mt-2">
                      <input
                        type="number"
                        name="current_life_premium"
                        value={employeeForm.current_life_premium}
                        onChange={handleInputChange}
                        placeholder="Monthly premium ($)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Add Employee
              </button>
            </div>
          </form>
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
          Continue to Benefit Selection
        </button>
      </div>
    </div>
  );
};

export default EmployeeManagementStep;