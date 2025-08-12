import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { registerUser } from '../api';

export default function SignUpModal({ show, handleClose, onOpenSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // separate success modal state (stays mounted even after Sign Up closes)
  const [showSuccess, setShowSuccess] = useState(false);

  const reset = () => {
    setEmail('');
    setPassword('');
    setConfirm('');
    setError('');
    setSubmitting(false);
  };

  const onSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!email || !password || !confirm) {
      setError('Please complete all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerUser(email, password);
      // Expect success shape: { message, user_id }
      if (!res || !res.user_id) {
        const msg =
          (typeof res === 'object' && (res.error || res.detail || res.message)) ||
          'Unable to create account.';
        setError(String(msg));
        return;
      }
      // Close Sign Up, reset its fields, then show success modal
      handleClose();
      reset();
      setShowSuccess(true);
    } catch (err) {
      setError(err?.message || 'Unable to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Sign Up modal */}
      <Modal
        show={show}
        onHide={() => { handleClose(); reset(); }}
        onExited={reset}   // ensure state clears after closing animation
      >
        <Form onSubmit={onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Sign Up</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

            <Form.Group className="mb-3" controlId="signupEmail">
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

            <Form.Group className="mb-3" controlId="signupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </Form.Group>

            <Form.Group controlId="signupConfirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary btn-3d"
              onClick={() => { handleClose(); reset(); }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary btn-3d" disabled={submitting}>
              {submitting ? 'Creating…' : 'Submit'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Success modal shown after account creation */}
      <Modal
        show={showSuccess}
        onHide={() => setShowSuccess(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>User Account Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your account has been created successfully.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary btn-3d"
            onClick={() => {
              setShowSuccess(false);
              onOpenSignIn?.(); // open Sign In modal in the parent
            }}
          >
            Go to Sign In
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
