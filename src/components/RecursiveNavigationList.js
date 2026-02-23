import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  ListItemIcon,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RecursiveNavigationList({ nodes }) {
  const [openFolders, setOpenFolders] = useState({});
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const toggleFolder = (id) =>
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));

  const getPadding = (isRoot) => (isRoot ? 2 : 4);

  return (
    <List component="div" disablePadding>
      {nodes.map((node) => {
        if (!node.visibility.includes(user.role)) return null;

        const isSelected = location.pathname.includes(node.url);

        const buttonStyles = {
          pl: getPadding(node.isRoot),
          "&.Mui-selected": {
            color: "white",
            background:
              "linear-gradient(90deg, hsla(303, 77%, 22%, 1) 0%, hsla(321, 55%, 50%, 1) 100%)",
            "&:hover": {
              background:
                "linear-gradient(90deg, hsla(303, 77%, 22%, 1) 0%, hsla(321, 55%, 50%, 1) 100%)",
            },
          },
          "& .MuiListItemText-primary": {
            color: isSelected ? "#fff" : "inherit",
            fontWeight: isSelected ? "bold" : "normal",
          },
        };

        if (node.type === "folder") {
          const isOpen = node.openByDefault || openFolders[node.id];

          return (
            <React.Fragment key={node.id}>
              <ListItem
                disablePadding
                sx={{
                  color: "inherit",
                  "&:hover": { textDecoration: "none" },
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <ListItemButton
                  component={node.url ? Link : "div"}
                  to={node.url || undefined}
                  selected={isSelected}
                  onClick={(e) => {
                    toggleFolder(node.id);
                    if (!node.url) e.preventDefault();
                  }}
                  sx={buttonStyles}
                >
                  {node.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isSelected ? "white" : "inherit",
                      }}
                    >
                      {node.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={node.name}
                    slotProps={{
                      primary: {
                        sx: {
                          fontWeight: "bold !important",
                          fontSize: "0.875rem",
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <RecursiveNavigationList nodes={node.children || []} />
              </Collapse>
            </React.Fragment>
          );
        } else {
          return (
            <ListItem
              disablePadding
              key={node.id}
              sx={{
                color: "inherit",
                "&:hover": { textDecoration: "none" },
                borderBottom: "1px solid rgba(0,0,0,0.08)",
              }}
              component={Link}
              to={node.url}
            >
              <ListItemButton selected={isSelected} sx={buttonStyles}>
                {node.icon && (
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isSelected ? "white" : "inherit",
                    }}
                  >
                    {node.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={node.name}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "0.875rem",
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        }
      })}
    </List>
  );
}
