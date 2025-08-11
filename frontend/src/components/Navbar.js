import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUpModal from "./SignUpModal";
import SignInModal from "./SignInModal";
import useAuth from "../hooks/useAuth";

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
    <nav className="navbar navbar-light bg-info shadow-sm px-3">
      <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
        {/* Use public/ asset via root-relative path */}
        <img src="/AlignAI-logo-3.png" alt="Home" height="40" />
      </Link>

      {/* Left-aligned actions per your spec */}
      {user ? (
        <div className="d-flex align-items-center gap-2">
          <Link to="/history" className="btn btn-outline-primary">History</Link>
          <button className="btn btn-secondary" onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-primary" onClick={() => setShowSignUp(true)}>Sign Up</button>
          <button className="btn btn-outline-primary" onClick={() => setShowSignIn(true)}>Sign In</button>
        </div>
      )}

      {/* Modals */}
      <SignUpModal show={showSignUp} handleClose={() => setShowSignUp(false)} />
      <SignInModal show={showSignIn} handleClose={() => setShowSignIn(false)} />
    </nav>
  );
}
