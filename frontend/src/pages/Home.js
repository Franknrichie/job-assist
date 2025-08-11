import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeInput from "../components/ResumeInput";
import JobDescriptionInput from "../components/JobDescriptionInput";
import { evaluateFit, saveResult, uploadResume } from "../api";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const [resumeData, setResumeData] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

const handleEvaluate = async () => {
  let resumeText = "";

  if (typeof resumeData === "string") {
    resumeText = resumeData;
  } else if (resumeData instanceof File) {
    // get extracted text from backend first
    const { resume_text } = await uploadResume(resumeData);
    resumeText = resume_text;
  }

  const payload = {
    resume_text: resumeText,
    job_description: description
  };

  const result = await evaluateFit(payload);
  localStorage.setItem("evaluation", JSON.stringify(result));

  if (user) {
    await saveResult(
      {
        job_description: description,
        evaluation_result: result.evaluation, // your backend returns { evaluation: "..." }
        cover_letter: null,
        user_id: user.id
      },
      user.token
    );
  }

  navigate("/results");
};

  return (
    <div className="container-xl py-4">
      <div className="row mb-3 text-center">
        <div className="col">
          <h2 className="fw-semibold m-0">Evaluate Your Job Fit</h2>
          <small className="text-muted">
            Paste your resume or drop a file on the left, add job details on the right.
          </small>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="panel card-like h-100 app-panel">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h5 className="m-0">Resume</h5>
              <span className="badge text-bg-light">Paste or Drag & Drop</span>
            </div>
            <ResumeInput onChange={setResumeData} />
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="panel card-like h-100 app-panel">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h5 className="m-0">Job Details</h5>
              <span className="badge text-bg-light">Company · Title · Description</span>
            </div>
            <JobDescriptionInput
              company={company}
              setCompany={setCompany}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-primary btn-lg px-5" onClick={handleEvaluate}>
          Evaluate Job Fit
        </button>
      </div>
    </div>
  );
}
