import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# === Load test data ===
with open("backend/cli/sample_resume.txt", "r", encoding="utf-8") as f:
    resume_text = f.read()

with open("backend/cli/sample_jd.txt", "r", encoding="utf-8") as f:
    job_description = f.read()

# === Evaluation Prompt ===
system_prompt_eval = {
    "role": "system",
    "content": (
        "You are an AI job application evaluator.\n"
        "Base your evaluation only on clearly stated information in the resume.\n"
        "Do not assume or invent technical skills or certifications not explicitly listed."
    )
}

user_prompt_eval = (
    "You are an AI job application evaluator.\n\n"
    "Compare the following resume and job description.\n\n"
    "Only use information that is explicitly stated in the resume.\n"
    "Do not infer, guess, or assume any experience, skills, or tools that are not clearly listed.\n\n"
    "Give:\n"
    "1. A score from 1–10 representing overall fit\n"
    "2. A total of 5–7 bullet points in a single section labeled \"Alignments and Gaps:\"\n"
    "   - First list all alignments, each starting with \"Alignment:\"\n"
    "   - Then list all gaps, each starting with \"Gap:\"\n"
    "   - Do not mix them. Keep all alignments first, then all gaps.\n"
    "3. A one-paragraph summary of how well the applicant fits the job\n\n"
    f"Resume:\n{resume_text}\n\n"
    f"Job Description:\n{job_description}\n\n"
    "Respond in this exact format:\n"
    "---\n"
    "Score: <1-10>\n\n"
    "Alignments and Gaps:\n"
    "- Alignment: ...\n"
    "- Gap: ...\n\n"
    "Summary:\n"
    "<One paragraph summary>\n"
    "---"
)

# === Cover Letter Prompt ===
system_prompt_cover = {
    "role": "system",
    "content": "You are a helpful and professional AI career assistant."
}

user_prompt_cover = (
    "You are a professional career coach and resume writer.\n\n"
    "Using the resume and job description provided below, write a tailored cover letter that:\n"
    "- Is personalized and specific to the job description\n"
    "- Emphasizes the candidate’s most relevant experience and strengths\n"
    "- Sounds human, confident, and enthusiastic\n"
    "- Avoids generic or overly formal language\n"
    "- Is no more than 4 paragraphs long\n\n"
    f"Resume:\n{resume_text}\n\n"
    f"Job Description:\n{job_description}\n\n"
    "Format:\n"
    "Dear [Hiring Manager or Company Name],\n\n"
    "<Paragraphs>\n\n"
    "Sincerely,\n"
    "[Your Name]"
)

# === Send Evaluation Prompt ===
response_eval = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        system_prompt_eval,
        {"role": "user", "content": user_prompt_eval}
    ],
    temperature=0.3
)

# === Send Cover Letter Prompt ===
response_cover = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        system_prompt_cover,
        {"role": "user", "content": user_prompt_cover}
    ],
    temperature=0.7
)

# === Output ===
print("\n=== AI Evaluation Result ===\n")
print(response_eval.choices[0].message.content)

print("\n=== Generated Cover Letter ===\n")
print(response_cover.choices[0].message.content)
