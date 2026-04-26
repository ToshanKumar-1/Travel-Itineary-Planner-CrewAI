# 🌍 AI Travel Itinerary Planner

A multi-agent AI system that generates detailed, budget-aware, day-by-day travel itineraries using **CrewAI**, **Google Gemini**, and **Serper/SerpAPI** web search. The project features a modern React frontend and a FastAPI backend with Server-Sent Events (SSE) streaming.

## Architecture

This project uses a **3-agent pipeline** powered by CrewAI:

| Agent | Role | What It Does |
|-------|------|-------------|
| 🔍 **Travel Researcher** | Destination Expert | Searches the web for top attractions, restaurants, local tips, and hidden gems. |
| 💼 **Logistics Manager** | Budget Coordinator | Finds flight & hotel prices, calculates total costs, and verifies the budget. |
| 📋 **Itinerary Compiler** | Master Planner | Combines all research into a polished, day-by-day Markdown itinerary. |

The agents work **sequentially** — the Researcher and Logistics Manager do their work first (often in parallel), then the Compiler reads their outputs and creates the final plan.

## Tech Stack

- **Python** — Core language
- **CrewAI** — Multi-agent orchestration framework
- **FastAPI** — High-performance backend API with SSE streaming
- **React + Vite** — Modern frontend with a dark-mode glassmorphism Sage Green theme
- **Google Gemini** — LLM (gemini-3.1-flash-lite-preview)
- **Serper API & SerpAPI** — Google search APIs for real-time web data, flights, and hotels

## Setup

### 1. Backend Setup

Open a terminal in the root project directory (`Travel_Itinerary_Planner`):

```bash
# Create & activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup

Open a separate terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

### 3. Add your API keys

Edit or create the `.env` file in the root directory and paste your keys:

```env
GEMINI_API_KEY=your_gemini_key_here
SERPER_API_KEY=your_serper_key_here
SERPAPI_API_KEY=your_serpapi_key_here
```

- **Gemini API Key:** Get it free from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Serper API Key:** Used for general web search. Get 2,500 free searches from [serper.dev](https://serper.dev)
- **SerpAPI Key:** Used for Google Flights and Google Hotels searches. Get it from [serpapi.com](https://serpapi.com)

## Usage

### Run the Backend Server
```bash
# In the project root (ensure venv is activated)
python api.py
```
The API server will run at `http://localhost:8000`.

### Run the Frontend
```bash
# In the frontend directory
npm run dev
```
The React frontend will be available at `http://localhost:5173`. Open this URL in your browser to start planning!

## Project Structure

```
Travel_Itinerary_Planner/
├── .env                  # API Keys (not committed to git)
├── requirements.txt      # Python dependencies
├── README.md             # Project documentation
├── api.py                # FastAPI backend server with SSE
├── frontend/             # React + Vite frontend application
│   ├── src/              # React components and styling
│   ├── package.json      # Node.js dependencies
│   └── vite.config.js    # Vite configuration
└── backend/
    ├── agents.py         # 3 CrewAI agent definitions
    ├── tasks.py          # Task definitions for each agent
    ├── tools.py          # Custom tools (Flight/Hotel search)
    └── crew.py           # Assembles agents + tasks into a Crew
```
