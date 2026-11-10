
import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import api from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");

        const data = response.data;

        setProfile(data.user || data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box p={3}>
        <Alert severity="warning">Profile information not found.</Alert>
      </Box>
    );
  }

  const name =
    profile.fullName ||
    profile.name ||
    profile.username ||
    "Employee";

  const profileFields = [
    {
      label: "Full Name",
      value: name,
      icon: <PersonIcon color="primary" />,
    },
    {
      label: "Username",
      value: profile.username,
      icon: <BadgeIcon color="primary" />,
    },
    {
      label: "Email Address",
      value: profile.email,
      icon: <EmailIcon color="primary" />,
    },
    {
      label: "Role",
      value: profile.role,
      icon: <BadgeIcon color="primary" />,
    },
    {
      label: "Department",
      value: profile.department,
      icon: <BusinessIcon color="primary" />,
    },
    {
      label: "Phone Number",
      value: profile.phone || profile.phoneNumber,
      icon: <PersonIcon color="primary" />,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Profile
      </Typography>

      <Typography color="text.secondary" mb={3}>
        View your account information.
      </Typography>

      <Card
        sx={{
          maxWidth: 900,
          mx: "auto",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb={4}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "primary.main",
                fontSize: 40,
                mb: 2,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>

            <Typography variant="h5" fontWeight="bold">
              {name}
            </Typography>

            <Typography color="text.secondary">
              {profile.role || "User"}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" fontWeight="bold" mb={3}>
            Personal Information
          </Typography>

          <Grid container spacing={3}>
            {profileFields.map((field) => (
              <Grid size={{ xs: 12, sm: 6 }} key={field.label}>
                <Box display="flex" alignItems="center" gap={2}>
                  {field.icon}

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {field.label}
                    </Typography>

                    <Typography fontWeight="medium">
                      {field.value || "Not provided"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
