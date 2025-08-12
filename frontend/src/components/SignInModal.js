import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { loginUser } from '../api';
import { useAuth } from "../context/AuthContext";

export default function SignInModal({ show, handleClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async () => {
    const res = await loginUser(email, password);
    if (res.error) {
      setError(res.error);
    } else {
      login(res);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sign In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary btn-3d" onClick={handleClose}>Cancel</Button>
        <Button variant="success btn-3d" onClick={handleSubmit}>Sign In</Button>
      </Modal.Footer>
    </Modal>
  );
}