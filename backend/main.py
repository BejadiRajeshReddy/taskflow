from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine

from routers import auth, projects, tasks, admin

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Management API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://task-flow-mu-silk.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Task Management API"}
