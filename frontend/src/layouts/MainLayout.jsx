
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Divider
} from "@mui/material";

import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Apartment,
  Person,
  Logout,
  GroupsRounded,
  NotificationsNone,
  PersonAdd
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";

import "./MainLayout.css";

const drawerWidth = 260;

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: <Dashboard />
  },
  {
    title: "Employees",
    path: "/employees",
    icon: <People />
  },
  {
    title: "Employee Onboarding",
    path: "/onboarding",
    icon: <PersonAdd />
  },
  {
    title: "Departments",
    path: "/departments",
    icon: <Apartment />
  },
  {
    title: "My Profile",
    path: "/profile",
    icon: <Person />
  }
];

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  const drawerContent = (
    <Box className="sidebar-content">

      {/* Sidebar Brand */}

      <Box className="sidebar-brand">
        <GroupsRounded sx={{ fontSize: 38 }} />

        <Box>
          <Typography variant="h6" fontWeight="bold">
            EMS
          </Typography>

          <Typography variant="caption">
            Employee Management
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: "#334155" }} />

      <Typography className="sidebar-label">
        MAIN MENU
      </Typography>

      {/* Sidebar Menu Items */}

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === "/"}
            onClick={() => setMobileOpen(false)}
            className="sidebar-link"
          >
            <ListItemIcon className="sidebar-icon">
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>

      {/* Sidebar Footer */}

      <Box className="sidebar-footer">
        <Typography variant="caption">
          Employee Management System
        </Typography>

        <Typography variant="caption">
          Version 1.0.0
        </Typography>
      </Box>

    </Box>
  );

  return (
    <Box className="main-layout">

      {/* Desktop Sidebar */}

      <Drawer
        variant="permanent"
        className="desktop-drawer"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box"
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Sidebar */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        className="mobile-drawer"
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box"
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}

      <Box className="main-content">

        {/* Header */}

        <AppBar
          position="sticky"
          elevation={0}
          className="top-header"
        >
          <Toolbar className="header-toolbar">

            <IconButton
              className="mobile-menu-button"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>

            <Box className="header-title">
              <Typography variant="h6" fontWeight="bold">
                Employee Management
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Manage your organization
              </Typography>
            </Box>

            <Box className="header-actions">

              <IconButton>
                <NotificationsNone />
              </IconButton>

              {/* User Profile */}

              <Box
                className="profile-button"
                onClick={handleMenuOpen}
              >
                <Avatar className="header-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>

                <Box className="profile-info">
                  <Typography variant="body2" fontWeight="bold">
                    {user?.name || "User"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {user?.role || "EMPLOYEE"}
                  </Typography>
                </Box>
              </Box>

              {/* Profile Menu */}

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/profile");
                  }}
                >
                  <Person sx={{ mr: 1 }} />
                  My Profile
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>

            </Box>

          </Toolbar>
        </AppBar>

        {/* Page Content */}

        <Box className="page-content">
          <Outlet />
        </Box>

      </Box>

    </Box>
  );
}
