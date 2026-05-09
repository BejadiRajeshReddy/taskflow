from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import get_db
from utils.auth import get_current_user
from routers.projects import get_project_if_has_access

router = APIRouter(prefix="/projects", tags=["tasks"])

@router.get("/{project_id}/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = get_project_if_has_access(project_id, current_user, db)
    return project.tasks

@router.post("/{project_id}/tasks", response_model=schemas.TaskResponse)
def create_task(project_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = get_project_if_has_access(project_id, current_user, db)
    
    if task.assignee_id:
        # Check if assignee is part of the project
        if task.assignee_id != project.owner_id:
            member = db.query(models.ProjectMember).filter(
                models.ProjectMember.project_id == project_id,
                models.ProjectMember.user_id == task.assignee_id
            ).first()
            if not member:
                raise HTTPException(status_code=400, detail="Assignee is not a member of this project")

    db_task = models.Task(**task.dict(), project_id=project_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/{project_id}/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(project_id: int, task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = get_project_if_has_access(project_id, current_user, db)
    
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    update_data = task_update.dict(exclude_unset=True)
    
    if "assignee_id" in update_data and update_data["assignee_id"]:
        # Check if assignee is part of the project
        assignee_id = update_data["assignee_id"]
        if assignee_id != project.owner_id:
            member = db.query(models.ProjectMember).filter(
                models.ProjectMember.project_id == project_id,
                models.ProjectMember.user_id == assignee_id
            ).first()
            if not member:
                raise HTTPException(status_code=400, detail="Assignee is not a member of this project")
                
    for key, value in update_data.items():
        setattr(task, key, value)
        
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{project_id}/tasks/{task_id}")
def delete_task(project_id: int, task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = get_project_if_has_access(project_id, current_user, db)
    
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
