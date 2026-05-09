import sqlite3
import os
from database import SessionLocal
import models

def run_seed():
    db_path = os.path.join(os.path.dirname(__file__), 'taskapp.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0")
        conn.commit()
        print("Added is_admin column.")
    except sqlite3.OperationalError as e:
        print("Column may already exist:", e)

    cursor.execute("UPDATE users SET is_admin = 1 WHERE username = 'rocky'")
    conn.commit()
    print("Promoted rocky to admin.")
    conn.close()

    db = SessionLocal()
    # Seed data for users manually created: rocky, sai, raj, test4
    target_users = ['rocky', 'sai', 'raj', 'test4']
    users = db.query(models.User).filter(models.User.username.in_(target_users)).all()
    
    for u in users:
        # Check if project exists for user
        proj = db.query(models.Project).filter(models.Project.owner_id == u.id, models.Project.name.like(f"%{u.username.capitalize()}'s%")).first()
        if not proj:
            proj = models.Project(name=f"{u.username.capitalize()}'s Master Project", description=f"A sample project generated for {u.username}.", owner_id=u.id)
            db.add(proj)
            db.commit()
            db.refresh(proj)
            
            # Create some tasks
            tasks = [
                models.Task(title="Initial Setup", description="Set up the development environment.", status=models.TaskStatusEnum.done, priority=models.TaskPriorityEnum.high, project_id=proj.id, assignee_id=u.id),
                models.Task(title="Feature Implementation", description="Implement core logic.", status=models.TaskStatusEnum.in_progress, priority=models.TaskPriorityEnum.medium, project_id=proj.id, assignee_id=u.id),
                models.Task(title="Testing", description="Write unit tests.", status=models.TaskStatusEnum.todo, priority=models.TaskPriorityEnum.low, project_id=proj.id, assignee_id=None),
            ]
            for t in tasks:
                db.add(t)
            db.commit()
            print(f"Created sample project and tasks for {u.username}.")
        else:
            print(f"{u.username} already has a sample project.")

    db.close()

if __name__ == '__main__':
    run_seed()
