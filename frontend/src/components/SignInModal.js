import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { loginUser } from '../api';
import { useAuth } from "../context/AuthContext";

export default function SignInModal({ show, handleClose }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      // Expect backend: { message, user_id } on success; 401 with detail on failure
      const res = await loginUser(email, password);

      // Defensive: only accept a payload that has a user_id
      if (!res || !res.user_id) {
        const msg =
          (typeof res === 'object' && (res.error || res.detail || res.message)) ||
          'Invalid email or password.';
        setError(String(msg));
        return; // <-- do NOT call login()
      }

      // Store the correct shape in AuthContext/localStorage
      login({ user_id: res.user_id });
      handleClose();
    } catch (err) {
      setError(err?.message || 'Unable to sign in right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
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
            />
          </Form.Group>

          <Form.Group controlId="signinPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary btn-3d" onClick={handleClose} disabled={submitting}>
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
