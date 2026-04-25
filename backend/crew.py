"""
crew.py -- Assembles the CrewAI agents and tasks into a working Crew.

This is the main entry point for the backend logic. Call `run_crew()`
with the user's inputs to kick off the multi-agent planning pipeline.
"""

from crewai import Crew, Process
from backend.agents import (
    create_travel_researcher,
    create_logistics_manager,
    create_itinerary_compiler,
)
from backend.tasks import (
    create_research_task,
    create_logistics_task,
    create_compilation_task,
)


def run_crew(
    origin: str,
    destination: str,
    budget: int,
    num_persons: int,
    currency: str,
    currency_symbol: str,
    start_date: str,
    num_days: int,
    interests: str = "General sightseeing",
    progress_callback=None,
) -> str:
    """Assembles and kicks off the Travel Planner crew.

    Args:
        origin:          The city/airport the user is traveling from.
        destination:     The travel destination.
        budget:          Trip budget PER PERSON in the chosen currency.
        num_persons:     Number of travelers.
        currency:        Currency code (e.g., INR, USD, EUR, GBP).
        currency_symbol: Currency symbol (e.g., Rs., $, EUR, GBP).
        start_date:      Trip start date in YYYY-MM-DD format.
        num_days:        Number of days for the trip.
        interests:       Comma-separated travel interests.
        progress_callback: Optional callable(str) for streaming progress.

    Returns:
        The final itinerary as a Markdown-formatted string.
    """

    def _notify(msg: str):
        if progress_callback:
            progress_callback(msg)

    # -- Step callback for CrewAI to track agent progress --
    def step_callback(step_output):
        try:
            agent_role = getattr(step_output, "agent", "Agent")
            _notify(f"[{agent_role}] completed a step")
        except Exception:
            _notify("Agent completed a step")

    # -- Step 1: Create Agents --
    _notify("Creating agents...")
    researcher = create_travel_researcher()
    logistics_manager = create_logistics_manager()
    compiler = create_itinerary_compiler()

    # -- Step 2: Create Tasks --
    _notify("Setting up tasks...")
    research_task = create_research_task(researcher)
    logistics_task = create_logistics_task(logistics_manager)
    compilation_task = create_compilation_task(
        compiler,
        context_tasks=[research_task, logistics_task],
    )

    # -- Step 3: Assemble the Crew --
    _notify("Assembling crew and starting execution...")
    crew = Crew(
        agents=[researcher, logistics_manager, compiler],
        tasks=[research_task, logistics_task, compilation_task],
        process=Process.sequential,
        verbose=True,
        step_callback=step_callback,
    )

    # -- Step 4: Kick Off --
    total_budget = budget * num_persons
    _notify("Destination Expert is researching attractions and dining...")
    result = crew.kickoff(
        inputs={
            "origin": origin,
            "destination": destination,
            "budget_per_person": budget,
            "num_persons": num_persons,
            "total_budget": total_budget,
            "currency": currency,
            "currency_symbol": currency_symbol,
            "start_date": start_date,
            "num_days": num_days,
            "interests": interests,
        }
    )

    _notify("Itinerary generation complete!")
    return str(result)
