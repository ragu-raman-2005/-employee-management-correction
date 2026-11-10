import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import onboardingService from "../services/onboardingService";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  joiningDate: "",
  salary: "",
  address: "",
  status: "PENDING",
};

function EmployeeOnboarding() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load onboarding records
  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await onboardingService.getAll();
      setEmployees(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load onboarding records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add or update employee
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      const employeeData = {
        ...form,
        salary: Number(form.salary),
      };

      if (editingId) {
        await onboardingService.update(editingId, employeeData);
        setMessage("Employee onboarding details updated successfully.");
      } else {
        await onboardingService.create(employeeData);
        setMessage("New employee registered successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save employee details."
      );
    }
  };

  // Edit employee
  const handleEdit = (employee) => {
    setEditingId(employee.id);

    setForm({
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      joiningDate: employee.joiningDate || "",
      salary: employee.salary ?? "",
      address: employee.address || "",
      status: employee.status || "PENDING",
    });

    setMessage("");
    setError("");
  };

  // Delete employee
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this onboarding record?"
    );

    if (!confirmed) return;

    try {
      await onboardingService.delete(id);
      setMessage("Employee onboarding record deleted.");
      await loadEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete employee."
      );
    }
  };

  // Update onboarding status
  const handleStatusChange = async (id, status) => {
    try {
      await onboardingService.updateStatus(id, status);
      setMessage("Onboarding status updated.");
      await loadEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update status."
      );
    }
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Employee Onboarding
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Register and manage newly joining employees.
      </Typography>

      {message && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          {editingId ? "Edit Employee Details" : "Register New Employee"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            flexWrap="wrap"
            gap={2}
          >
            <TextField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              sx={{ flex: "1 1 220px" }}
            />

            <TextField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              sx={{ flex: "1 1 220px" }}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              sx={{ flex: "1 1 220px" }}
            />

            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              sx={{ flex: "1 1 220px" }}
            />

            <TextField
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              sx={{ flex: "1 1 220px" }}
            />

            <TextField
              label="Designation"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              required
              sx={{ flex: "1 1 220px" }}
            />

            <TextField
              label="Joining Date"
              name="joiningDate"
              type="date"
              value={form.joiningDate}
              onChange={handleChange}
              required
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ flex: "1 1 220px" }}
            />

            <TextField
              label="Salary"
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              required
              inputProps={{ min: 0 }}
              sx={{ flex: "1 1 220px" }}
            />

            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              multiline
              minRows={2}
              sx={{ flex: "1 1 100%" }}
            />

            <TextField
              select
              label="Onboarding Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              sx={{ flex: "1 1 220px" }}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </TextField>
          </Stack>

          <Stack direction="row" spacing={2} mt={3}>
            <Button type="submit" variant="contained">
              {editingId ? "Update Employee" : "Register Employee"}
            </Button>

            {editingId && (
              <Button variant="outlined" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>

      <Typography variant="h6" mb={2}>
        New Joiners List
      </Typography>

      {loading ? (
        <Typography>Loading employees...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Joining Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No onboarding records found.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      {employee.firstName} {employee.lastName}
                    </TableCell>

                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.joiningDate}</TableCell>

                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={employee.status || "PENDING"}
                        onChange={(event) =>
                          handleStatusChange(
                            employee.id,
                            event.target.value
                          )
                        }
                        sx={{ minWidth: 140 }}
                      >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="IN_PROGRESS">
                          In Progress
                        </MenuItem>
                        <MenuItem value="COMPLETED">Completed</MenuItem>
                      </TextField>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          onClick={() => handleEdit(employee)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default EmployeeOnboarding;