import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDocumentTitle } from "../utils/useDocumentTitle";

export default function LandingPage() {
  useDocumentTitle("AlignAI | Welcome");

  const navigate = useNavigate();

  const openAuthModal = (which) => {
    // Broadcast so existing modal host can open the right modal
    document.dispatchEvent(new CustomEvent("auth:open", { detail: { which } }));
  };

  const useAsGuest = () => {
    sessionStorage.setItem("alignai_guest", "1");
    navigate("/");
  };

  useEffect(() => {
  }, []);

  return (
    <div className="landing-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card card-elevated rounded-4">
              <div className="card-body p-4 p-md-5 text-center">
                <img
                  src="/AlignAI-logo.png"
                  alt="AlignAI Logo"
                  style={{ width: 384, height: 384 }}
                  className="mb-3"
                />
                <p className="text-muted mb-4">
                  Compare your resume to any job description, get a clear score, see strengths and gaps, then generate a tailored cover letter.
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary px-4 py-2 btn-3d"
                    onClick={() => openAuthModal("signup")}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    className="btn btn-success px-4 py-2 btn-3d"
                    onClick={() => openAuthModal("signin")}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary px-4 py-2 btn-3d"
                    onClick={useAsGuest}
                    title="Guest usage does not keep evaluation history"
                  >
                    Use As Guest
                  </button>
                </div>

                <p className="small text-muted mt-3">
                  Note: Guest usage does not keep evaluation history.
                </p>
              </div>
            </div>

            {/* Showcase of how it works */}
            <div className="row g-3 mt-4">
              <div className="col-md-4">
                <div className="p-3 card-step h-100">
                  <div className="fw-semibold mb-1">1. Add inputs</div>
                  <div className="text-muted small">
                    Paste your resume and the job description, or upload a file.
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 card-step h-100">
                  <div className="fw-semibold mb-1">2. Get a score</div>
                  <div className="text-muted small">
                    See strengths and gaps at a glance with a clear 1 to 10 score.
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 card-step h-100">
                  <div className="fw-semibold mb-1">3. Generate letter</div>
                  <div className="text-muted small">
                    Create a tailored cover letter you can download and edit.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
