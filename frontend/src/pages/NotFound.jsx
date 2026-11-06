
import React from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
} from "@mui/material";

import { Home, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          p: 5,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h1"
          fontWeight="bold"
          color="primary"
          sx={{ fontSize: { xs: 80, md: 120 } }}
        >
          404
        </Typography>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Page Not Found
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Sorry! The page you are looking for does not exist.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>

          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate("/")}
          >
            Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
