from fastapi import APIRouter, Depends
from app.middleware.auth import authorize

router = APIRouter(tags=["Dashboards"])


@router.get("/api/admin/dashboard")
async def admin_dashboard(user: dict = Depends(authorize("admin"))):
    """Admin dashboard endpoint."""
    return {"success": True, "message": "Welcome to the Admin Dashboard"}


@router.get("/api/student/dashboard")
async def student_dashboard(user: dict = Depends(authorize("student", "admin"))):
    """Student dashboard endpoint."""
    return {"success": True, "message": "Welcome to the Student Dashboard"}


@router.get("/api/staff/dashboard")
async def staff_dashboard(user: dict = Depends(authorize("staff", "admin"))):
    """Staff dashboard endpoint."""
    return {"success": True, "message": "Welcome to the Staff Dashboard"}
