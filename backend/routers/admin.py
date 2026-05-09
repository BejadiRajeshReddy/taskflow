from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from utils.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

def get_current_admin(current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/all-data")
def get_all_data(db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    users = db.query(models.User).all()
    projects = db.query(models.Project).all()
    tasks = db.query(models.Task).all()
    
    return {
        "users": [{"id": u.id, "username": u.username, "email": u.email, "is_admin": u.is_admin} for u in users],
        "projects": [{"id": p.id, "name": p.name, "owner_id": p.owner_id} for p in projects],
        "tasks": [{"id": t.id, "title": t.title, "status": t.status, "project_id": t.project_id} for t in tasks],
    }
