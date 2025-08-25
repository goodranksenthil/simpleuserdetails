from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../database'))
from models import User, Base

DB_PATH = os.path.join(os.path.dirname(__file__), '../database/users.db')
engine = create_engine(f'sqlite:///{DB_PATH}')
SessionLocal = sessionmaker(bind=engine)

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

class UserUpdate(BaseModel):
    username: str
    email: str
    role: str

@app.post('/login')
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(username=data.username, password=data.password).first()
    if not user:
        return {"success": False}
    return {"success": True, "user": UserResponse(id=user.id, username=user.username, email=user.email, role=user.role)}

@app.get('/users')
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [UserResponse(id=u.id, username=u.username, email=u.email, role=u.role) for u in users]

@app.put('/users/{user_id}')
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.username = data.username
    user.email = data.email
    user.role = data.role
    db.commit()
    return {"success": True}
