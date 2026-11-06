
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography
} from "@mui/material";

import { GroupsRounded } from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password
      });

      setMessage("Registration successful! Please sign in.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="auth-container">

      {/* Left Section */}

      <Box className="auth-left">

        <Box className="auth-brand">
          <GroupsRounded sx={{ fontSize: 45 }} />

          <Typography variant="h5" fontWeight="bold">
            EMS
          </Typography>
        </Box>

        <Box>
          <Typography variant="h2" fontWeight="bold">
            Join Our Team.
            <br />
            Start Growing.
          </Typography>

          <Typography className="auth-description">
            Create your account to access the Employee
            Management System.
          </Typography>
        </Box>

        <Typography variant="body2">
          © 2026 Employee Management System
        </Typography>

      </Box>

      {/* Right Section */}

      <Box className="auth-right">

        <Paper className="auth-card" elevation={0}>

          <Typography variant="h4" fontWeight="bold">
            Create Account
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Enter your details to register.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>

            <TextField
              fullWidth
              required
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              required
              type="email"
              label="Email Address"
              name="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              required
              type="password"
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              inputProps={{ minLength: 8 }}
            />

            <TextField
              fullWidth
              required
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              margin="normal"
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              className="auth-button"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

          </Box>

          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ mt: 3 }}
          >
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </Typography>

        </Paper>

      </Box>

    </Box>
  );
}
