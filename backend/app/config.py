from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    openai_api_key: str
    pinecone_api_key: str
    together_api_key: str
    pinecone_index_name: str = "boardgameguru"
    embedding_model: str = "text-embedding-3-small"
    qa_generation_model: str = "gpt-5.4-mini"
    # Serves the live /query endpoint. Confirmed servable via Together's shared
    # serverless inference (no dedicated endpoint needed).
    live_generation_model: str = "Qwen/Qwen2.5-7B-Instruct-Turbo"
    # Fine-tuning target. Serving fine-tuned Together models requires a $6.49/hr
    # dedicated endpoint, so the resulting adapter is downloaded and evaluated
    # locally instead of swapped into live_generation_model.
    finetune_base_model: str = "Qwen/Qwen2.5-3B-Instruct"
    # Comma-separated in the environment (e.g. Railway dashboard), e.g.
    # "http://localhost:3000,https://boardgameguru.vercel.app"
    cors_origins_raw: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]


settings = Settings()
