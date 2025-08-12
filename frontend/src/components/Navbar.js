import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUpModal from "./SignUpModal";
import SignInModal from "./SignInModal";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-light bg-info shadow-sm px-3 d-flex justify-content-between align-items-center">
      {/* Left Section */}
      <div className="d-flex align-items-center">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img src="/AlignAI-logo-3.png" alt="Home" height="40" className="btn-3d" />
        </Link>
      </div>

      {/* Center Section */}
      <div className="position-absolute start-50 translate-middle-x mt-2">
        <img src="/AlignAI-logo-9.png" alt="AlignAI Logo" height="50" />
      </div>

      {/* Right Section */}
      <div className="d-flex align-items-center gap-2">
        {user ? (
          <>
            <Link to="/history" className="btn btn-outline-primary btn-3d">History</Link>
            <button className="btn btn-secondary btn-3d" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-primary btn-3d" onClick={() => setShowSignUp(true)}>
              Sign Up
            </button>
            <button className="btn btn-outline-primary btn-3d" onClick={() => setShowSignIn(true)}>
              Sign In
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      <SignUpModal show={showSignUp} handleClose={() => setShowSignUp(false)} />
      <SignInModal show={showSignIn} handleClose={() => setShowSignIn(false)} />
    </nav>
  );
}
