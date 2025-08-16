import requests
import sys
import json
from datetime import datetime, date
from typing import Dict, Any

class FICAReductionAPITester:
    def __init__(self, base_url="https://fica-reduction.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.business_owner_id = None
        self.employee_ids = []
        self.benefit_plan_ids = []
        self.application_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.json()}")
                except:
                    print(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_create_business_owner(self):
        """Test creating a business owner"""
        business_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@testbusiness.com",
            "phone": "555-123-4567",
            "business_name": "Test Business LLC",
            "business_type": "llc",
            "industry": "technology",
            "tax_id": "12-3456789",
            "years_in_business": 5,
            "address": "123 Business St",
            "city": "Business City",
            "state": "CA",
            "zip_code": "90210"
        }
        
        success, response = self.run_test(
            "Create Business Owner",
            "POST",
            "business-owners",
            200,
            data=business_data
        )
        
        if success and 'id' in response:
            self.business_owner_id = response['id']
            print(f"   Created business owner with ID: {self.business_owner_id}")
        
        return success

    def test_get_business_owner(self):
        """Test getting business owner by ID"""
        if not self.business_owner_id:
            print("❌ No business owner ID available")
            return False
            
        return self.run_test(
            "Get Business Owner",
            "GET",
            f"business-owners/{self.business_owner_id}",
            200
        )[0]

    def test_get_all_business_owners(self):
        """Test getting all business owners"""
        return self.run_test(
            "Get All Business Owners",
            "GET",
            "business-owners",
            200
        )[0]

    def test_create_employees(self):
        """Test creating employees"""
        if not self.business_owner_id:
            print("❌ No business owner ID available")
            return False

        employees_data = [
            {
                "business_owner_id": self.business_owner_id,
                "first_name": "Alice",
                "last_name": "Smith",
                "email": "alice.smith@testbusiness.com",
                "phone": "555-234-5678",
                "job_title": "Software Engineer",
                "annual_salary": 75000.0,
                "hire_date": "2023-01-15",
                "birth_date": "1990-05-20",
                "has_current_health_insurance": False,
                "has_current_life_insurance": False
            },
            {
                "business_owner_id": self.business_owner_id,
                "first_name": "Bob",
                "last_name": "Johnson",
                "email": "bob.johnson@testbusiness.com",
                "phone": "555-345-6789",
                "job_title": "Marketing Manager",
                "annual_salary": 65000.0,
                "hire_date": "2023-03-01",
                "birth_date": "1985-08-15",
                "has_current_health_insurance": True,
                "has_current_life_insurance": False,
                "current_health_premium": 300.0
            }
        ]

        success_count = 0
        for i, employee_data in enumerate(employees_data):
            success, response = self.run_test(
                f"Create Employee {i+1}",
                "POST",
                "employees",
                200,
                data=employee_data
            )
            
            if success and 'id' in response:
                self.employee_ids.append(response['id'])
                success_count += 1

        return success_count == len(employees_data)

    def test_get_employees_by_business(self):
        """Test getting employees by business owner"""
        if not self.business_owner_id:
            print("❌ No business owner ID available")
            return False
            
        return self.run_test(
            "Get Employees by Business",
            "GET",
            f"employees/business/{self.business_owner_id}",
            200
        )[0]

    def test_get_employee(self):
        """Test getting individual employee"""
        if not self.employee_ids:
            print("❌ No employee IDs available")
            return False
            
        return self.run_test(
            "Get Employee",
            "GET",
            f"employees/{self.employee_ids[0]}",
            200
        )[0]

    def test_get_benefit_plans(self):
        """Test getting all benefit plans"""
        success, response = self.run_test(
            "Get All Benefit Plans",
            "GET",
            "benefit-plans",
            200
        )
        
        if success and isinstance(response, list):
            self.benefit_plan_ids = [plan['id'] for plan in response]
            print(f"   Found {len(self.benefit_plan_ids)} benefit plans")
        
        return success

    def test_get_benefit_plans_by_type(self):
        """Test getting benefit plans by type"""
        plan_types = ["health_basic", "health_premium", "life_basic", "life_premium"]
        success_count = 0
        
        for plan_type in plan_types:
            success, response = self.run_test(
                f"Get {plan_type} Plans",
                "GET",
                f"benefit-plans/{plan_type}",
                200
            )
            if success:
                success_count += 1
        
        return success_count == len(plan_types)

    def test_fica_calculation(self):
        """Test FICA calculation"""
        if not self.business_owner_id or not self.benefit_plan_ids:
            print("❌ Missing business owner ID or benefit plan IDs")
            return False

        # Get health and life plan IDs
        health_plan_id = None
        life_plan_id = None
        
        # Get benefit plans to find appropriate IDs
        success, plans = self.run_test(
            "Get Plans for FICA Calc",
            "GET",
            "benefit-plans",
            200
        )
        
        if success:
            for plan in plans:
                if plan['plan_type'].startswith('health_') and not health_plan_id:
                    health_plan_id = plan['id']
                elif plan['plan_type'].startswith('life_') and not life_plan_id:
                    life_plan_id = plan['id']

        params = {}
        if health_plan_id:
            params['health_plan_id'] = health_plan_id
        if life_plan_id:
            params['life_plan_id'] = life_plan_id

        return self.run_test(
            "FICA Calculation",
            "POST",
            f"fica-calculation/{self.business_owner_id}",
            200,
            params=params
        )[0]

    def test_get_fica_history(self):
        """Test getting FICA calculation history"""
        if not self.business_owner_id:
            print("❌ No business owner ID available")
            return False
            
        return self.run_test(
            "Get FICA History",
            "GET",
            f"fica-calculation/history/{self.business_owner_id}",
            200
        )[0]

    def test_create_application(self):
        """Test creating an application"""
        if not self.business_owner_id:
            print("❌ No business owner ID available")
            return False

        app_data = {
            "business_owner_id": self.business_owner_id,
            "notes": "Test application for FICA reduction program"
        }
        
        success, response = self.run_test(
            "Create Application",
            "POST",
            "applications",
            200,
            data=app_data
        )
        
        if success and 'id' in response:
            self.application_id = response['id']
            print(f"   Created application with ID: {self.application_id}")
        
        return success

    def test_get_applications_by_business(self):
        """Test getting applications by business"""
        if not self.business_owner_id:
            print("❌ No business owner ID available")
            return False
            
        return self.run_test(
            "Get Applications by Business",
            "GET",
            f"applications/business/{self.business_owner_id}",
            200
        )[0]

    def test_get_application(self):
        """Test getting individual application"""
        if not self.application_id:
            print("❌ No application ID available")
            return False
            
        return self.run_test(
            "Get Application",
            "GET",
            f"applications/{self.application_id}",
            200
        )[0]

    def test_update_application(self):
        """Test updating an application"""
        if not self.application_id:
            print("❌ No application ID available")
            return False

        update_data = {
            "status": "submitted",
            "notes": "Updated test application"
        }
        
        return self.run_test(
            "Update Application",
            "PUT",
            f"applications/{self.application_id}",
            200,
            data=update_data
        )[0]

    def test_eligibility_check(self):
        """Test eligibility check"""
        if not self.business_owner_id:
            print("❌ No business owner ID available")
            return False
            
        return self.run_test(
            "Eligibility Check",
            "GET",
            f"eligibility-check/{self.business_owner_id}",
            200
        )[0]

    def test_dashboard_summary(self):
        """Test dashboard summary"""
        if not self.business_owner_id:
            print("❌ No business owner ID available")
            return False
            
        return self.run_test(
            "Dashboard Summary",
            "GET",
            f"dashboard/{self.business_owner_id}",
            200
        )[0]

    def test_delete_employee(self):
        """Test deleting an employee"""
        if not self.employee_ids:
            print("❌ No employee IDs available")
            return False
            
        # Delete the last employee
        employee_id = self.employee_ids[-1]
        success = self.run_test(
            "Delete Employee",
            "DELETE",
            f"employees/{employee_id}",
            200
        )[0]
        
        if success:
            self.employee_ids.remove(employee_id)
        
        return success

