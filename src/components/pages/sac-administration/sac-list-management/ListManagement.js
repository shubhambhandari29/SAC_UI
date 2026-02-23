import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  FormControl,
  Grid,
  Autocomplete,
  TextField,
  Paper,
  Button,
  Box,
  CircularProgress,
  useTheme,
  Tooltip,
  IconButton,
} from "@mui/material";
import { DataGrid, GridRowModes } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import api from "../../../../api/api";
import Loader from "../../../ui/Loader";
import { MdClear } from "react-icons/md";

// List of available dropdowns
const listOptions = [
  { name: "Accomodation Type", value: "AccomType" },
  { name: "Branch List", value: "BranchName" },
  // { name: "Business Policy Type", value: "BusinessType" },
  { name: "Business Type", value: "BusinessType" },
  { name: "Did Not Renew Status", value: "DNRStatus" },
  { name: "Distribute Reports Via", value: "DistVia" },
  { name: "Distribution Frequency", value: "DistFrequency" },
  { name: "Exception Types", value: "ExceptType" },
  { name: "General Policy Status", value: "GenPolicyStatus" },
  { name: "HCM Access", value: "HCMAccess" },
  // { name: "Loss Control Representatives", value: "HCMAccess" },
  // { name: "Loss Run Types", value: "HCMAccess" },
  { name: "Policy Status", value: "PolicyStatus" },
  { name: "Policy Type", value: "PolicyType" },
  // { name: "Product Code", value: "PolicyType" },
  { name: "Report Recipient Category", value: "RecipCat" },
  { name: "SAC Users List", value: "SAC_Contact1" },
  { name: "Service Level", value: "ServLevel" },
  { name: "Underwriters", value: "Underwriters" },
];

const hiddenKeys = [
  "PK_Number",
  "DD_Key",
  "BranchNmb",
  "id",
  "_isNew",
  "actions",
];
const optionalKeys = ["DD_SortOrder"];
const numericFields = ["DD_SortOrder", "Dollar Threshold"];

