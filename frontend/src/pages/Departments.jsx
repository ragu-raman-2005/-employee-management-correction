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
  Business,
  Close,
  Delete,
  Edit,
  Refresh,
  Search,
  Groups,
} from "@mui/icons-material";

import departmentService from "../services/departmentService";

const emptyDepartment = {
  name: "",
  description: "",
};

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState(emptyDepartment);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Load departments from backend
  const loadDepartments = async () => {
    try {
      setLoading(true);

      const data = await departmentService.getAll();

      const departmentList = Array.isArray(data)
        ? data
        : data?.content || data?.departments || [];

      setDepartments(departmentList);
    } catch (error) {
      console.error("Error loading departments:", error);

      showNotification(
        "Unable to load departments. Check whether the backend is running.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Search departments
  const filteredDepartments = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return departments;
    }

    return departments.filter((department) => {
      return (
        (department.name || department.departmentName || "")
          .toLowerCase()
          .includes(searchText) ||
        (department.description || "")
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [departments, search]);

  // Open add dialog
  const handleAdd = () => {
    setEditingDepartment(null);
    setFormData(emptyDepartment);
    setOpenDialog(true);
  };

  // Open edit dialog
  const handleEdit = (department) => {
    setEditingDepartment(department);

    setFormData({
      name: department.name || department.departmentName || "",
      description: department.description || "",
    });

    setOpenDialog(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpenDialog(false);
    setEditingDepartment(null);
    setFormData(emptyDepartment);
  };

  // Handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add or update department
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      showNotification("Department name is required.", "warning");
      return;
    }

    try {
      if (editingDepartment) {
        await departmentService.update(
          editingDepartment.id,
          formData
        );

        showNotification("Department updated successfully.");
      } else {
        await departmentService.create(formData);

        showNotification("Department added successfully.");
      }

      handleClose();
      await loadDepartments();
    } catch (error) {
      console.error("Error saving department:", error);

      showNotification(
        error.response?.data?.message ||
          "Unable to save department.",
        "error"
      );
    }
  };

  // Delete department
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await departmentService.delete(deleteTarget.id);

      showNotification("Department deleted successfully.");
      setDeleteTarget(null);

      await loadDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);

      showNotification(
        error.response?.data?.message ||
          "Unable to delete department.",
        "error"
      );
    }
  };

  const getDepartmentName = (department) => {
    return department.name || department.departmentName || "Unnamed";
  };

  const getEmployeeCount = (department) => {
    return (
      department.employeeCount ??
      department.totalEmployees ??
      department.employees?.length ??
      0
    );
  };

  return (
    <Box>
      {/* Page heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Departments
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Organize and manage company departments.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadDepartments}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            Add Department
          </Button>
        </Stack>
      </Stack>

      {/* Department summary */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "primary.light",
                color: "primary.main",
              }}
            >
              <Business />
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight={700}>
                {departments.length}
              </Typography>

              <Typography color="text.secondary" variant="body2">
                Total Departments
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "success.light",
                color: "success.dark",
              }}
            >
              <Groups />
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight={700}>
                {departments.reduce(
                  (total, department) =>
                    total + Number(getEmployeeCount(department)),
                  0
                )}
              </Typography>

              <Typography color="text.secondary" variant="body2">
                Employees in Departments
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

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
          placeholder="Search departments..."
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

      {/* Departments table */}
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
              <TableCell sx={{ fontWeight: 700 }}>
                Department
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Description
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Employees
              </TableCell>

              <TableCell
                align="center"
                sx={{ fontWeight: 700 }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <CircularProgress />

                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Loading departments...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredDepartments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <Business
                    sx={{
                      fontSize: 42,
                      color: "text.disabled",
                      mb: 1,
                    }}
                  />

                  <Typography fontWeight={600}>
                    No departments found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Add a department or change your search.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredDepartments
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((department) => (
                  <TableRow hover key={department.id}>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.light",
                            color: "primary.main",
                          }}
                        >
                          <Business />
                        </Avatar>

                        <Typography fontWeight={600}>
                          {getDepartmentName(department)}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {department.description || "-"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={<Groups />}
                        label={getEmployeeCount(department)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Edit department">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(department)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete department">
                        <IconButton
                          color="error"
                          onClick={() => setDeleteTarget(department)}
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
          count={filteredDepartments.length}
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

      {/* Add / Edit dialog */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={700}>
              {editingDepartment
                ? "Edit Department"
                : "Add New Department"}
            </Typography>

            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Department Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Example: Human Resources"
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Enter department description"
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>

            <Button type="submit" variant="contained">
              {editingDepartment ? "Update Department" : "Save Department"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Delete Department?</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {deleteTarget ? getDepartmentName(deleteTarget) : ""}
            </strong>
            ?
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Make sure this department is not assigned to employees.
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

      {/* Notifications */}
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

export default Departments;