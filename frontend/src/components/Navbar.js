import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignUpModal from './SignUpModal';
import SignInModal from './SignInModal';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-light bg-light px-3">
      <Link to="/" className="navbar-brand">
        <img src="/logo-placeholder.png" alt="Home" height="40" />
      </Link>
      {user && (
        <Link to="/history" className="btn btn-outline-secondary mx-2">History</Link>
      )}
      <div className="ms-auto">
        {!user ? (
          <>
            <button className="btn btn-outline-primary mx-1" onClick={() => setShowSignUp(true)}>Sign Up</button>
            <button className="btn btn-outline-success mx-1" onClick={() => setShowSignIn(true)}>Sign In</button>
          </>
        ) : (
          <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
        )}
      </div>
      <SignUpModal show={showSignUp} handleClose={() => setShowSignUp(false)} />
      <SignInModal show={showSignIn} handleClose={() => setShowSignIn(false)} />
    </nav>
  );
}