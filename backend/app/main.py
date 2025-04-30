from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import portfolio, user

from .routes.auth import router as auth_router
from .routes.recommend import router as recommend_router

app = FastAPI()

# CORS settings for your Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with their prefixes
app.include_router(auth_router)          # routes under /auth
app.include_router(recommend_router)     # routes under /recommend

app.include_router(portfolio.router)
app.include_router(user.router)