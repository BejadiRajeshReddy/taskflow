from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import RoleEnum, TaskStatusEnum, TaskPriorityEnum

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_admin: bool

    class Config:
        from_attributes = True

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- Project Schemas ---
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Project Member Schemas ---
class ProjectMemberInvite(BaseModel):
    email: str

class ProjectMemberResponse(BaseModel):
    project_id: int
    user_id: int
    role: RoleEnum
    user: UserResponse

    class Config:
        from_attributes = True

# --- Task Schemas ---
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[TaskStatusEnum] = TaskStatusEnum.todo
    priority: Optional[TaskPriorityEnum] = TaskPriorityEnum.medium
    due_date: Optional[datetime] = None
    assignee_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatusEnum] = None
    priority: Optional[TaskPriorityEnum] = None
    due_date: Optional[datetime] = None
    assignee_id: Optional[int] = None

class TaskResponse(TaskBase):
    id: int
    project_id: int
    created_at: datetime
    assignee: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# --- Project Detailed Response ---
class ProjectDetailResponse(ProjectResponse):
    members: List[ProjectMemberResponse] = []
    tasks: List[TaskResponse] = []

    class Config:
        from_attributes = True
