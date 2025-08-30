import os
from google import genai
from markdown_pdf import MarkdownPdf
from markdown_pdf import Section
import random
import datetime


def generate(data):
    print(data)
    client = genai.Client()

    model = "gemini-2.5-flash"

    prompt = f"""
        Task:data.get("language","English")
        Generate a detailed analytical report based on all the data provided to you above in {data.get("language","English")} language.

        Focus:
        Assess the impact of {data.get("reason","")} on groundwater quantity (levels), quality, or both—depending on the evidence in the data.

        Report Structure:

        1. Observed Levels of Release and Usage

        Summarize the learned trends and magnitudes of release, extraction, or usage patterns from the data.

        2. Impact on Groundwater

        Explain the effects of these levels on both groundwater quality and groundwater availability/quantity.

        Consider possible intensification of groundwater demand in the area (due to the {data.get("reason","")}).

        date info: {datetime.datetime.now()}

        IMPORTANT: Start your response with a level 1 heading (# Title) and ensure proper markdown heading hierarchy (# for level 1, ## for level 2, etc.)
        Strictly follow markdown format, the response should feel like a report with proper headings.
    """

    response = client.models.generate_content(
        model=model,
        contents=str(data) + f"\n\n{prompt}"
    )
    print(response.text)

    markdown_content = str(response.text)

    try:
        pdf = MarkdownPdf()
        pdf.add_section(Section(markdown_content))

        rand_flag = True
        rnd = 0
        while rand_flag:
            rnd = random.randint(1, 1000000000000)
            if f"report_{rnd}" not in os.listdir("static"):
                break

        pdf.save(f"static/report_{rnd}.pdf")
        return f"static/report_{rnd}.pdf"
    
    except Exception as e:
        print(f"Error generating PDF: {e}")
        # Fallback: save as text file
        with open(f"static/report_{rnd}.txt", 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        return f"static/report_{rnd}.txt"
