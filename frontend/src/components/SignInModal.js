import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { loginUser } from '../api';
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';

export default function SignInModal({ show, handleClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();  


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setEmail('');
    setPassword('');
    setError('');
    setSubmitting(false);
  };

  const onSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await loginUser(email, password);
      if (!res || !res.user_id) {
        const msg =
          (typeof res === 'object' && (res.error || res.detail || res.message)) ||
          'Invalid email or password.';
        setError(String(msg));
        return;
      }
      login({ user_id: res.user_id });
      // Clear guest mode and navigate to Home or the original protected route
      sessionStorage.removeItem('alignai_guest');
      const from =
        (location?.state && location.state.from && location.state.from.pathname) || '/';
      navigate(from, { replace: true });
      handleClose();
      reset();
    } catch (err) {
      setError(err?.message || 'Unable to sign in right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => { handleClose(); reset(); }}   // reset on any manual close
      onExited={reset}                             // extra safety: reset after animation ends
    >
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          <Form.Group className="mb-3" controlId="signinEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              placeholder="you@example.com"
              autoComplete="username"
            />
          </Form.Group>

          <Form.Group controlId="signinPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary btn-3d" onClick={() => { handleClose(); reset(); }} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="success btn-3d" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
