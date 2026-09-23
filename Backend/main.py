from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import json
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


class EmailRequest(BaseModel):
    topic: str


@app.get("/")
def home():
    return {
        "message": "AI Email Generator is running"
    }


@app.post("/generate-email")
def generate_email(request: EmailRequest):

    prompt = f"""
You are a professional email writing assistant.

The user will provide a topic or rough idea.
Generate a professional email based on that idea.

User's topic:
{request.topic}

Return ONLY valid JSON in exactly this format:

{{
    "subject": "The email subject",
    "body": "The complete email body"
}}

Rules:
- Do not include markdown.
- Do not include ```json.
- Do not add any explanation.
- Keep the email professional.
- If specific information is missing, use placeholders such as [Name] or [Date].
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7
    )

    generated_email = response.choices[0].message.content

    email_data = json.loads(generated_email)

    return email_data