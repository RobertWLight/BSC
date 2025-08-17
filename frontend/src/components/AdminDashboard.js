import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    todayLeads: 0,
    thisWeekLeads: 0,
    thisMonthLeads: 0
  });

  // Set your 4-digit PIN here
  const ADMIN_PIN = '1234';

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadLeads();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      setPinError('');
      loadLeads();
    } else {
      setPinError('Incorrect PIN. Please try again.');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    setPinInput('');
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 4) {
      setPinInput(value);
      setPinError('');
    }
  };

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/leads`);
      if (response.ok) {
        const leadsData = await response.json();
        setLeads(leadsData);
        calculateStats(leadsData);
      } else {
        console.error("Failed to load leads");
      }
    } catch (error) {
      console.error("Error loading leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (leadsData) => {
    const now = new Date();
    
    // Convert to EST/EDT for proper day calculations
    const nowEST = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const today = new Date(nowEST.getFullYear(), nowEST.getMonth(), nowEST.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const thisMonthStart = new Date(nowEST.getFullYear(), nowEST.getMonth(), 1);

    const todayLeads = leadsData.filter(lead => {
      const leadDate = new Date(lead.created_at);
      const leadDateEST = new Date(leadDate.toLocaleString("en-US", {timeZone: "America/New_York"}));
      const leadDay = new Date(leadDateEST.getFullYear(), leadDateEST.getMonth(), leadDateEST.getDate());
      return leadDay.getTime() === today.getTime();
    }).length;

    const thisWeekLeads = leadsData.filter(lead => {
      const leadDate = new Date(lead.created_at);
      const leadDateEST = new Date(leadDate.toLocaleString("en-US", {timeZone: "America/New_York"}));
      return leadDateEST >= thisWeekStart;
    }).length;

    const thisMonthLeads = leadsData.filter(lead => {
      const leadDate = new Date(lead.created_at);
      const leadDateEST = new Date(leadDate.toLocaleString("en-US", {timeZone: "America/New_York"}));
      return leadDateEST >= thisMonthStart;
    }).length;

    setStats({
      totalLeads: leadsData.length,
      todayLeads,
      thisWeekLeads,
      thisMonthLeads
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const dateTimeString = date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const timeZoneName = date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      timeZoneName: 'short'
    }).split(', ')[1];
    return `${dateTimeString} ${timeZoneName}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const timeString = date.toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const timeZoneName = date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      timeZoneName: 'short'
    }).split(', ')[1];
    return `${timeString} ${timeZoneName}`;
  };

  const getEmployeeRange = (range) => {
    const ranges = {
      "2-5": "2-5 employees",
      "6-10": "6-10 employees", 
      "11-25": "11-25 employees",
      "26-50": "26-50 employees",
      "51-100": "51-100 employees",
      "100+": "100+ employees"
    };
    return ranges[range] || range;
  };

  const exportLeads = () => {
    const csvData = [
      ['Date', 'Name', 'Email', 'Phone', 'Business', 'Employees', 'Industry'],
      ...leads.map(lead => [
        formatDate(lead.created_at),
        `${lead.first_name} ${lead.last_name}`,
        lead.email,
        lead.phone,
        lead.business_name,
        lead.number_of_employees,
        lead.industry || 'Not specified'
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fica-leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Show PIN entry form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter 4-digit PIN to access admin dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePinSubmit}>
            <div>
              <label htmlFor="pin" className="sr-only">
                PIN
              </label>
              <input
                id="pin"
                name="pin"
                type="password"
                value={pinInput}
                onChange={handlePinChange}
                maxLength="4"
                placeholder="Enter 4-digit PIN"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-lg text-center text-2xl tracking-widest"
                style={{ letterSpacing: '0.5em' }}
              />
            </div>
            
            {pinError && (
              <div className="text-red-600 text-sm text-center">{pinError}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={pinInput.length !== 4}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  pinInput.length === 4
                    ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Access Dashboard
              </button>
            </div>
            
            <div className="text-center">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                ← Back to Main Site
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Show loading spinner while loading leads (after authentication)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FICA Program - Lead Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                All times shown in Eastern Time (EST/EDT) • Last updated: {new Date().toLocaleString('en-US', {
                  timeZone: 'America/New_York',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })} {new Date().toLocaleString('en-US', {
                  timeZone: 'America/New_York',
                  timeZoneName: 'short'
                }).split(', ')[1]}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/marketing"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition duration-200"
              >
                📧 Marketing Hub
              </a>
              <button
                onClick={exportLeads}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition duration-200"
              >
                Export CSV
              </button>
              <button
                onClick={loadLeads}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
              >
                Refresh
              </button>
              <a
                href="/"
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back to Site
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalLeads}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Today</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.todayLeads}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">This Week</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.thisWeekLeads}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">This Month</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.thisMonthLeads}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">All Leads</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Business owners who submitted their information for FICA reduction program.
            </p>
          </div>
          
          {leads.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No leads yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Leads will appear here when business owners submit the form on your landing page.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Potential Savings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead, index) => {
                    const employeeCount = lead.number_of_employees;
                    let minEmployees = 0;
                    let maxEmployees = 0;
                    
                    if (employeeCount === "2-5") { minEmployees = 2; maxEmployees = 5; }
                    else if (employeeCount === "6-10") { minEmployees = 6; maxEmployees = 10; }
                    else if (employeeCount === "11-25") { minEmployees = 11; maxEmployees = 25; }
                    else if (employeeCount === "26-50") { minEmployees = 26; maxEmployees = 50; }
                    else if (employeeCount === "51-100") { minEmployees = 51; maxEmployees = 100; }
                    else if (employeeCount === "100+") { minEmployees = 100; maxEmployees = 200; }
                    
                    const minSavings = minEmployees * 1100;
                    const maxSavings = maxEmployees * 1100;

                    return (
                      <tr key={lead.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(lead.created_at)}
                          <div className="text-xs text-gray-500">
                            {formatTime(lead.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.first_name} {lead.last_name}
                          </div>
                          <div className="text-sm text-blue-600">
                            <a href={`mailto:${lead.email}`}>{lead.email}</a>
                          </div>
                          <div className="text-sm text-gray-500">
                            <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{lead.business_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getEmployeeRange(lead.number_of_employees)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {lead.industry || 'Not specified'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="font-medium text-green-600">
                            ${minSavings.toLocaleString()} - ${maxSavings.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">annual potential</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Statistics */}
        {leads.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Top Industries</h4>
              {(() => {
                const industries = leads.reduce((acc, lead) => {
                  const industry = lead.industry || 'Not specified';
                  acc[industry] = (acc[industry] || 0) + 1;
                  return acc;
                }, {});
                
                return Object.entries(industries)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([industry, count]) => (
                    <div key={industry} className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">{industry}</span>
                      <span className="text-sm font-medium text-gray-900">{count} leads</span>
                    </div>
                  ));
              })()}
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Company Sizes</h4>
              {(() => {
                const sizes = leads.reduce((acc, lead) => {
                  const size = lead.number_of_employees;
                  acc[size] = (acc[size] || 0) + 1;
                  return acc;
                }, {});
                
                return Object.entries(sizes)
                  .sort(([,a], [,b]) => b - a)
                  .map(([size, count]) => (
                    <div key={size} className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">{getEmployeeRange(size)}</span>
                      <span className="text-sm font-medium text-gray-900">{count} leads</span>
                    </div>
                  ));
              })()}
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h4>
              <div className="space-y-3">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="text-sm">
                    <div className="font-medium text-gray-900">{lead.first_name} {lead.last_name}</div>
                    <div className="text-gray-500">{formatDateTime(lead.created_at)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;