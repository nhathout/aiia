from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, recommend, portfolio

app = FastAPI(title="AIIA – AI Investment Advisor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # tighten for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(recommend.router)
app.include_router(portfolio.router)