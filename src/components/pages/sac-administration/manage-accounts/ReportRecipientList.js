import { useState, useEffect } from "react";
import {
  useForm,
  FormProvider,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  TextField,
  Typography,
  MenuItem,
  useTheme,
  Select,
  IconButton,
  Tooltip,
} from "@mui/material";
import api from "../../../../api/api";
import Loader from "../../../ui/Loader";
import Swal from "sweetalert2";
import useDropdownData from "../../../../hooks/useDropdownData";
import EmailField from "../../../ui/EmailField";
import { MdClear } from "react-icons/md";
import { useSelector } from "react-redux";

export default function ReportRecipientList({ url, parameter, getValuesSac }) {
  const [isEdit, setIsEdit] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const methods = useForm({ defaultValues: { recipients: [] } });
  const [loading, setLoading] = useState("");
  const { control, handleSubmit, reset } = methods;
  const { fields, append, replace, remove } = useFieldArray({
    control,
    name: "recipients",
  });
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const { data: ddData, loading: ddLoading } =
    useDropdownData("/dropdowns/all");
  const [triggerReload, setTriggerReload] = useState(false);
  // const canComposeEmail =
  //   url === "/loss_run_distribution/" ||
  //   url === "/loss_run_distribution_affinity/";

  useEffect(() => {
    const fetchData = async () => {
      setLoading("fetching");
      try {
        const res = await api.get(url, {
          params: parameter,
        });
        setOriginalData(res.data);
        reset({ recipients: res.data });
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
        setLoading("");
      }
    };
    fetchData();
  }, [reset, url, parameter, theme.palette.error.main, triggerReload]);

  const onSubmit = async (data) => {
    // Check if data is same as original
    const isSame =
      JSON.stringify(data.recipients) === JSON.stringify(originalData);

    if (isSame) {
      reset({ recipients: data.recipients });
      setIsEdit(false);
      return;
    }

    try {
      setLoading("submitting");
      // 1. Identify Deleted Items (Present in originalData but missing in current data)
      // Note: This logic assumes rows have unique IDs. If not, match by Email.
      const currentIds = new Set(
        data.recipients.map(
          (r) =>
            r.PK_Number ||
            Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000,
        ),
      );

      const remainingItemsActual = data.recipients.filter((i) => i.PK_Number);
      const deletedItems = [];
      const remainingItemsOrg = [];

      originalData.forEach((orig) => {
        currentIds.has(orig.PK_Number)
          ? remainingItemsOrg.push(orig)
          : deletedItems.push(orig);
      });

      if (deletedItems.length > 0) {
        await api.post(`${url}delete`, deletedItems);

        const isSame =
          JSON.stringify(remainingItemsActual) ===
          JSON.stringify(remainingItemsOrg);

        if (remainingItemsActual.length > 0 && !isSame) {
          await api.post(`${url}upsert`, remainingItemsActual);
        }
      } else {
        if (data.recipients.length > 0 && !isSame) {
          await api.post(`${url}upsert`, data.recipients);
        }
      }

      setOriginalData(
        deletedItems.length > 0 ? remainingItemsActual : data.recipients,
      );
      reset({
        recipients:
          deletedItems.length > 0 ? remainingItemsActual : data.recipients,
      });
      setIsEdit(false);
    } catch (err) {
      console.error(err);
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
      setLoading("");
      setTriggerReload((prev) => !prev);
    }
  };

  const onError = (errors) => {
    const errVals = Object.values(errors.recipients.find((i) => i));

    if (errVals.length > 0) {
      Swal.fire({
        title: "Data Validation Error",
        text:
          errVals[0].message === "true"
            ? "You've left blank a mandatory field. Please check your entries"
            : errVals[0].message,
        icon: "error",
        confirmButtonText: "OK",
        iconColor: theme.palette.error.main,
        customClass: {
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
        buttonsStyling: false,
      });
    }
  };

  const handleAdd = () => {
    append({
      [Object.keys(parameter)[0]]: Object.values(parameter)[0],
      RecipCat: "",
      DistVia: "",
      AttnTo: "",
      EMailAddress: "",
    });
  };

  const handleCancel = () => {
    setIsEdit(false);
    replace(originalData);
  };

  const handleComposeEmail = async () => {
    const win = window.open(
      "",
      "_blank",
      "width=800,height=600,scrollbars=yes,resizable=yes",
    );

    if (!win) {
      Swal.fire({
        title: "Pop-up blocked",
        text: "Please allow pop-ups for this site and try again.",
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

    try {
      setLoading("composing");
      const composeEndpoint = "/outlook/compose_link";
      const recipients = (methods.getValues("recipients") || [])
        .map((row) => row?.EMailAddress)
        .filter(Boolean);

      const res = await api.post(composeEndpoint, { recipients });
      const composeUrl = res?.data?.url;
      if (!composeUrl) throw new Error("Compose URL not returned");
      win.location.href = composeUrl;
    } catch (err) {
      if (win) win.close();
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Unable to open Outlook compose window",
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
      setLoading("");
    }
  };

  let columns = [
    {
      field: Object.keys(parameter)[0],
      headerName: (
        <b>
          {Object.keys(parameter)[0].replace(/([a-z])([A-Z])/g, "$1 $2")}
          <sup style={{ color: "red" }}>*</sup>
        </b>
      ),
      flex: 2,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`recipients.${params.row.rhfIndex}.${
              Object.keys(parameter)[0]
            }`}
            control={control}
            rules={{ required: "true" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                disabled={true}
                onKeyDown={(event) => event.stopPropagation()}
                error={!!error}
              />
            )}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "PolicyType",
      headerName: <b>Policy Type</b>,
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`recipients.${params.row.rhfIndex}.PolicyType`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                onKeyDown={(event) => event.stopPropagation()}
              />
            )}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "RecipCat",
      headerName: (
        <b>
          Recipient Category<sup style={{ color: "red" }}>*</sup>
        </b>
      ),
      flex: 1.5,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`recipients.${params.row.rhfIndex}.RecipCat`}
            control={control}
            rules={{ required: "true" }}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                fullWidth
                MenuProps={{
                  PaperProps: { sx: { maxHeight: 300 } },
                }}
                error={!!error}
                renderValue={(selected) => {
                  const existingOption = ddData
                    .filter((i) => i.DD_Type === "RecipCat")
                    .find((opt) => opt.DD_Value === selected);
                  return existingOption ? existingOption.DD_Value : selected;
                }}
              >
                {ddLoading ? (
                  <MenuItem disabled>
                    <Loader size={15} height="20px" />
                  </MenuItem>
                ) : (
                  ddData
                    .filter((i) => i.DD_Type === "RecipCat")
                    .sort((a, b) => a - b)
                    .map((i) => (
                      <MenuItem key={i.DD_Value} value={i.DD_Value}>
                        {i.DD_Value}
                      </MenuItem>
                    ))
                )}
              </Select>
            )}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "DistVia",
      headerName: (
        <b>
          Distribute Via<sup style={{ color: "red" }}>*</sup>
        </b>
      ),
      flex: 0.8,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`recipients.${params.row.rhfIndex}.DistVia`}
            control={control}
            rules={{ required: "true" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                fullWidth
                MenuProps={{
                  PaperProps: { sx: { maxHeight: 300 } },
                }}
                error={!!error}
              >
                {ddLoading ? (
                  <MenuItem disabled>
                    <Loader size={15} height="20px" />
                  </MenuItem>
                ) : (
                  ddData
                    .filter((i) => i.DD_Type === "DistVia")
                    .sort((a, b) => a - b)
                    .map((i) => (
                      <MenuItem key={i.DD_Value} value={i.DD_Value}>
                        {i.DD_Value}
                      </MenuItem>
                    ))
                )}
              </TextField>
            )}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "AttnTo",
      headerName: (
        <b>
          Send to Attention<sup style={{ color: "red" }}>*</sup>
        </b>
      ),
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`recipients.${params.row.rhfIndex}.AttnTo`}
            control={control}
            rules={{ required: "true" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                onKeyDown={(event) => event.stopPropagation()}
                error={!!error}
              />
            )}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "EMailAddress",
      headerName: (
        <b>
          E-Mail Address<sup style={{ color: "red" }}>*</sup>
        </b>
      ),
      flex: 1.5,
      renderCell: (params) =>
        isEdit ? (
          <EmailField
            name={`recipients.${params.row.rhfIndex}.EMailAddress`}
            control={control}
            rules={{ required: "true" }}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "actions",
      headerName: "",
      width: 50,
      sortable: false,
      renderCell: (params) => {
        if (!isEdit) return null; // Hide in view mode
        return (
          <Tooltip title="Delete Row">
            <IconButton
              onClick={() => remove(params.row.rhfIndex)}
              color="error"
              size="small"
            >
              <MdClear />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      {loading === "fetching" ? (
        <Loader size={40} height="600px" />
      ) : (
        <form>
          <>
            <Typography variant="subtitle1">
              Who will receive a copy of this report?
            </Typography>
            <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
              <DataGrid
                rows={fields.map((field, index) => ({
                  ...field,
                  id: field.id,
                  rhfIndex: index,
                }))}
                columns={columns}
                disableColumnMenu
                disableRowSelectionOnClick
                disableSelectionOnClick
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      PolicyType: url === "/policy_type_distribution_affinity/",
                    },
                  },
                }}
                localeText={{
                  noRowsLabel: "No Recipients Found",
                }}
              />
            </div>
          </>

          {url !== "/policy_type_distribution_affinity/" && (
            <div style={{ marginTop: 16 }}>
              {!isEdit && (
                <Button
                  variant="outlined"
                  onClick={() => setIsEdit(true)}
                  sx={{ height: "45", mr: 2 }}
                  disabled={
                    user.role === "Director" &&
                    getValuesSac("Stage") === "Admin" &&
                    getValuesSac("IsSubmitted") === 1
                  }
                >
                  Edit
                </Button>
              )}
              {!isEdit && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleComposeEmail}
                  disabled={
                    loading === "composing" ||
                    methods.getValues("recipients").length < 1 ||
                    user.role !== "Admin"
                  }
                  sx={{ height: "45" }}
                >
                  Send Email
                </Button>
              )}

              {isEdit && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleAdd}
                    disabled={loading === "submitting"}
                    sx={{ height: "45" }}
                  >
                    Add Row
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: 8 }}
                    onClick={handleSubmit(onSubmit, onError)}
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
          )}
        </form>
      )}
    </FormProvider>
  );
}
