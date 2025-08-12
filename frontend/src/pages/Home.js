import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeInput from "../components/ResumeInput";
import JobDescriptionInput from "../components/JobDescriptionInput";
import { evaluateFit, saveResult, uploadResume } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [resumeData, setResumeData] = useState(""); // text (MVP)
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();


  const handleEvaluate = async () => {
    // For MVP we're sending text. (If resumeData is a File, add the upload step later.)
    const resume_text =
      typeof resumeData === "string" ? resumeData : "";

    // Save inputs we’ll need later for cover letter generation
    localStorage.setItem(
      "evaluationInputs",
      JSON.stringify({
        resume_text,
        job_description: description,
        company_name: company, // not yet required by backend
        job_title: title, // not yet required by backend
      })
    );

    // Call evaluation
    const payload = {
      resume_text,
      job_description: description,
    };

    try {
      const result = await evaluateFit(payload);
      localStorage.setItem("evaluation", JSON.stringify(result));

      if (user) {
        const save = await saveResult(
          {
            user_id: user.id,
            company_name: company,
            job_title: title,
            job_description: description,
            evaluation_result: result.evaluation ?? "",
            resume_text,
            cover_letter: null,
          },
          user.token
        );

      }
      // keep last job id to attach cover-letter later
      if (save?.job_id) {
        localStorage.setItem("lastJobId", save.job_id);
      }
      
      navigate("/results");
    } catch (e) {
      alert(`Evaluation failed:\n${e.message}`);
    }
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
            <ResumeInput
              value={resumeData}
              onChange={setResumeData}
              onFileDrop={async (file) => {
                try {
                  const { resume_text } = await uploadResume(file);
                  setResumeData(resume_text);
                } catch (e) {
                  alert(`Failed to upload resume: ${e.message}`);
                }
              }}
            />
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
        <button className="btn btn-primary btn-lg px-5 btn-3d" onClick={handleEvaluate}>
          Evaluate Job Fit
        </button>
      </div>
    </div>
  );
}
