from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import get_db
from utils.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])

def get_project_if_has_access(project_id: int, current_user: models.User, db: Session):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.owner_id == current_user.id:
        return project
    
    member = db.query(models.ProjectMember).filter(
        models.ProjectMember.project_id == project_id,
        models.ProjectMember.user_id == current_user.id
    ).first()
    
    if not member:
        raise HTTPException(status_code=403, detail="Not enough permissions to access this project")
    
    return project

@router.get("/", response_model=List[schemas.ProjectResponse])
def get_projects(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    owned_projects = current_user.owned_projects
    member_projects = [m.project for m in current_user.project_memberships]
    
    # deduplicate if needed, though they shouldn't overlap if created cleanly
    all_projects = list({p.id: p for p in (owned_projects + member_projects)}.values())
    return all_projects

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    owned_projects = current_user.owned_projects
    member_projects = [m.project for m in current_user.project_memberships]
    all_projects = list({p.id: p for p in (owned_projects + member_projects)}.values())
    
    project_ids = [p.id for p in all_projects]
    
    if not project_ids:
        return {"projects": [], "stats": {"todo": 0, "in_progress": 0, "done": 0, "total": 0}, "recent_tasks": []}
        
    tasks = db.query(models.Task).filter(models.Task.project_id.in_(project_ids)).all()
    
    stats = {"todo": 0, "in_progress": 0, "done": 0, "total": len(tasks)}
    for t in tasks:
        if t.status == models.TaskStatusEnum.todo: stats["todo"] += 1
        elif t.status == models.TaskStatusEnum.in_progress: stats["in_progress"] += 1
        elif t.status == models.TaskStatusEnum.done: stats["done"] += 1
        
    recent_tasks = db.query(models.Task).filter(
        models.Task.project_id.in_(project_ids)
    ).order_by(models.Task.created_at.desc()).limit(5).all()

    return {
        "projects": [{"id": p.id, "name": p.name, "description": p.description, "task_count": len(p.tasks)} for p in all_projects],
        "stats": stats,
        "recent_tasks": [{"id": t.id, "title": t.title, "status": t.status, "project_name": t.project.name} for t in recent_tasks]
    }

@router.get("/dashboard/tasks")
def get_all_user_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    owned_projects = current_user.owned_projects
    member_projects = [m.project for m in current_user.project_memberships]
    all_projects = list({p.id: p for p in (owned_projects + member_projects)}.values())
    project_ids = [p.id for p in all_projects]
    
    if not project_ids:
        return []
        
    tasks = db.query(models.Task).filter(models.Task.project_id.in_(project_ids)).all()
    return [
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "priority": t.priority,
            "due_date": t.due_date,
            "project_id": t.project_id,
            "project_name": t.project.name,
            "assignee_id": t.assignee_id
        }
        for t in tasks
    ]

@router.get("/search")
def search_workspace(q: str = "", db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not q or len(q.strip()) < 2:
        return {"projects": [], "tasks": []}
    
    query = q.strip().lower()
    
    owned_projects = current_user.owned_projects
    member_projects = [m.project for m in current_user.project_memberships]
    all_projects = list({p.id: p for p in (owned_projects + member_projects)}.values())
    project_ids = [p.id for p in all_projects]
    
    if not project_ids:
        return {"projects": [], "tasks": []}
        
    matched_projects = [p for p in all_projects if query in p.name.lower() or (p.description and query in p.description.lower())]
    
    tasks = db.query(models.Task).filter(models.Task.project_id.in_(project_ids)).all()
    matched_tasks = [t for t in tasks if query in t.title.lower() or (t.description and query in t.description.lower())]
    
    return {
        "projects": [{"id": p.id, "name": p.name} for p in matched_projects],
        "tasks": [{"id": t.id, "title": t.title, "project_id": t.project_id, "project_name": t.project.name, "status": t.status} for t in matched_tasks]
    }

@router.post("/", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_project = models.Project(**project.dict(), owner_id=current_user.id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/{project_id}", response_model=schemas.ProjectDetailResponse)
def get_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = get_project_if_has_access(project_id, current_user, db)
    return project

@router.put("/{project_id}", response_model=schemas.ProjectResponse)
def update_project(project_id: int, project_update: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = get_project_if_has_access(project_id, current_user, db)
    
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only owner can update project details")

    for key, value in project_update.dict().items():
        setattr(project, key, value)
        
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = get_project_if_has_access(project_id, current_user, db)
    
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only owner can delete project")
        
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

@router.post("/{project_id}/invite", response_model=schemas.ProjectMemberResponse)
def invite_member(project_id: int, invite: schemas.ProjectMemberInvite, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = get_project_if_has_access(project_id, current_user, db)
    
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only owner can invite members")
        
    user_to_invite = db.query(models.User).filter(models.User.email == invite.email).first()
    if not user_to_invite:
        raise HTTPException(status_code=404, detail="User with this email not found")
        
    if user_to_invite.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot invite yourself")
        
    existing_member = db.query(models.ProjectMember).filter(
        models.ProjectMember.project_id == project_id,
        models.ProjectMember.user_id == user_to_invite.id
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member")
        
    new_member = models.ProjectMember(project_id=project_id, user_id=user_to_invite.id, role=models.RoleEnum.member)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member
