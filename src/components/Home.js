import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { GrMenu } from "react-icons/gr";
import { IoLogOut } from "react-icons/io5";
import RecursiveNavigationList from "./RecursiveNavigationList";
import navigationTree from "../navigation-tree";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../redux/authSlice";

const drawerWidth = 260;

const cctHeaderMapping = {
  "view-cct-accounts-sac": "Account Details",
  "cct-view-policy": "Special Account Policy",
  "view-cct-accounts-affinity": "Affinity Program",
  "cct-view-policy-types": "Affinity Account Instructions",
};

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.auth.user);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar
        sx={{ backgroundColor: "primary.main", justifyContent: "center" }}
      >
        <img
          src="/hanover-logo-2.svg"
          alt="hanover-logo"
          style={{ width: "120px", maxWidth: "100%" }}
        />
      </Toolbar>
      <Divider />

      {/* Scrollable List Area */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>
          <RecursiveNavigationList nodes={navigationTree} />
        </List>
      </Box>

      {/* Bottom Fixed Area */}
      <Box>
        <Divider />
        <ListItem
          disablePadding
          onClick={async () => {
            const res = await dispatch(logoutThunk());
            if (res.meta.requestStatus === "fulfilled") {
              navigate("/login", { replace: true });
            }
          }}
        >
          <ListItemButton sx={{ mt: 1, mb: 1 }}>
            <ListItemIcon>
              <IoLogOut size={24} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                variant: "subtitle2",
                fontWeight: "bold",
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <GrMenu />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: "white" }}
            >
              {[
                "view-cct-accounts-sac",
                "cct-view-policy",
                "view-cct-accounts-affinity",
                "cct-view-policy-types",
              ].includes(pathname.split("/")[1])
                ? cctHeaderMapping[pathname.split("/")[1]]
                : pathname
                    .split("/")[1]
                    .split("-")
                    .map((word) => {
                      if (["sac", "cct"].includes(word.toLowerCase()))
                        return word.toUpperCase();
                      return word.charAt(0).toUpperCase() + word.slice(1);
                    })
                    .join(" ")}
            </Typography>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ color: "white" }}
          >
            Logged in as: {user.role}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1.5,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" disableGutters>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