export default function ListManagement() {
  const [selectedList, setSelectedList] = useState(null);
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);
  const [modifiedIds, setModifiedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [columnKeys, setColumnKeys] = useState([]);
  const rowsRef = useRef(rows);
  const modifiedIdsRef = useRef(modifiedIds);
  const theme = useTheme();

  // Keep the ref in sync with the state
  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);
  useEffect(() => {
    modifiedIdsRef.current = modifiedIds;
  }, [modifiedIds]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = `/dropdowns/${selectedList.value}`;
      const res = await api.get(endpoint);
      const data = res.data || [];

      if (data.length > 0) {
        setColumnKeys(Object.keys(data[0]));
      }

      const formattedRows = data.map((row, index) => ({
        ...row,
        id: row.id || row.ID || index, // ID required for DataGrid
        _isNew: false,
      }));

      setRows(formattedRows);
      setOriginalRows(JSON.parse(JSON.stringify(formattedRows)));

      setDeletedIds([]);
      setModifiedIds(new Set());
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Unable to load list data", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedList?.value]);

  const handleDelete = useCallback(
    (id) => (event) => {
      if (event) event.stopPropagation();

      setRowModesModel((prevModel) => {
        const newModel = { ...prevModel };
        delete newModel[id];
        return newModel;
      });

      setModifiedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      const rowToDelete = rows.find((r) => r.id === id);
      if (rowToDelete && !rowToDelete._isNew) {
        setDeletedIds((prev) => [...prev, id]);
      }

      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    },
    [rows],
  );

  useEffect(() => {
    if (!selectedList?.value) {
      setRows([]);
      setOriginalRows([]);
      setColumnKeys([]);
      setIsEdit(false);
      return;
    }
    fetchData();
  }, [selectedList, fetchData]);

  const dynamicColumns = useMemo(() => {
    if (columnKeys.length === 0) return [];

    const cols = columnKeys
      .filter((key) => !hiddenKeys.includes(key))
      .map((key) => {
        const isMandatory = !optionalKeys.includes(key);

        return {
          field: key,
          flex: 1,
          editable: true,
          headerAlign: "left",
          align: "left",
          renderHeader: () => (
            <Box
              sx={{
                display: "flex",
                alignItems: "left",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              <b>{key}</b>
              {isMandatory && <sup style={{ color: "red" }}> *</sup>}
            </Box>
          ),
          type: numericFields.includes(key) ? "number" : "string",
        };
      });

    cols.push({
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <DeleteButton isEdit={isEdit} id={params.id} onDelete={handleDelete} />
      ),
    });

    return cols;
  }, [columnKeys, isEdit, handleDelete]);

  const handleRowClick = (params) => {
    if (!isEdit) return;
    setRowModesModel((prev) => ({
      ...prev,
      [params.id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleAddRow = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const emptyRow = { id, _isNew: true };

    dynamicColumns.forEach((col) => {
      if (col.field !== "actions" && col.field !== "id") {
        emptyRow[col.field] = "";
      }
    });

    setRows((oldRows) => [emptyRow, ...oldRows]);

    // Auto-focus the new row
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: {
        mode: GridRowModes.Edit,
        fieldToFocus: dynamicColumns[0]?.field,
      },
    }));
  };

  const processRowUpdate = (newRow, oldRow) => {
    for (const key of numericFields) {
      if (newRow[key] && isNaN(Number(newRow[key]))) {
        Swal.fire({
          title: "Data Validation Error",
          text: `${key} must be a number`,
          icon: "error",
          confirmButtonText: "OK",
          iconColor: theme.palette.error.main,
          customClass: {
            confirmButton: "swal-confirm-button",
            cancelButton: "swal-cancel-button",
          },
          buttonsStyling: false,
        });
        return oldRow;
      }
    }

    const isChanged = JSON.stringify(newRow) !== JSON.stringify(oldRow);
    if (isChanged && !newRow._isNew) {
      setModifiedIds((prev) => {
        const next = new Set(prev);
        next.add(newRow.id);
        return next;
      });
    }

    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? newRow : row)),
    );
    return newRow;
  };

  const handleCancel = () => {
    setIsEdit(false);
    setRowModesModel({});
    setDeletedIds([]);
    setModifiedIds(new Set());
    setRows(JSON.parse(JSON.stringify(originalRows)));
  };

  const handleSave = async () => {
    setRowModesModel({});

    setTimeout(async () => {
      const currentRows = rowsRef.current;
      const currentModifiedIds = modifiedIdsRef.current;
      const apiCalls = [];

      for (const row of currentRows) {
        for (const key of Object.keys(row)) {
          const value = row[key];
          const isVisible = !hiddenKeys.includes(key);
          const isMandatory = !optionalKeys.includes(key);

          // Check Mandatory Fields
          if (
            isVisible &&
            isMandatory &&
            (value === null ||
              value === undefined ||
              String(value).trim() === "")
          ) {
            Swal.fire({
              title: "Data Validation Error",
              text: "Please fill in all the mandatory fields",
              icon: "error",
              confirmButtonText: "OK",
              iconColor: theme.palette.error.main,
              customClass: {
                confirmButton: "swal-confirm-button",
                cancelButton: "swal-cancel-button",
              },
              buttonsStyling: false,
            });
            return;
          }

          // Check Non-Negative Numbers
          if (numericFields.includes(key) && value !== "" && value !== null) {
            if (Number(value) <= 0) {
              Swal.fire({
                title: "Data Validation Error",
                text: `${key} must be a positive number`,
                icon: "error",
                confirmButtonText: "OK",
                iconColor: theme.palette.error.main,
                customClass: {
                  confirmButton: "swal-confirm-button",
                  cancelButton: "swal-cancel-button",
                },
                buttonsStyling: false,
              });
              return;
            }
          }
        }
      }

      try {
        setSaving(true);
        if (deletedIds.length > 0) {
          const deletedRows = [];
          originalRows.forEach((r) => {
            if (deletedIds.includes(r.id)) {
              const { id, _isNew, ...row } = r;
              deletedRows.push(row);
            }
          });

          apiCalls.push(
            api.post(`/dropdowns/${selectedList.value}/delete`, deletedRows),
          );
        }

        const rowsToUpsert = currentRows.filter(
          (row) => row._isNew === true || currentModifiedIds.has(row.id),
        );

        const payload = rowsToUpsert.map((row) => {
          const { id, _isNew, ...rest } = row;
          if (rest.DD_SortOrder === "") rest.DD_SortOrder = null;
          return rest;
        });

        if (payload.length > 0) {
          apiCalls.push(
            api.post(`/dropdowns/${selectedList.value}/upsert`, payload),
          );
        }

        const responses = await Promise.all(apiCalls);
        const allSuccessful = responses.every((res) => res.status === 200);

        setSaving(false);

        if (!allSuccessful)
          throw new Error("Some error occoured, unable to save the data");

        await Swal.fire({
          title: "Changes Saved",
          text: "Your changes have been saved",
          icon: "success",
          confirmButtonText: "OK",
          iconColor: theme.palette.success.main,
          customClass: {
            confirmButton: "swal-confirm-button",
            cancelButton: "swal-cancel-button",
          },
          buttonsStyling: false,
        });

        setIsEdit(false);
        setRowModesModel({});
        fetchData();
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "Some error occoured, unable to save data",
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
        setSaving(false);
      }
    }, 10);
  };

  return (
    <Grid container spacing={2} mt={2}>
      <Grid size={{ xs: 12 }} sx={{ display: "grid", placeItems: "center" }}>
        <FormControl sx={{ minWidth: 300 }}>
          <Autocomplete
            options={listOptions}
            getOptionLabel={(option) => option.name}
            onChange={(_, newValue) => setSelectedList(newValue)}
            disabled={isEdit}
            renderInput={(params) => (
              <TextField {...params} label="Select List to Update" />
            )}
          />
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12 }}>
        {selectedList?.value && (
          <Paper sx={{ width: "100%", p: 2, mt: 2 }} id="datagrid-container">
            {loading ? (
              <Loader size={40} height="550px" />
            ) : (
              <>
                <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
                  <DataGrid
                    rows={rows}
                    columns={dynamicColumns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={setRowModesModel}
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={(err) => console.log(err)}
                    onRowClick={handleRowClick}
                    isCellEditable={() => isEdit}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 100 } },
                    }}
                    // pageSizeOptions={[10, 25, 50]}
                  />
                </div>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {!isEdit ? (
                    <Button variant="outlined" onClick={() => setIsEdit(true)}>
                      Edit
                    </Button>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleAddRow}
                        sx={{ mr: "auto" }}
                        disabled={saving}
                      >
                        Add Row
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? (
                          <CircularProgress size={15} color="inherit" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}

const DeleteButton = ({ isEdit, id, onDelete }) => {
  if (!isEdit) return null;

  return (
    <Tooltip title="Delete Row">
      <IconButton onClick={(e) => onDelete(id)(e)} color="error" size="small">
        <MdClear />
      </IconButton>
    </Tooltip>
  );
};
