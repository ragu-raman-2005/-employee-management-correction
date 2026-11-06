
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  CssBaseline,
  ThemeProvider,
  createTheme
} from "@mui/material";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb"
    },
    background: {
      default: "#f5f7fb"
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: "Arial, sans-serif"
  }
});

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
