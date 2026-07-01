from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    openai_api_key: str
    pinecone_api_key: str
    together_api_key: str
    pinecone_index_name: str = "boardgameguru"
    embedding_model: str = "text-embedding-3-small"
    base_generation_model: str = "meta-llama/Llama-3.2-3B-Instruct"
    finetuned_generation_model: str | None = None
    cors_origins: list[str] = ["http://localhost:3000"]


settings = Settings()
