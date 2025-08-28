import os
from google import genai
from markdown_pdf import MarkdownPdf
from markdown_pdf import Section
import random
import datetime


def generate(data):
    client = genai.Client()

    model = "gemini-2.5-flash"

    response = client.models.generate_content(
        model=model,
        contents=str(data)
        + f"\n\nmake a structured profeesion report about this data in markdown format in {data.get("language","English")} language, date info: {datetime.datetime.now()}",
    )
    print(response.text)

    pdf = MarkdownPdf()

    pdf.add_section(Section(response.text if response.text else ""))

    rand_flag = True
    rnd = 0
    while rand_flag:
        rnd = random.randint(1, 1000000000000)
        if f"report_{rnd}" not in os.listdir("static"):
            break

    pdf.save(f"static/report_{rnd}.pdf")

    return f"static/report_{rnd}.pdf"
