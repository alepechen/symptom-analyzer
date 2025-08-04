from sqlalchemy.orm import Session
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from models import User
import schemas

pwd_context = CryptContext(
    schemes=["bcrypt"], deprecated="auto"
)


def add_user(
    session: Session,
    name: str,
    password: str,
    email: str,
) -> User | None:
    hashed_password = pwd_context.hash(password)
    db_user = User(
        name=name,
        email=email,
        hashed_password=hashed_password,
    )
    session.add(db_user)
    try:
        session.commit()
        session.refresh(db_user)
    except IntegrityError:
        session.rollback()
        return
    return db_user


def get_user(
    session: Session, email: str
) -> User | None:
    
    query_filter = User.email
    user = (
        session.query(User)
        .filter(query_filter == email)
        .first()
    )
    return user

def create_user(session: Session, name: str, email: str, password: str) -> User:
    hashed_pw = pwd_context.hash(password)
    user = User(name=name, email=email, hashed_password=hashed_pw)
    session.add(user)
    try:
        session.commit()
        session.refresh(user)
    except IntegrityError:
        session.rollback()
        return
    return user
