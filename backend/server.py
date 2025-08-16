from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, date
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="FICA Reduction Program API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class BusinessType(str, Enum):
    CORPORATION = "corporation"
    LLC = "llc"
    PARTNERSHIP = "partnership"
    SOLE_PROPRIETORSHIP = "sole_proprietorship"
    S_CORP = "s_corp"

class IndustryType(str, Enum):
    TECHNOLOGY = "technology"
    HEALTHCARE = "healthcare"
    MANUFACTURING = "manufacturing"
    RETAIL = "retail"
    CONSTRUCTION = "construction"
    PROFESSIONAL_SERVICES = "professional_services"
    HOSPITALITY = "hospitality"
    OTHER = "other"

class ApplicationStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"

class BenefitPlanType(str, Enum):
    HEALTH_BASIC = "health_basic"
    HEALTH_PREMIUM = "health_premium"
    LIFE_BASIC = "life_basic"
    LIFE_PREMIUM = "life_premium"

# Data Models
class BusinessOwner(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    business_name: str
    business_type: BusinessType
    industry: IndustryType
    tax_id: str
    years_in_business: int
    address: str
    city: str
    state: str
    zip_code: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BusinessOwnerCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    business_name: str
    business_type: BusinessType
    industry: IndustryType
    tax_id: str
    years_in_business: int
    address: str
    city: str
    state: str
    zip_code: str

class Employee(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_owner_id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    job_title: str
    annual_salary: float
    hire_date: datetime
    birth_date: datetime
    has_current_health_insurance: bool = False
    has_current_life_insurance: bool = False
    current_health_premium: Optional[float] = None
    current_life_premium: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EmployeeCreate(BaseModel):
    business_owner_id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    job_title: str
    annual_salary: float
    hire_date: datetime
    birth_date: datetime
    has_current_health_insurance: bool = False
    has_current_life_insurance: bool = False
    current_health_premium: Optional[float] = None
    current_life_premium: Optional[float] = None

class BenefitPlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    plan_type: BenefitPlanType
    description: str
    monthly_premium_per_employee: float
    coverage_amount: Optional[float] = None
    deductible: Optional[float] = None
    features: List[str] = []
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BenefitPlanCreate(BaseModel):
    name: str
    plan_type: BenefitPlanType
    description: str
    monthly_premium_per_employee: float
    coverage_amount: Optional[float] = None
    deductible: Optional[float] = None
    features: List[str] = []

class FICACalculation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_owner_id: str
    total_employee_salaries: float
    current_fica_tax: float
    projected_fica_savings: float
    annual_savings: float
    health_benefit_cost: float
    life_insurance_cost: float
    net_savings: float
    calculation_date: datetime = Field(default_factory=datetime.utcnow)

class Application(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_owner_id: str
    status: ApplicationStatus = ApplicationStatus.DRAFT
    selected_health_plan_id: Optional[str] = None
    selected_life_plan_id: Optional[str] = None
    total_employees: int = 0
    estimated_annual_savings: float = 0.0
    notes: Optional[str] = None
    submitted_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ApplicationCreate(BaseModel):
    business_owner_id: str
    selected_health_plan_id: Optional[str] = None
    selected_life_plan_id: Optional[str] = None
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None
    selected_health_plan_id: Optional[str] = None
    selected_life_plan_id: Optional[str] = None
    notes: Optional[str] = None

# Business Owner Endpoints
@api_router.post("/business-owners", response_model=BusinessOwner)
async def create_business_owner(owner_data: BusinessOwnerCreate):
    """Create a new business owner"""
    owner_dict = owner_data.dict()
    owner_obj = BusinessOwner(**owner_dict)
    await db.business_owners.insert_one(owner_obj.dict())
    return owner_obj

@api_router.get("/business-owners/{owner_id}", response_model=BusinessOwner)
async def get_business_owner(owner_id: str):
    """Get business owner by ID"""
    owner = await db.business_owners.find_one({"id": owner_id})
    if not owner:
        raise HTTPException(status_code=404, detail="Business owner not found")
    return BusinessOwner(**owner)

@api_router.get("/business-owners", response_model=List[BusinessOwner])
async def get_business_owners():
    """Get all business owners"""
    owners = await db.business_owners.find().to_list(1000)
    return [BusinessOwner(**owner) for owner in owners]

# Employee Endpoints
@api_router.post("/employees", response_model=Employee)
async def create_employee(employee_data: EmployeeCreate):
    """Create a new employee"""
    # Verify business owner exists
    owner = await db.business_owners.find_one({"id": employee_data.business_owner_id})
    if not owner:
        raise HTTPException(status_code=404, detail="Business owner not found")
    
    employee_dict = employee_data.dict()
    employee_obj = Employee(**employee_dict)
    await db.employees.insert_one(employee_obj.dict())
    return employee_obj

@api_router.get("/employees/business/{owner_id}", response_model=List[Employee])
async def get_employees_by_business(owner_id: str):
    """Get all employees for a business owner"""
    employees = await db.employees.find({"business_owner_id": owner_id}).to_list(1000)
    return [Employee(**employee) for employee in employees]

@api_router.get("/employees/{employee_id}", response_model=Employee)
async def get_employee(employee_id: str):
    """Get employee by ID"""
    employee = await db.employees.find_one({"id": employee_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return Employee(**employee)

@api_router.delete("/employees/{employee_id}")
async def delete_employee(employee_id: str):
    """Delete an employee"""
    result = await db.employees.delete_one({"id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}

# Benefit Plan Endpoints
@api_router.post("/benefit-plans", response_model=BenefitPlan)
async def create_benefit_plan(plan_data: BenefitPlanCreate):
    """Create a new benefit plan"""
    plan_dict = plan_data.dict()
    plan_obj = BenefitPlan(**plan_dict)
    await db.benefit_plans.insert_one(plan_obj.dict())
    return plan_obj

@api_router.get("/benefit-plans", response_model=List[BenefitPlan])
async def get_benefit_plans():
    """Get all active benefit plans"""
    plans = await db.benefit_plans.find({"is_active": True}).to_list(1000)
    return [BenefitPlan(**plan) for plan in plans]

@api_router.get("/benefit-plans/{plan_type}", response_model=List[BenefitPlan])
async def get_benefit_plans_by_type(plan_type: BenefitPlanType):
    """Get benefit plans by type"""
    plans = await db.benefit_plans.find({
        "plan_type": plan_type.value,
        "is_active": True
    }).to_list(1000)
    return [BenefitPlan(**plan) for plan in plans]

# FICA Calculation Endpoints
@api_router.post("/fica-calculation/{owner_id}")
async def calculate_fica_savings(owner_id: str, health_plan_id: Optional[str] = None, life_plan_id: Optional[str] = None):
    """Calculate FICA savings for a business owner"""
    # Get business owner
    owner = await db.business_owners.find_one({"id": owner_id})
    if not owner:
        raise HTTPException(status_code=404, detail="Business owner not found")
    
    # Get employees
    employees = await db.employees.find({"business_owner_id": owner_id}).to_list(1000)
    if not employees:
        raise HTTPException(status_code=400, detail="No employees found for this business")
    
    # Calculate total employee salaries
    total_salaries = sum(emp["annual_salary"] for emp in employees)
    
    # FICA tax rate (Social Security + Medicare)
    fica_rate = 0.0765  # 7.65% (6.2% Social Security + 1.45% Medicare)
    current_fica_tax = total_salaries * fica_rate
    
    # Get benefit plan costs
    health_cost = 0.0
    life_cost = 0.0
    
    if health_plan_id:
        health_plan = await db.benefit_plans.find_one({"id": health_plan_id})
        if health_plan:
            health_cost = health_plan["monthly_premium_per_employee"] * len(employees) * 12
    
    if life_plan_id:
        life_plan = await db.benefit_plans.find_one({"id": life_plan_id})
        if life_plan:
            life_cost = life_plan["monthly_premium_per_employee"] * len(employees) * 12
    
    # Calculate FICA savings (simplified calculation)
    # In reality, this would depend on specific IRS regulations
    total_benefit_cost = health_cost + life_cost
    
    # Estimate 30% FICA savings on benefit costs (this is a simplified calculation)
    projected_fica_savings = total_benefit_cost * 0.30
    annual_savings = projected_fica_savings
    net_savings = annual_savings - total_benefit_cost
    
    # Create calculation record
    calculation = FICACalculation(
        business_owner_id=owner_id,
        total_employee_salaries=total_salaries,
        current_fica_tax=current_fica_tax,
        projected_fica_savings=projected_fica_savings,
        annual_savings=annual_savings,
        health_benefit_cost=health_cost,
        life_insurance_cost=life_cost,
        net_savings=net_savings
    )
    
    await db.fica_calculations.insert_one(calculation.dict())
    return calculation

@api_router.get("/fica-calculation/history/{owner_id}", response_model=List[FICACalculation])
async def get_fica_calculation_history(owner_id: str):
    """Get FICA calculation history for a business owner"""
    calculations = await db.fica_calculations.find({
        "business_owner_id": owner_id
    }).sort("calculation_date", -1).to_list(100)
    return [FICACalculation(**calc) for calc in calculations]

# Application Endpoints
@api_router.post("/applications", response_model=Application)
async def create_application(app_data: ApplicationCreate):
    """Create a new application"""
    # Verify business owner exists
    owner = await db.business_owners.find_one({"id": app_data.business_owner_id})
    if not owner:
        raise HTTPException(status_code=404, detail="Business owner not found")
    
    # Count employees
    employee_count = await db.employees.count_documents({"business_owner_id": app_data.business_owner_id})
    
    app_dict = app_data.dict()
    app_obj = Application(
        **app_dict,
        total_employees=employee_count
    )
    await db.applications.insert_one(app_obj.dict())
    return app_obj

@api_router.get("/applications/business/{owner_id}", response_model=List[Application])
async def get_applications_by_business(owner_id: str):
    """Get all applications for a business owner"""
    applications = await db.applications.find({
        "business_owner_id": owner_id
    }).sort("created_at", -1).to_list(100)
    return [Application(**app) for app in applications]

@api_router.get("/applications/{app_id}", response_model=Application)
async def get_application(app_id: str):
    """Get application by ID"""
    application = await db.applications.find_one({"id": app_id})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return Application(**application)

@api_router.put("/applications/{app_id}", response_model=Application)
async def update_application(app_id: str, app_update: ApplicationUpdate):
    """Update an application"""
    # Get current application
    current_app = await db.applications.find_one({"id": app_id})
    if not current_app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Prepare update data
    update_data = {k: v for k, v in app_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    # If status is being set to submitted, set submitted_at
    if app_update.status == ApplicationStatus.SUBMITTED:
        update_data["submitted_at"] = datetime.utcnow()
    
    # Update application
    await db.applications.update_one(
        {"id": app_id},
        {"$set": update_data}
    )
    
    # Return updated application
    updated_app = await db.applications.find_one({"id": app_id})
    return Application(**updated_app)

# Eligibility Check Endpoint
@api_router.get("/eligibility-check/{owner_id}")
async def check_eligibility(owner_id: str):
    """Check business eligibility for FICA reduction program"""
    # Get business owner
    owner = await db.business_owners.find_one({"id": owner_id})
    if not owner:
        raise HTTPException(status_code=404, detail="Business owner not found")
    
    # Get employee count
    employee_count = await db.employees.count_documents({"business_owner_id": owner_id})
    
    # Eligibility criteria (simplified)
    eligible = True
    reasons = []
    
    # Must have at least 2 employees
    if employee_count < 2:
        eligible = False
        reasons.append("Business must have at least 2 employees")
    
    # Must be in business for at least 1 year
    if owner["years_in_business"] < 1:
        eligible = False
        reasons.append("Business must be operating for at least 1 year")
    
    # Some industries may not be eligible
    restricted_industries = [IndustryType.OTHER]
    if owner["industry"] in restricted_industries:
        eligible = False
        reasons.append("Industry type may require special review")
    
    return {
        "eligible": eligible,
        "employee_count": employee_count,
        "years_in_business": owner["years_in_business"],
        "industry": owner["industry"],
        "reasons": reasons if not eligible else ["All eligibility criteria met"]
    }

# Dashboard/Summary Endpoints
@api_router.get("/dashboard/{owner_id}")
async def get_dashboard_summary(owner_id: str):
    """Get dashboard summary for a business owner"""
    # Get business owner
    owner = await db.business_owners.find_one({"id": owner_id})
    if not owner:
        raise HTTPException(status_code=404, detail="Business owner not found")
    
    # Get employee count
    employee_count = await db.employees.count_documents({"business_owner_id": owner_id})
    
    # Get applications
    applications = await db.applications.find({
        "business_owner_id": owner_id
    }).sort("created_at", -1).to_list(10)
    
    # Get latest FICA calculation
    latest_calculation = await db.fica_calculations.find_one({
        "business_owner_id": owner_id
    }, sort=[("calculation_date", -1)])
    
    return {
        "business_name": owner["business_name"],
        "employee_count": employee_count,
        "applications_count": len(applications),
        "latest_calculation": FICACalculation(**latest_calculation) if latest_calculation else None,
        "recent_applications": [Application(**app) for app in applications[:3]]
    }

# Health check endpoint
@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Seed some default benefit plans
@app.on_event("startup")
async def seed_benefit_plans():
    """Seed default benefit plans if none exist"""
    existing_plans = await db.benefit_plans.count_documents({})
    
    if existing_plans == 0:
        default_plans = [
            BenefitPlan(
                name="Basic Health Plan",
                plan_type=BenefitPlanType.HEALTH_BASIC,
                description="Essential health coverage with major medical benefits",
                monthly_premium_per_employee=250.0,
                coverage_amount=50000.0,
                deductible=2500.0,
                features=["Doctor visits", "Emergency care", "Prescription coverage", "Preventive care"]
            ),
            BenefitPlan(
                name="Premium Health Plan",
                plan_type=BenefitPlanType.HEALTH_PREMIUM,
                description="Comprehensive health coverage with low deductibles",
                monthly_premium_per_employee=450.0,
                coverage_amount=100000.0,
                deductible=500.0,
                features=["All Basic features", "Specialist care", "Mental health", "Dental", "Vision"]
            ),
            BenefitPlan(
                name="Basic Life Insurance",
                plan_type=BenefitPlanType.LIFE_BASIC,
                description="Term life insurance coverage",
                monthly_premium_per_employee=25.0,
                coverage_amount=50000.0,
                features=["Term life coverage", "Accidental death benefit"]
            ),
            BenefitPlan(
                name="Premium Life Insurance",
                plan_type=BenefitPlanType.LIFE_PREMIUM,
                description="Permanent life insurance with cash value",
                monthly_premium_per_employee=75.0,
                coverage_amount=100000.0,
                features=["Permanent life coverage", "Cash value accumulation", "Loan option", "Disability waiver"]
            )
        ]
        
        for plan in default_plans:
            await db.benefit_plans.insert_one(plan.dict())
        
        logger.info("Seeded default benefit plans")