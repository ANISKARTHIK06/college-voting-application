from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    PORT: int = 5000
    MONGO_URI: str = "mongodb://127.0.0.1:27017"
    DB_NAME: str = "college_voting_db"
    NODE_ENV: str = "development"
    JWT_SECRET: str = "super_secure_secret_key_change_me_in_production"
    JWT_EXPIRY_MINUTES: int = 43200  # 30 days
    JWT_ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
