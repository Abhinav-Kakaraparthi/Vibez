from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    LOCATION_RADIUS_METERS: float = 160.934
    REQUEST_EXPIRY_HOURS: int = 24
    DAILY_REQUEST_LIMIT: int = 5

    class Config:
        env_file = ".env"

settings = Settings()