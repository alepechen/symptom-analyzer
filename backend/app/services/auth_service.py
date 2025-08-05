from sqlalchemy.orm import Session
from repositories import user_repository
from core.security import verify_password, create_access_token

def authenticate_user(session: Session, email: str, password: str):
    user = user_repository.get_user(session, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def generate_token_for_user(user):
    return create_access_token(data={"sub": user.email})

def register_user(session: Session, name: str, email: str, password: str):
    try:
        user = user_repository.create_user(session, name, email, password)
        return user
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )

