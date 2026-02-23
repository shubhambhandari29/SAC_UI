import {
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Paper,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  createFilterOptions,
} from "@mui/material";
import { MdClear } from "react-icons/md";
import { useEffect, useRef, useState, Fragment } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import api from "../../../../../api/api";
import Loader from "../../../../ui/Loader";

// Custom Paper for Autocomplete Dropdown
const CustomPaper = (props) => {
  return (
    <Paper
      {...props}
      sx={{
        marginTop: "5px",
        borderRadius: "15px",
        boxShadow: "0 1px 8px rgba(0, 0, 0, 0.25)",
        minWidth: "700px",
      }}
    />
  );
};

export default function ViewAssociatedAccounts({
  accountName,
  customerNum,
  disableforDirector,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchBy, setSearchBy] = useState("AccountName");
  const methods = useForm({ defaultValues: { associatedAccts: [] } });
  const { control, handleSubmit, reset } = methods;
  const { fields, append, replace, remove } = useFieldArray({
    control,
    name: "associatedAccts",
  });
  const gridRef = useRef();
  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");

  const dynamicSearchBy =
    searchBy === "AccountName"
      ? "Customer Name"
      : searchBy === "PolicyNameInsured"
        ? "Name Insured on Policy"
        : searchBy.replace(/([a-z])([A-Z])/g, "$1 $2").replace("Num", "Number");

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option) => option[dynamicSearchBy] ?? "",
    limit: 100,
  });

  const searchColumns =
    searchOptions.length > 0 && Object.keys(searchOptions[0]);

  useEffect(() => {
    if (!isEdit) return;

    const loadSearchOptions = async () => {
      setSearchLoading(true);
      try {
        const res = await api.get(`/search_sac_account/`, {
          params: { search_by: searchBy },
        });
        if (res.status === 200) setSearchOptions(res.data);
      } catch (err) {
        console.error("Search fetch error", err);
      } finally {
        setSearchLoading(false);
      }
    };

    loadSearchOptions();
  }, [searchBy, isEdit]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading("fetching");
      try {
        const res = await api.get(
          "/sac_account_associations?ParentAccount=" + customerNum,
        );

        let formattedData;

        if (res.status === 200 && res.data.length > 0) {
          formattedData = res.data.map((i) => ({
            CustomerNum: i.AssociatedAccount,
            CustomerName: i.AssociatedCustomerName,
            AcctStatus: i.AssociatedAcctStatus,
          }));
        }
        setOriginalData(formattedData);
        reset({ associatedAccts: formattedData });
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
      } finally {
        setLoading("");
      }
    };
    fetchData();
  }, [customerNum, reset]);

  const handleSelectAccount = (_, newValue) => {
    if (newValue) {
      const exists = fields.some(
        (field) => field.CustomerNum === newValue["Customer Number"],
      );

      if (exists) {
        Swal.fire({
          title: "Duplicate",
          text: "This account is already in the list.",
          icon: "warning",
          confirmButtonText: "OK",
          iconColor: theme.palette.warning.main,
          customClass: {
            confirmButton: "swal-confirm-button",
            cancelButton: "swal-cancel-button",
          },
          buttonsStyling: false,
        });
        return;
      }

      append({
        CustomerNum: newValue["Customer Number"] || "",
        CustomerName: newValue["Customer Name"] || "",
        AcctStatus: newValue["Account Status"] || "",
      });

      setInputValue("");

      setTimeout(() => {
        gridRef.current?.scrollToIndexes({ rowIndex: fields.length });
      }, 100);
    }
  };

  const onSubmit = async (data) => {
    // Compare new list vs original list
    // Strip out the internal 'id' React Hook Form adds before comparing
    const cleanList = data.associatedAccts.map(({ id, ...rest }) => rest);
    const cleanOriginal = originalData.map(({ id, ...rest }) => rest);

    const currentIds = cleanList.map((item) => item.CustomerNum);
    const originalIds = cleanOriginal.map((item) => item.CustomerNum);

    const toDelete = originalIds.filter((id) => !currentIds.includes(id));
    const toAdd = currentIds.filter((id) => !originalIds.includes(id));

    // If nothing changed, return early
    if (toDelete.length === 0 && toAdd.length === 0) {
      setIsEdit(false);
      return;
    }

    setLoading("submitting");

    try {
      const promises = [];

      if (toDelete.length > 0) {
        const deletePayload = {
          parent_account: customerNum,
          child_account: toDelete,
        };
        promises.push(
          api.post(`/sac_account_associations/delete`, deletePayload),
        );
      }

      if (toAdd.length > 0) {
        const addPayload = {
          parent_account: customerNum,
          child_account: toAdd,
        };
        promises.push(api.post(`/sac_account_associations/add`, addPayload));
      }

      await Promise.all(promises);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Some error occurred, unable to save",
        icon: "error",
        confirmButtonText: "OK",
        iconColor: theme.palette.warning.main,
        customClass: {
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
        buttonsStyling: false,
      });
    } finally {
      setLoading("");
    }

    setOriginalData(cleanList);
    reset({ associatedAccts: cleanList });
    setIsEdit(false);
  };

  const handleCancel = () => {
    setIsEdit(false);
    replace(originalData);
  };

  const columns = [
    {
      field: "CustomerNum",
      headerName: <b>Customer Number</b>,
      flex: 1,
    },
    {
      field: "CustomerName",
      headerName: <b>Customer Name</b>,
      flex: 2,
    },
    {
      field: "AcctStatus",
      headerName: <b>Account Status</b>,
      flex: 2,
    },
    {
      field: "actions",
      headerName: <b>Actions</b>,
      width: 80,
      sortable: false,
      filterable: false,
      hide: !isEdit,
      renderCell: (params) => {
        // Only show delete button if we are in edit mode
        if (!isEdit) return null;
        return (
          <IconButton
            onClick={() => remove(params.row.rhfIndex)}
            color="error"
            size="small"
          >
            <MdClear />
          </IconButton>
        );
      },
    },
  ];

  if (loading === "fetching") return <Loader size={40} height="435px" />;

  return (
    <FormProvider {...methods}>
      <form>
        <Grid container spacing={2} size={12} justifyContent="space-evenly">
          <Grid>
            <b>Account Name: </b>
            <Typography color="#003150" display="inline">
              {accountName}
            </Typography>
          </Grid>
          <Grid>
            <b>Cust #: </b>
            <Typography color="#003150" display="inline">
              {customerNum}
            </Typography>
          </Grid>
        </Grid>

        {isEdit && (
          <Grid
            container
            spacing={2}
            mt={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Search By</InputLabel>
                <Select
                  label="Search By"
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                >
                  <MenuItem value="AccountName">Account Name</MenuItem>
                  <MenuItem value="CustomerNum">Customer Number</MenuItem>
                  <MenuItem value="PolicyNum">Policy Number</MenuItem>
                  <MenuItem value="ProducerCode">Producer Code</MenuItem>
                  <MenuItem value="AffiliateName">Affiliate Name</MenuItem>
                  <MenuItem value="PolicyNameInsured">
                    Policy Name Insured
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Autocomplete
                filterOptions={filterOptions}
                options={searchOptions}
                loading={searchLoading}
                slots={{ paper: CustomPaper }}
                inputValue={inputValue}
                onInputChange={(_, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                onChange={handleSelectAccount}
                value={null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search to add an account..."
                    variant="outlined"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {searchLoading ? (
                            <Loader size={16} height="20px" />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                getOptionLabel={(option) => option[dynamicSearchBy] ?? ""}
                groupBy={() => "header"}
                renderGroup={(params) => (
                  <Fragment key={params.key}>
                    <Table size="small" sx={{ tableLayout: "fixed" }}>
                      <TableHead>
                        <TableRow>
                          {searchColumns &&
                            searchColumns.map((col) => (
                              <TableCell
                                key={col}
                                sx={{
                                  fontWeight: "bold",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {col}
                              </TableCell>
                            ))}
                        </TableRow>
                      </TableHead>
                    </Table>
                    {params.children}
                  </Fragment>
                )}
                renderOption={(props, option) => {
                  const { key, ...rest } = props;
                  return (
                    <Box
                      key={props["data-option-index"]}
                      {...rest}
                      sx={{ borderRadius: "25px", cursor: "pointer" }}
                    >
                      <Table size="small" sx={{ tableLayout: "fixed" }}>
                        <TableBody>
                          <TableRow>
                            {searchColumns &&
                              searchColumns.map((col) => (
                                <TableCell key={col}>
                                  {col === "Service Level"
                                    ? option[col]?.slice(2)
                                    : option[col]}{" "}
                                </TableCell>
                              ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  );
                }}
              />
            </Grid>
          </Grid>
        )}

        <div style={{ height: 350, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={fields.map((field, index) => ({
              ...field,
              id: field.id || index,
              rhfIndex: index,
            }))}
            columns={columns}
            columnVisibilityModel={{
              actions: isEdit,
            }}
            disableColumnMenu
            disableRowSelectionOnClick
            disableSelectionOnClick
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 25 } },
            }}
            pageSizeOptions={[25, 50]}
            apiRef={gridRef}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          {!isEdit && (
            <Button
              variant="outlined"
              onClick={() => setIsEdit(true)}
              sx={{ height: "45" }}
              disabled={disableforDirector}
            >
              Edit
            </Button>
          )}
          {isEdit && (
            <>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: 8 }}
                onClick={handleSubmit(onSubmit)}
                disabled={loading === "submitting"}
                sx={{ height: "45" }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                style={{ marginLeft: 8 }}
                onClick={handleCancel}
                disabled={loading === "submitting"}
                sx={{ height: "45" }}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
