import React, { useState } from "react";

const MarketingHub = () => {
  const [activeTab, setActiveTab] = useState('phone');

  const phoneScripts = {
    main: `"Hi [Name], this is [Your Name]. I'm calling business owners in [area] about a new FICA reduction program. 

Do you currently have employees? 

Great! There's a program that can save businesses like yours up to $1,100 per employee in FICA taxes while giving your employees $100,000 life insurance and premium health benefits - all at zero cost to you.

Would you be interested in a 2-minute assessment to see what you could save?"`,

    elevator: `"I help business owners reduce their FICA taxes by up to $1,100 per employee while giving their workers incredible benefits like $100,000 life insurance and $0 copay healthcare - all at zero cost to the business or employees. It's a legitimate tax strategy that most business owners don't know exists."`,

    followUp: `"Perfect! Here's how it works quickly:

Your employees get:
• $100,000 life insurance - guaranteed, no health questions
• Free prescriptions for 1000+ common medications
• Free lab work - blood tests, cultures, etc.
• Free urgent care visits - up to 3 per year
• 24/7 virtual healthcare access

And you save up to $1,100 per employee annually on FICA taxes.

The best part? Zero cost to you or them. 

Can I send you a quick 2-minute assessment link to see your potential savings? What's your email?"`,

    objections: {
      tooGood: `"I understand that reaction - I thought the same thing initially. This is a legitimate IRS-compliant tax strategy using Section 125 of the tax code. It's not a loophole, it's a proper business deduction. The 2-minute assessment will show you exactly how it works for your specific situation."`,
      
      think: `"Absolutely, that makes sense. The assessment is just to see if you qualify and what your potential savings would be - no commitment. Would it help to see those numbers first so you know if it's worth thinking about?"`,
      
      haveBenefits: `"That's great that you're taking care of your employees! This actually works alongside existing benefits and can often provide additional coverage while reducing your tax burden. The assessment will show if there's additional value for your situation."`
    },

    closing: `"Based on what you've told me about your [# of employees] employees, you could potentially save around $[calculate: # × $1,100] annually. 

I'll send you the quick assessment link - it takes 2 minutes and shows your exact savings potential. What's the best email for you?

You'll get your personalized results immediately, and if it makes sense, we can set up a brief call to go over the details. Sound fair?"`
  };

  const emailTemplates = {
    template1: {
      subject: "Save $1,100+ per employee with this FICA reduction program",
      body: `Hi [Name],

I wanted to share something that could save your business significant money while giving your employees incredible benefits.

There's a FICA reduction program that can save businesses up to $1,100 per employee annually, while providing:
• $100,000 whole life insurance (zero cost to employer/employee)
• $0 copay prescriptions (1000+ generic drugs)
• $0 copay lab work (1200+ tests)
• $0 copay urgent care visits
• 24/7 virtual primary care
• TeleCounseling services

The best part? ALL at zero net cost to you or your employees.

Get your free quote in 2 minutes: https://fica-reduction.preview.emergentagent.com

Worth checking out!

[Your Name]`
    },

    template2: {
      subject: "Quick question about your FICA taxes",
      body: `Hi [Name],

Quick question: Are you happy with how much you're paying in FICA taxes?

If not, I found a program that's helping business owners save up to $1,100 per employee while providing premium benefits including:

• ✅ $100K life insurance per employee (guaranteed issue)
• ✅ Free prescriptions
• ✅ Free lab work
• ✅ Free urgent care visits
• ✅ 24/7 virtual healthcare

Cost to implement? $0
Administrative work required? None

Check if you qualify (2 minutes): https://fica-reduction.preview.emergentagent.com

Even if it's not right for you, thought you should know about it.

Best,
[Your Name]`
    },

    followUpEmail: {
      subject: "Your FICA Savings Assessment - [Company Name]",
      body: `Hi [Name],

Thanks for taking my call today about the FICA reduction program.

As promised, here's your 2-minute assessment to see your potential savings:
https://fica-reduction.preview.emergentagent.com

Based on our conversation about your [# of employees] employees, you could potentially save up to $[amount] annually while providing them incredible benefits.

The assessment will show your exact numbers and how the program works.

Feel free to call me with any questions: [Your Phone]

Best regards,
[Your Name]`
    }
  };

  const socialPosts = {
    linkedin: `🔥 BUSINESS OWNERS: Are you paying too much in FICA taxes?

There's a program that can save you up to $1,100 PER EMPLOYEE while giving them:
✅ $100,000 whole life insurance (guaranteed issue)
✅ $0 copay prescriptions
✅ $0 copay lab work
✅ $0 copay urgent care
✅ 24/7 virtual care

ALL at zero net cost to you or your employees.

Get your free quote ⬇️ https://fica-reduction.preview.emergentagent.com

#BusinessOwners #FICA #TaxReduction #EmployeeBenefits`,

    facebook: `🚨 ATTENTION BUSINESS OWNERS! 🚨

What if you could:
💰 Save $1,100+ per employee in taxes
🏥 Give them $100K life insurance FREE
💊 Provide $0 copay prescriptions
🩺 Offer $0 copay urgent care

This FICA reduction program is 100% legitimate and costs you nothing.

Check if you qualify: https://fica-reduction.preview.emergentagent.com`,

    twitter: `❓ Have employees?
💰 Want to save on FICA taxes?
🏥 Want to give them premium benefits?
✅ All at zero cost?

This program does exactly that.
https://fica-reduction.preview.emergentagent.com

#FICA #BusinessTips #EmployeeBenefits #SmallBusiness`
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Marketing Hub</h1>
            <div className="flex items-center space-x-4">
              <a
                href="/admin"
                className="text-blue-600 hover:text-blue-700"
              >
                View Leads
              </a>
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
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('phone')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'phone'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📞 Phone Scripts
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'email'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📧 Email Templates
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'social'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📱 Social Media
            </button>
            <button
              onClick={() => setActiveTab('quick')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'quick'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ⚡ Quick Actions
            </button>
          </nav>
        </div>

        {/* Phone Scripts Tab */}
        {activeTab === 'phone' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Phone Scripts</h2>
            
            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Main Cold Calling Script</h3>
                  <button
                    onClick={() => copyToClipboard(phoneScripts.main)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Copy Script
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">{phoneScripts.main}</pre>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">30-Second Elevator Pitch</h3>
                  <button
                    onClick={() => copyToClipboard(phoneScripts.elevator)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Copy Script
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">{phoneScripts.elevator}</pre>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Follow-Up Script</h3>
                  <button
                    onClick={() => copyToClipboard(phoneScripts.followUp)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Copy Script
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">{phoneScripts.followUp}</pre>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Objection Handling</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">"Sounds too good to be true":</h4>
                    <div className="flex justify-between items-start">
                      <pre className="bg-gray-50 p-3 rounded text-sm flex-1 mr-4 whitespace-pre-wrap">{phoneScripts.objections.tooGood}</pre>
                      <button
                        onClick={() => copyToClipboard(phoneScripts.objections.tooGood)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">"I need to think about it":</h4>
                    <div className="flex justify-between items-start">
                      <pre className="bg-gray-50 p-3 rounded text-sm flex-1 mr-4 whitespace-pre-wrap">{phoneScripts.objections.think}</pre>
                      <button
                        onClick={() => copyToClipboard(phoneScripts.objections.think)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">"I already have benefits":</h4>
                    <div className="flex justify-between items-start">
                      <pre className="bg-gray-50 p-3 rounded text-sm flex-1 mr-4 whitespace-pre-wrap">{phoneScripts.objections.haveBenefits}</pre>
                      <button
                        onClick={() => copyToClipboard(phoneScripts.objections.haveBenefits)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Closing Script</h3>
                  <button
                    onClick={() => copyToClipboard(phoneScripts.closing)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Copy Script
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">{phoneScripts.closing}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Email Templates Tab */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Email Templates</h2>
            
            <div className="grid gap-6">
              {Object.entries(emailTemplates).map(([key, template]) => (
                <div key={key} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {key === 'template1' ? 'Direct Business Owner Outreach' :
                       key === 'template2' ? 'Professional Network Email' :
                       'Follow-Up After Phone Call'}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(`Subject: ${template.subject}\n\n${template.body}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Copy Email
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                      <div className="bg-gray-50 p-3 rounded font-medium">{template.subject}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Body:</label>
                      <pre className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">{template.body}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Social Media Posts</h2>
            
            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">LinkedIn Post</h3>
                  <button
                    onClick={() => copyToClipboard(socialPosts.linkedin)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Copy Post
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">{socialPosts.linkedin}</pre>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Facebook Post</h3>
                  <button
                    onClick={() => copyToClipboard(socialPosts.facebook)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Copy Post
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">{socialPosts.facebook}</pre>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Twitter/X Post</h3>
                  <button
                    onClick={() => copyToClipboard(socialPosts.twitter)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Copy Post
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">{socialPosts.twitter}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Tab */}
        {activeTab === 'quick' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Email Signature</h3>
                <div className="bg-gray-50 p-4 rounded text-sm">
                  [Your Name] | [Phone] | [Email]<br/>
                  💰 Business owners: Save $1,100+ per employee with FICA reduction<br/>
                  Get your free quote → https://fica-reduction.preview.emergentagent.com
                </div>
                <button
                  onClick={() => copyToClipboard(`[Your Name] | [Phone] | [Email]
💰 Business owners: Save $1,100+ per employee with FICA reduction
Get your free quote → https://fica-reduction.preview.emergentagent.com`)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Copy Signature
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Text Message Template</h3>
                <div className="bg-gray-50 p-4 rounded text-sm">
                  Hey [Name]! Found something that could save your business $1,100+ per employee in FICA taxes while giving them $100K life insurance + health benefits for FREE. 
                  <br/><br/>
                  2-min check: https://fica-reduction.preview.emergentagent.com
                  <br/><br/>
                  Worth looking at!
                </div>
                <button
                  onClick={() => copyToClipboard(`Hey [Name]! Found something that could save your business $1,100+ per employee in FICA taxes while giving them $100K life insurance + health benefits for FREE. 

2-min check: https://fica-reduction.preview.emergentagent.com

Worth looking at!`)}
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Copy Text
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Key URLs</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Landing Page:</label>
                    <div className="flex">
                      <input
                        type="text"
                        value="https://fica-reduction.preview.emergentagent.com"
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l text-sm bg-gray-50"
                      />
                      <button
                        onClick={() => copyToClipboard("https://fica-reduction.preview.emergentagent.com")}
                        className="bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admin Dashboard:</label>
                    <div className="flex">
                      <input
                        type="text"
                        value="https://fica-reduction.preview.emergentagent.com/admin"
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l text-sm bg-gray-50"
                      />
                      <button
                        onClick={() => copyToClipboard("https://fica-reduction.preview.emergentagent.com/admin")}
                        className="bg-blue-600 text-white px-3 py-2 rounded-r hover:bg-blue-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Daily Action Checklist</h3>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Post on LinkedIn
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Send 5 emails to prospects
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Make 10 cold calls
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Check admin dashboard for new leads
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Follow up with existing leads
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Post in business Facebook groups
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingHub;