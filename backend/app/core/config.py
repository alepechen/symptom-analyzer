from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.model_loader import load_model, load_label_map
from database import Base, engine
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = Field(default="HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")

    class Config:
        env_file = ".env"

settings = Settings()

def create_app() -> FastAPI:
    app = FastAPI()

    origins = [
        "http://localhost:3000",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def startup_event():
        print("Creating DB tables...")
        Base.metadata.create_all(bind=engine)

        print("Loading model and label map...")
        load_model()
        load_label_map()
        print("Startup complete.")

    return app
