# AIIA – AI-Powered Investment Assistant

AIIA (Artificial Intelligence Investment Advisor) is a web application that provides an AI-driven personal investment assistant. It leverages advanced language models and real-time market data to help users build and manage an investment portfolio. The application consists of a FastAPI backend and a React (Vite) + TailwindCSS frontend, working together to deliver intelligent portfolio recommendations and a smooth user experience.

## Features

- LLM-driven portfolio recommendations via OpenAI API  
- Real-time market data from Alpha Vantage (fallback to Yahoo Finance)  
- Responsive React + Vite frontend styled with TailwindCSS (light/dark mode, sliders, charts)  
- JWT authentication and MongoDB Atlas persistence  
- Modular, deployable architecture  

## Tech Stack

1. FastAPI (Python)  
2. MongoDB Atlas  
3. React with Vite  
4. TailwindCSS  
5. OpenAI API integration  
6. Alpha Vantage (optional, with Yahoo Finance fallback)  

## Project Structure

- **backend/**  
  - **app/**  
    - **main.py**           FastAPI entry point  
    - **routes/**           auth.py, recommend.py, portfolio.py, user.py  
    - **utils/**            auth.py, ai.py, database.py, config.py  
  - requirements.txt       Python dependencies  
  - .env                   Environment variables

- **frontend/**  
  - **public/**  
    - AIIA.png             Logo & favicon  
  - **src/**  
    - **pages/**            Dashboard.tsx, Login.tsx, Signup.tsx, Settings.tsx  
    - **components/**       ProfileSidebar.tsx, charts, etc.  
    - **services/**         api.ts (axios wrappers)  
    - AuthContext.tsx  
    - index.css             Tailwind directives + custom utilities  
    - main.tsx              React entry point  
  - vite.config.ts         Vite configuration  
  - package.json           Node dependencies & scripts  

## Prerequisites

- Node.js v16+  
- Python 3.10–3.13  
- MongoDB Atlas account & connection URI  
- OpenAI API Key  
- (Optional) Alpha Vantage API Key  

## Environment Variables

### Backend (`backend/.env`)
```bash
    OPENAI_API_KEY=YOUR_OPENAI_API_KEY 
    OPENAI_MODEL=gpt-4o-mini  

    ALPHA_VANTAGE_KEY=YOUR_ALPHA_VANTAGE_KEY  
    MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority 
    code: MONGO_DB_NAME=aiia_db  
    JWT_SECRET=your_jwt_secret
```

### Frontend (`frontend/.env`)

```VITE_API_URL=http://localhost:8000```  

> Note: Vite only exposes variables prefixed with `VITE_` to the client.

## Local Development

1. **Clone the repository**  
```bash
    git clone https://github.com/yourusername/aiia.git  
    cd aiia
```

2. **Backend setup**  
```bash
   cd backend   
   python3 -m venv venv   
   source venv/bin/activate (Windows: venv\Scripts\activate)  
   pip install -r requirements.txt  
   uvicorn app.main:app --reload
   ```

3. **Frontend setup**  
```bash
   cd frontend   
   npm install   
   npm run dev 
```

4. **Access the app**  
   - Backend API docs: http://localhost:8000/docs  
   - Frontend UI:       http://localhost:5173  

## Usage

1. Sign up or log in via the frontend  
2. Enter investment criteria (budget, horizon, risk, preferences, broker)  
3. Click “Generate Portfolio” to receive AI-driven allocations  
4. View interactive charts (pie for allocation, line for history)  
5. Update profile settings (email, theme, age, field of study)  

## Troubleshooting

- **CORS errors**: Ensure FastAPI CORS middleware allows `http://localhost:5173`  
- **Invalid API keys**: Verify values in `backend/.env`  
- **MongoDB connection**: Confirm Atlas URI, credentials, and network access rules  
- **Favicon not showing**: Place `AIIA.png` in `frontend/public` and reference `/AIIA.png`; clear browser cache  
- **Tailwind build errors**: Confirm `index.css` includes `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`  

## Deployment

- **Frontend**: Deploy to Vercel, Netlify, or similar. Set `VITE_API_URL` to production backend URL  
- **Backend**: Deploy to Render, Railway, or similar. Use start command:  
```bash
    uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
  Configure environment variables in your hosting dashboard  
- **Database**: Continue using MongoDB Atlas; whitelist production server IP  
- **Domain & SSL**: Set up custom domain and HTTPS in your hosting provider  
