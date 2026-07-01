from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    openai_api_key: str
    pinecone_api_key: str
    pinecone_index_name: str = "boardgameguru"
    embedding_model: str = "text-embedding-3-small"
    generation_model: str = "gpt-4o-mini"
    cors_origins: list[str] = ["http://localhost:3000"]


settings = Settings()
