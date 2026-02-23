import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api/api";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";
import Loader from "../ui/Loader";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";

export default function PendingItems() {
  const user = useSelector((state) => state.auth.user);
  const [wipItemsSac, setWipItemsSac] = useState([]);
  const [newItemsSac, setNewItemsSac] = useState([]);
  const [wipItemsAffinity, setWipItemsAffinity] = useState([]);
  const [newItemsAffinity, setNewItemsAffinity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingItemsFor, setPendingItemsFor] = useState("SAC");
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    setColumns([
      {
        field: pendingItemsFor === "SAC" ? "CustomerNum" : "ProgramName",
        headerName:
          pendingItemsFor === "SAC" ? "Customer Number" : "Program Name",
        flex: 1,
        minWidth: 120,
      },
      {
        field: pendingItemsFor === "SAC" ? "CustomerName" : "BusType",
        headerName:
          pendingItemsFor === "SAC" ? "Account Name" : "Business type",
        flex: 1,
        minWidth: 120,
      },
      {
        field: pendingItemsFor === "SAC" ? "DateCreated" : "DtCreated",
        headerName: "Created Date",
        flex: 1,
        minWidth: 100,
      },
    ]);
  }, [pendingItemsFor]);

  useEffect(() => {
    const fetchWipItems = async (url, branch) => {
      const params = {
        Stage: user.role,
        IsSubmitted: 0,
        [branch]: user.branch,
      };

      try {
        setLoading(true);
        const res = await api.get(url, { params });

        if (res.status === 200) {
          pendingItemsFor === "SAC"
            ? setWipItemsSac(res.data)
            : setWipItemsAffinity(res.data);
        } else {
          pendingItemsFor === "SAC"
            ? setWipItemsSac([])
            : setWipItemsAffinity([]);
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: "Some error occoured, unable to load data",
          icon: "error",
          confirmButtonText: "OK",
          iconColor: theme.palette.error.main,
          customClass: {
            confirmButton: "swal-confirm-button",
            cancelButton: "swal-cancel-button",
          },
          buttonsStyling: false,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchNewItems = async (url, branch) => {
      const params =
        user.role === "Director"
          ? {
              Stage: "Underwriter",
              IsSubmitted: 1,
              [branch]: user.branch,
            }
          : {
              Stage: "Director",
              IsSubmitted: 1,
              [branch]: user.branch,
            };

      try {
        setLoading(true);
        const res = await api.get(url, { params });

        if (res.status === 200) {
          pendingItemsFor === "SAC"
            ? setNewItemsSac(res.data)
            : setNewItemsAffinity(res.data);
        } else {
          pendingItemsFor === "SAC"
            ? setNewItemsSac([])
            : setNewItemsAffinity([]);
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: "Some error occoured, unable to load data",
          icon: "error",
          confirmButtonText: "OK",
          iconColor: theme.palette.error.main,
          customClass: {
            confirmButton: "swal-confirm-button",
            cancelButton: "swal-cancel-button",
          },
          buttonsStyling: false,
        });
      } finally {
        setLoading(false);
      }
    };

    if (pendingItemsFor === "SAC") {
      fetchWipItems("/sac_account/", "BranchName");
      if (user.role !== "Underwriter")
        fetchNewItems("/sac_account/", "BranchName");
    } else {
      fetchWipItems("/affinity_program/", "BranchVal");
      if (user.role !== "Underwriter")
        fetchNewItems("/affinity_program/", "BranchVal");
    }
  }, [user.role, user.branch, pendingItemsFor, theme.palette.error.main]);

  const headerStyle = {
    background:
      "linear-gradient(90deg, hsla(303, 77%, 22%, 1) 0%, hsla(321, 55%, 50%, 1) 100%)",
    color: "white",
    p: 1,
    pl: 2,
    borderRadius: "15px 15px 0px 0px",
    fontSize: "0.9rem",
    fontWeight: 600,
  };

  if (loading) return <Loader size={40} height="calc(100vh - 120px)" />;

  return (
    <Box
      sx={{
        height: "calc(100vh - 120px)",
        width: "calc(100vw - 320px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FormControl sx={{ width: 300, mb: 2 }}>
        <InputLabel>Show pending items for</InputLabel>
        <Select
          id="pendingItemsFor"
          label="Show pending items for"
          value={pendingItemsFor}
          onChange={(e) => setPendingItemsFor(e.target.value)}
        >
          <MenuItem value="SAC">SAC</MenuItem>
          <MenuItem value="Affinity">Affinity</MenuItem>
        </Select>
      </FormControl>

      {wipItemsSac.length === 0 && newItemsSac.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "calc(100vh - 120px)",
            pt: 5,
          }}
        >
          <Typography variant="h6">No Pending Items</Typography>
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {user?.role !== "Underwriter" && (
            <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ flexGrow: 1 }}>
              <Paper
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" sx={headerStyle}>
                  New Items to Review
                </Typography>
                <DataGrid
                  rows={
                    pendingItemsFor === "SAC" ? newItemsSac : newItemsAffinity
                  }
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  disableMultipleRowSelection
                  getRowId={(row) =>
                    pendingItemsFor === "SAC"
                      ? row.CustomerNum
                      : row.ProgramName
                  }
                  localeText={{
                    noRowsLabel: "No Pending Items",
                  }}
                  onRowClick={(params) => {
                    const url =
                      pendingItemsFor === "SAC"
                        ? `/sac-view-account/CustomerNum=${params.row.CustomerNum}`
                        : `/affinity-view-program/ProgramName=${params.row.ProgramName}`;
                    navigate(url, {
                      state: { from: "/pending-items" },
                      replace: true,
                    });
                  }}
                />
              </Paper>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ flexGrow: 1 }}>
            <Paper
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" sx={headerStyle}>
                Work in Progress Items
              </Typography>
              <DataGrid
                rows={
                  pendingItemsFor === "SAC" ? wipItemsSac : wipItemsAffinity
                }
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                disableMultipleRowSelection
                getRowId={(row) =>
                  pendingItemsFor === "SAC" ? row.CustomerNum : row.ProgramName
                }
                localeText={{
                  noRowsLabel: "No Pending Items",
                }}
                onRowClick={(params) => {
                  const url =
                    pendingItemsFor === "SAC"
                      ? `/sac-view-account/CustomerNum=${params.row.CustomerNum}`
                      : `/affinity-view-program/ProgramName=${params.row.ProgramName}`;
                  navigate(url, {
                    state: { from: "/pending-items" },
                    replace: true,
                  });
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
