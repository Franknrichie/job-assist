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
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-light navbar-expand-lg bg-info shadow-sm px-3 position-relative">
      <div className="container-fluid align-items-center flex-nowrap position-relative">
        {/* Left: brand */}
        <div className="d-flex align-items-center flex-shrink-0">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <img src="/AlignAI-logo-3.png" alt="Home" height="40" className="btn-3d" />
          </Link>
        </div>

        {/* Center: truly centered title */}
        <div className="navbar-center">
          <h1 className="alignai-logo m-0">AlignAI</h1>
        </div>

        {/* Desktop actions (right-aligned, lg+) */}
        <div className="d-none d-lg-flex align-items-center gap-2 ms-auto">
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

        {/* Hamburger (shows on < lg) */}
        <button
          className="navbar-toggler ms-auto d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Mobile overlay menu */}
        <div
          id="mainNav"
          className="collapse d-lg-none dropdown-panel position-absolute end-0 top-100 mt-2"
        >
          <ul className="navbar-nav small-menu">
            {user ? (
              <>
                <li className="nav-item">
                  <Link
                    to="/history"
                    className="nav-link small-menu__link"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNav"
                  >
                    History
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link small-menu__link bg-transparent border-0 w-100"
                    onClick={handleLogout}
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNav"
                  >
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <button
                    className="nav-link small-menu__link bg-transparent border-0 w-100"
                    onClick={() => setShowSignUp(true)}
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNav"
                  >
                    Sign Up
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link small-menu__link bg-transparent border-0 w-100"
                    onClick={() => setShowSignIn(true)}
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNav"
                  >
                    Sign In
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Modals */}
      <SignUpModal
        show={showSignUp}
        handleClose={() => setShowSignUp(false)}
        onOpenSignIn={() => {
          setShowSignUp(false);
          setShowSignIn(true);
        }}
      />
      <SignInModal show={showSignIn} handleClose={() => setShowSignIn(false)} />
    </nav>
  );
}
