from fastapi import FastAPI

app = FastAPI(title="Pulse Recommender")


@app.get("/health")
def health():
    return {"status": "ok"}
