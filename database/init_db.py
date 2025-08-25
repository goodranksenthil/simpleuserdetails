import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'users.db')
engine = create_engine(f'sqlite:///{DB_PATH}')
SessionLocal = sessionmaker(bind=engine)

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    # Load users from JSON
    with open(os.path.join(os.path.dirname(__file__), 'users.json'), 'r') as f:
        users = json.load(f)
    for u in users:
        if not session.query(User).filter_by(username=u['username']).first():
            user = User(**u)
            session.add(user)
    session.commit()
    session.close()

if __name__ == '__main__':
    init_db()
