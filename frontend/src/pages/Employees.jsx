import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add,
  Delete,
  Edit,
  Search,
  Refresh,
  People,
  Close,
} from "@mui/icons-material";

import employeeService from "../services/employeeService";

const emptyEmployee = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  salary: "",
  status: "ACTIVE",
};

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState(emptyEmployee);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const data = await employeeService.getAll();

      const employeeList = Array.isArray(data)
        ? data
        : data?.content || data?.employees || [];

      setEmployees(employeeList);
    } catch (error) {
      console.error("Error loading employees:", error);

      showNotification(
        "Unable to load employees. Check whether the backend is running.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return employees;

    return employees.filter((employee) => {
      const fullName = `${employee.firstName || ""} ${
        employee.lastName || ""
      }`.toLowerCase();

      return (
        fullName.includes(searchText) ||
        (employee.email || "").toLowerCase().includes(searchText) ||
        (employee.department || "").toLowerCase().includes(searchText) ||
        (employee.designation || "").toLowerCase().includes(searchText)
      );
    });
  }, [employees, search]);

  const openAddDialog = () => {
    setEditingEmployee(null);
    setFormData(emptyEmployee);
    setOpenDialog(true);
  };

  const openEditDialog = (employee) => {
    setEditingEmployee(employee);

    setFormData({
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      salary: employee.salary ?? "",
      status: employee.status || "ACTIVE",
    });

    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
    setFormData(emptyEmployee);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      showNotification(
        "First name, last name and email are required.",
        "warning"
      );
      return;
    }

    const employeeData = {
      ...formData,
      salary: formData.salary === "" ? null : Number(formData.salary),
    };

    try {
      if (editingEmployee) {
        await employeeService.update(
          editingEmployee.id,
          employeeData
        );

        showNotification("Employee updated successfully.");
      } else {
        await employeeService.create(employeeData);

        showNotification("Employee added successfully.");
      }

      closeDialog();
      await loadEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);

      showNotification(
        error.response?.data?.message || "Unable to save employee.",
        "error"
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await employeeService.delete(deleteTarget.id);

      showNotification("Employee deleted successfully.");
      setDeleteTarget(null);

      await loadEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);

      showNotification(
        error.response?.data?.message || "Unable to delete employee.",
        "error"
      );
    }
  };

  const getInitials = (employee) => {
    return `${employee.firstName?.[0] || ""}${
      employee.lastName?.[0] || ""
    }`.toUpperCase();
  };

  const getStatusColor = (status) => {
    switch ((status || "").toUpperCase()) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "default";
      case "ON_LEAVE":
        return "warning";
      default:
        return "info";
    }
  };

  return (
    <Box>
      {/* Page Heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Employees
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your organization's employee information.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadEmployees}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddDialog}
          >
            Add Employee
          </Button>
        </Stack>
      </Stack>

      {/* Employee Count */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
          <People />
        </Avatar>

        <Box>
          <Typography variant="h5" fontWeight={700}>
            {employees.length}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Total Employees
          </Typography>
        </Box>
      </Paper>

      {/* Search */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, email, department or designation..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Employee Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "grey.50" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Designation</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <CircularProgress />
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Loading employees...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <People
                    sx={{ fontSize: 42, color: "text.disabled", mb: 1 }}
                  />

                  <Typography fontWeight={600}>
                    No employees found
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Add an employee or change your search.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((employee) => (
                  <TableRow hover key={employee.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {getInitials(employee)}
                        </Avatar>

                        <Box>
                          <Typography fontWeight={600}>
                            {employee.firstName} {employee.lastName}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            ID: {employee.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>{employee.email}</TableCell>

                    <TableCell>
                      {employee.department || "-"}
                    </TableCell>

                    <TableCell>
                      {employee.designation || "-"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={employee.status || "ACTIVE"}
                        color={getStatusColor(employee.status)}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Edit employee">
                        <IconButton
                          color="primary"
                          onClick={() => openEditDialog(employee)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete employee">
                        <IconButton
                          color="error"
                          onClick={() => setDeleteTarget(employee)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredEmployees.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Add / Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </Typography>

            <IconButton onClick={closeDialog} size="small">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Stack>

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />

              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="ON_LEAVE">On Leave</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeDialog} color="inherit">
              Cancel
            </Button>

            <Button type="submit" variant="contained">
              {editingEmployee ? "Update Employee" : "Save Employee"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Delete Employee?</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {deleteTarget?.firstName} {deleteTarget?.lastName}
            </strong>
            ?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() =>
          setNotification((previous) => ({
            ...previous,
            open: false,
          }))
        }
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() =>
            setNotification((previous) => ({
              ...previous,
              open: false,
            }))
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Employees;