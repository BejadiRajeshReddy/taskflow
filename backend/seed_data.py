import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from utils.auth import get_password_hash
from datetime import datetime, timedelta

def seed():
    # Create tables
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    import uuid
    unique_id = str(uuid.uuid4())[:6]
    
    # Create Users
    users_data = [
        {"username": f"demo_{unique_id}", "email": f"demo_{unique_id}@example.com", "password": "password"},
        {"username": f"alice_{unique_id}", "email": f"alice_{unique_id}@example.com", "password": "password"},
        {"username": f"bob_{unique_id}", "email": f"bob_{unique_id}@example.com", "password": "password"}
    ]
    
    db_users = []
    for u in users_data:
        user = models.User(
            username=u["username"],
            email=u["email"],
            hashed_password=get_password_hash(u["password"])
        )
        db.add(user)
        db_users.append(user)
        
    db.commit()
    for u in db_users:
        db.refresh(u)

    # Create Projects
    projects_data = [
        {"name": "Marketing Campaign Q4", "description": "Plan and execute the marketing campaign for the new product launch.", "owner_id": db_users[0].id},
        {"name": "Website Redesign", "description": "Overhaul the main company website with the new branding guidelines.", "owner_id": db_users[1].id}
    ]
    
    db_projects = []
    for p in projects_data:
        proj = models.Project(**p)
        db.add(proj)
        db_projects.append(proj)
        
    db.commit()
    for p in db_projects:
        db.refresh(p)

    # Add Members
    # Demo user invites Alice to Marketing Campaign
    db.add(models.ProjectMember(project_id=db_projects[0].id, user_id=db_users[1].id, role=models.RoleEnum.member))
    # Alice invites Demo user to Website Redesign
    db.add(models.ProjectMember(project_id=db_projects[1].id, user_id=db_users[0].id, role=models.RoleEnum.member))
    
    db.commit()

    # Create Tasks for Project 1
    tasks_1 = [
        {"title": "Define target audience", "description": "Research and identify key demographics.", "status": models.TaskStatusEnum.done, "priority": models.TaskPriorityEnum.high, "project_id": db_projects[0].id, "assignee_id": db_users[0].id},
        {"title": "Draft ad copy", "description": "Write copy for Google Ads and Facebook.", "status": models.TaskStatusEnum.in_progress, "priority": models.TaskPriorityEnum.medium, "project_id": db_projects[0].id, "assignee_id": db_users[1].id},
        {"title": "Design banners", "description": "Create visual assets for the campaign.", "status": models.TaskStatusEnum.todo, "priority": models.TaskPriorityEnum.high, "project_id": db_projects[0].id, "assignee_id": None},
    ]
    
    # Create Tasks for Project 2
    tasks_2 = [
        {"title": "Wireframes", "description": "Create wireframes for homepage and about page.", "status": models.TaskStatusEnum.done, "priority": models.TaskPriorityEnum.high, "project_id": db_projects[1].id, "assignee_id": db_users[1].id},
        {"title": "Implement dark mode", "description": "Ensure dark mode works seamlessly across all pages.", "status": models.TaskStatusEnum.in_progress, "priority": models.TaskPriorityEnum.medium, "project_id": db_projects[1].id, "assignee_id": db_users[0].id},
    ]
    
    for t in tasks_1 + tasks_2:
        db.add(models.Task(**t))
        
    db.commit()
    print("Successfully seeded the database!")
    db.close()

if __name__ == "__main__":
    seed()
