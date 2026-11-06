
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  IconButton
} from "@mui/material";

import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  GroupsRounded
} from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your email and password."
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
            Manage Your Team.
            <br />
            Grow Together.
          </Typography>

          <Typography className="auth-description">
            A simple and powerful Employee Management System
            to manage employees, departments and daily
            operations in one place.
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
            Welcome Back!
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Please sign in to your account.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>

            <Typography className="input-label">
              Email Address
            </Typography>

            <TextField
              fullWidth
              required
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                )
              }}
            />

            <Typography className="input-label">
              Password
            </Typography>

            <TextField
              fullWidth
              required
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      type="button"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              className="auth-button"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

          </Box>

          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ mt: 3 }}
          >
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </Typography>

        </Paper>

      </Box>

    </Box>
  );
}
