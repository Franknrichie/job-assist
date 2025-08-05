import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Load test data
with open("cli/sample_resume.txt", "r", encoding="utf-8") as f:
    resume_text = f.read()

with open("cli/sample_jd.txt", "r", encoding="utf-8") as f:
    job_description = f.read()

# === Evaluation Prompt ===
system_prompt_eval = {
    "role": "system",
    "content": (
        "You are an AI job application evaluator.\n"
        "Base your evaluation only on clearly stated information in the resume.\n"
        "You may draw reasonable connections between professional roles and relevant domains "
        "if the connection is clearly implied by the role.\n"
        "Do not assume or invent technical skills, tools, or certifications that are not explicitly listed."
    )
}

user_prompt_eval = f"""
You are an AI job application evaluator.

Compare the following resume and job description.

Only use information that is explicitly stated in the resume.
Do not infer, guess, or assume any experience, skills, or tools that are not clearly listed.

Give:
1. A score from 1–10 representing overall fit
2. A total of 5–7 bullet points in a single section labeled "Alignments and Gaps:"
   - First list all alignments, each starting with "Alignment:"
   - Then list all gaps, each starting with "Gap:"
   - Do not mix them. Keep all alignments first, then all gaps.
3. A one-paragraph summary of how well the applicant fits the job

Resume:
\"\"\"{resume_text}\"\"\"

Job Description:
\"\"\"{job_description}\"\"\"

Respond in this exact format:
---
Score: <1-10>

Alignments and Gaps:
- Alignment: ...
- Alignment: ...
- Gap: ...
- Gap: ...

Summary:
<One paragraph summary>
---
"""

# === Cover Letter Prompt ===
system_prompt_cover = {
    "role": "system",
    "content": "You are a helpful and professional AI career assistant."
}

user_prompt_cover = f"""
You are a professional career coach and resume writer.

Using the resume and job description provided below, write a tailored cover letter that:
- Is personalized and specific to the job description
- Emphasizes the candidate’s most relevant experience and strengths
- Sounds human, confident, and enthusiastic
- Avoids generic or overly formal language
- Is no more than 4 paragraphs long

Resume:
\"\"\"{resume_text}\"\"\"

Job Description:
\"\"\"{job_description}\"\"\"

Format:
Dear [Hiring Manager or Company Name],

<Paragraphs>

Sincerely,
[Your Name]
"""

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
