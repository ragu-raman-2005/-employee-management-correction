
import { useEffect, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  People,
  Business,
  PersonAdd,
  TrendingUp,
  ArrowForward,
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useNavigate } from "react-router-dom";
import api from "../services/api";

const monthlyData = [
  { month: "Jan", employees: 12 },
  { month: "Feb", employees: 18 },
  { month: "Mar", employees: 15 },
  { month: "Apr", employees: 25 },
  { month: "May", employees: 30 },
  { month: "Jun", employees: 35 },
];

const departmentData = [
  { name: "IT", value: 40 },
  { name: "HR", value: 20 },
  { name: "Finance", value: 15 },
  { name: "Marketing", value: 25 },
];

const chartColors = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#9c27b0",
];

function Dashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [employeeResponse, departmentResponse] =
          await Promise.all([
            api.get("/employees"),
            api.get("/departments"),
          ]);

        const employeeData = employeeResponse.data;
        const departmentData = departmentResponse.data;

        setEmployees(
          Array.isArray(employeeData)
            ? employeeData
            : employeeData?.content || employeeData?.employees || []
        );

        setDepartments(
          Array.isArray(departmentData)
            ? departmentData
            : departmentData?.content ||
                departmentData?.departments ||
                []
        );
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError(
          "Backend is not connected. Showing sample dashboard information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const activeEmployees = employees.filter(
    (employee) =>
      (employee.status || "ACTIVE").toUpperCase() === "ACTIVE"
  ).length;

  const stats = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: <People />,
      color: "#1976d2",
      background: "#e3f2fd",
    },
    {
      title: "Departments",
      value: departments.length,
      icon: <Business />,
      color: "#2e7d32",
      background: "#e8f5e9",
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: <TrendingUp />,
      color: "#ed6c02",
      background: "#fff3e0",
    },
    {
      title: "New Employees",
      value: employees.filter((employee) => {
        if (!employee.createdAt) return false;

        const createdDate = new Date(employee.createdAt);
        const currentDate = new Date();

        return (
          createdDate.getMonth() === currentDate.getMonth() &&
          createdDate.getFullYear() === currentDate.getFullYear()
        );
      }).length,
      icon: <PersonAdd />,
      color: "#9c27b0",
      background: "#f3e5f5",
    },
  ];

  return (
    <Box>
      {/* Dashboard Heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Dashboard
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Welcome to Employee Management System.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => navigate("/employees")}
        >
          Manage Employees
        </Button>
      </Stack>

      {/* Backend connection notice */}
      {error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {stats.map((stat) => (
          <Card
            key={stat.title}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    {stat.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mt: 1 }}
                  >
                    {loading ? (
                      <CircularProgress size={25} />
                    ) : (
                      stat.value
                    )}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: stat.background,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 3,
          mb: 3,
        }}
      >
        {/* Employee Growth Chart */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={700}>
              Employee Growth
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Monthly employee statistics (sample data)
            </Typography>

            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="employees"
                    fill="#1976d2"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Department Chart */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={700}>
              Department Overview
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Sample department distribution
            </Typography>

            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={90}
                    label
                  >
                    {departmentData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={chartColors[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Employees */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Recent Employees
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Latest employees in your organization
              </Typography>
            </Box>

            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate("/employees")}
            >
              View All
            </Button>
          </Stack>

          {loading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : employees.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <People
                sx={{ fontSize: 45, color: "text.disabled" }}
              />

              <Typography fontWeight={600}>
                No employees available
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Add employees to see them here.
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate("/employees")}
              >
                Add Employee
              </Button>
            </Box>
          ) : (
            <Stack spacing={2}>
              {employees.slice(0, 5).map((employee) => (
                <Stack
                  key={employee.id}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    py: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {employee.firstName?.[0]?.toUpperCase() || "E"}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={600}>
                      {employee.firstName} {employee.lastName}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                    >
                      {employee.email}
                    </Typography>
                  </Box>

                  <Chip
                    size="small"
                    label={employee.status || "ACTIVE"}
                    color={
                      (employee.status || "ACTIVE").toUpperCase() ===
                      "ACTIVE"
                        ? "success"
                        : "default"
                    }
                  />
                </Stack>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;
