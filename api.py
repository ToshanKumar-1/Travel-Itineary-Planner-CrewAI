import os
import uuid
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import the existing crew logic
from backend.crew import run_crew

app = FastAPI(title="Travel Itinerary API")

# CORS - allow React dev server during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Thread pool for running blocking crew operations
executor = ThreadPoolExecutor(max_workers=2)


# Define the request model
class TripRequest(BaseModel):
    origin: str
    destination: str
    budget: int
    num_persons: int
    currency: str
    currency_symbol: str
    start_date: str
    num_days: int
    interests: str




@app.post("/api/generate")
async def generate_itinerary(request: TripRequest):
    """
    Non-blocking endpoint - runs crew in a thread pool.
    """
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            executor,
            lambda: run_crew(
                origin=request.origin,
                destination=request.destination,
                budget=request.budget,
                num_persons=request.num_persons,
                currency=request.currency,
                currency_symbol=request.currency_symbol,
                start_date=request.start_date,
                num_days=request.num_days,
                interests=request.interests,
            ),
        )
        return {"itinerary": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-stream")
async def generate_itinerary_stream(request: TripRequest):
    """
    SSE streaming endpoint - sends progress events then the final itinerary.
    """
    import queue

    progress_queue = queue.Queue()

    def progress_callback(msg: str):
        progress_queue.put(("progress", msg))

    async def event_generator():
        loop = asyncio.get_event_loop()

        # Start the crew in a thread
        future = loop.run_in_executor(
            executor,
            lambda: run_crew(
                origin=request.origin,
                destination=request.destination,
                budget=request.budget,
                num_persons=request.num_persons,
                currency=request.currency,
                currency_symbol=request.currency_symbol,
                start_date=request.start_date,
                num_days=request.num_days,
                interests=request.interests,
                progress_callback=progress_callback,
            ),
        )

        # Yield progress events while the crew is running
        while not future.done():
            try:
                event_type, msg = progress_queue.get_nowait()
                yield f"data: {json.dumps({'type': event_type, 'message': msg})}\n\n"
            except queue.Empty:
                pass
            await asyncio.sleep(0.5)

        # Drain any remaining progress messages
        while not progress_queue.empty():
            try:
                event_type, msg = progress_queue.get_nowait()
                yield f"data: {json.dumps({'type': event_type, 'message': msg})}\n\n"
            except queue.Empty:
                break

        # Send the final result
        try:
            result = future.result()
            yield f"data: {json.dumps({'type': 'complete', 'itinerary': result})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