def main():
    print("🚀 Starting FICA Reduction Program API Tests")
    print("=" * 60)
    
    tester = FICAReductionAPITester()
    
    # Test sequence
    test_sequence = [
        ("Health Check", tester.test_health_check),
        ("Create Business Owner", tester.test_create_business_owner),
        ("Get Business Owner", tester.test_get_business_owner),
        ("Get All Business Owners", tester.test_get_all_business_owners),
        ("Create Employees", tester.test_create_employees),
        ("Get Employees by Business", tester.test_get_employees_by_business),
        ("Get Individual Employee", tester.test_get_employee),
        ("Get Benefit Plans", tester.test_get_benefit_plans),
        ("Get Benefit Plans by Type", tester.test_get_benefit_plans_by_type),
        ("FICA Calculation", tester.test_fica_calculation),
        ("Get FICA History", tester.test_get_fica_history),
        ("Create Application", tester.test_create_application),
        ("Get Applications by Business", tester.test_get_applications_by_business),
        ("Get Individual Application", tester.test_get_application),
        ("Update Application", tester.test_update_application),
        ("Eligibility Check", tester.test_eligibility_check),
        ("Dashboard Summary", tester.test_dashboard_summary),
        ("Delete Employee", tester.test_delete_employee),
    ]
    
    # Run all tests
    for test_name, test_func in test_sequence:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())