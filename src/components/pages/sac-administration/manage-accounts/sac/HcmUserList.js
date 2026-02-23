import { useState, useEffect, useRef } from "react";
import {
  useForm,
  FormProvider,
  useFieldArray,
  Controller,
} from "react-hook-form";
import {
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Tooltip,
  useTheme,
  Zoom,
} from "@mui/material";
import api from "../../../../../api/api";
import Loader from "../../../../ui/Loader";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import PhoneField from "../../../../ui/PhoneField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formatDate } from "../../../../../util";
import { useSelector } from "react-redux";

const getEmailHtml = (user, accountName, customerNum) => {
  const appUrl = window.location.origin;
  const img1 = `${appUrl}/email-temp-1.png`;
  const img2 = `${appUrl}/email-temp-2.png`;
  const img3 = `${appUrl}/email-temp-3.png`;
  const img4 = `${appUrl}/email-temp-4.png`;

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        .email-container {
          width: 100%;
          max-width: 800px !important;
          margin: 0 auto;
        }
      </style>
    </head>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.4; font-size: 12px; margin: 0; padding: 0;">
      
      <center>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="800" style="margin: 0 auto; width: 800px; max-width: 800px;">
          <tr>
            <td style="padding: 20px 0;">

              <div style="margin-bottom: 20px;">
                <img src="${img1}" alt="The Hanover Insurance Group" width="800" style="display: block; border: 0; width: 100%; max-width: 800px;" />
              </div>

              <p style="color: red; font-weight: bold;">
                Please do NOT reply to this email. Any questions, start a new email to 
                <a href="mailto:HCMAccess@hanover.com">HCMAccess@hanover.com</a>.
              </p>

              <p>Dear <strong>${user.UserName}</strong>,</p>

              <p>We are pleased to provide you with your <strong>${accountName}</strong> Hanover Claims Manager (HCM) log on credentials and portal link. Please read all instructions and troubleshooting tips first.</p>

              <p>
                Once you have logged into HCM, you will have access to our self-guided online training tutorial to assist you in navigating the portal. After logging into HCM, click on <strong>HCM Help Tutorial</strong> on the left side under Tools & Information.
              </p>

              <p>
                <img src="${img2}" alt="The Hanover Insurance Group" width="800" style="display: block; border: 0; width: 100%; max-width: 800px;" />
              </p>

              <p>
                If you wish to Bookmark/Save to Favorites the link, please do so AFTER logging in. 
                Doing so prior will not allow you to log in. At this time, please do not change your password unless your company requires it.
              </p>

              <h5 style="margin-bottom: 5px; font-size: 14px;">Troubleshooting Tips:</h5>
              <ol style="margin-top: 5px;">
                <li>If you wish to save the link to your Favorites/bookmark it, please do so AFTER you have logged in.</li>
                <li>Due to different customer firewalls some browsers work better than others. Users typically experience most optimal performance in Google Chrome.</li>
                <li>Try clearing your cache/history.</li>
                <li>Password reset requests: Michelle Bond at 508-855-8270 or email <a href="mailto:HCMAccess@hanover.com">HCMAccess@hanover.com</a>.</li>
              </ol>

              <p>To access HCM <b>copy and paste</b> the link into your internet browser: <a href="http://myaccountnew.allmerica.com/">http://myaccountnew.allmerica.com/</a>
              </p>

              <p>Upon accessing the portal, you will be asked to log in. Your username and password are: </p>
              <table role="presentation" style="background-color: #f8f9fa; padding: 15px; border: 1px solid #ddd; width: 100%; max-width: 500px;">
                <tr>
                  <td style="width: 120px; font-weight: bold; padding: 5px;">User ID:</td>
                  <td style="padding: 5px;">${user.UserID || "N/A"}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; padding: 5px;">Password:</td>
                  <td style="padding: 5px;">${user.PROD_Password || "N/A"} (case sensitive)</td>
                </tr>
              </table>

              <div style="background-color: #FFFF00; margin-top: 20px;">
                <p>There will also be a Multi-factor Authentication (MFA) sent to your email on file. Please allow up to five minutes for this email to arrive.</p>
                <p><strong>VERY IMPORTANT!</strong> For password resets, have your Account Customer # <strong>${customerNum}</strong> and policy zip code (00001) available.</p>
              </div>

              <p>If other users within ${accountName} require access to HCM, please email <a href="HCMAccess@Hanover.com">HCMAccess@Hanover.com</a> with a request and we will respond appropriately.</p>
              
              <p>Please contact us with any questions.</p>

              <p>Sincerely,</p>
              <p>
                <strong>The Hanover Special Accounts Claims Team</strong><br />
                Toll-Free: 800-628-0250 x855-8270<br />
                Direct: 508-855-8270<br />
                Email: <a href="mailto:HCMAccess@hanover.com">HCMAccess@hanover.com</a>
              </p>

              <hr />
              
              <div style="margin-top: 20px;">
                <img src="${img3}" alt="Happier With Hanover" width="200" style="display: inline-block;" />
                <img src="${img4}" alt="The Hanover Insurance Group" width="200" style="display: inline-block;" />
              </div>

              <p style="font-size: 10px; color: #666; margin-top: 20px; line-height: 1.2;">
                Any person who knowingly and with intent to defraud any insurance company or other person files an 
                application for insurance containing any materially false information or conceals, for the purpose 
                of misleading, information concerning any fact material thereto commits a fraudulent insurance act, 
                which is a crime and subjects that person to criminal and civil penalties (In Oregon, the aforementioned 
                actions may constitute a fraudulent insurance act which may be a crime and may subject the person to penalties). 
                (In New York, the civil penalty is not to exceed five thousand dollars ($5,000) and the stated value of 
                the claim for each such violation).
              </p>

            </td>
          </tr>
        </table>
      </center>
    </body>
  </html>
  `;
};

export default function HCMUserList({ getValuesSac }) {
  const [isEdit, setIsEdit] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const methods = useForm({
    defaultValues: {
      users: [],
    },
  });
  const [loading, setLoading] = useState("");
  const { control, handleSubmit, reset, getValues } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "users",
  });
  const gridRef = useRef();
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [rowSelectionModel, setRowSelectionModel] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading("fetching");
      try {
        const res = await api.get("/hcm_users/", {
          params: { CustomerNum: getValuesSac("CustomerNum") },
        });

        const formattedData = res.data.map((data) => ({
          ...data,
          DateDeleted: formatDate(data.DateDeleted),
          DateAdded: formatDate(data.DateAdded),
          ChangeDate: formatDate(data.ChangeDate),
        }));

        setOriginalData(formattedData);
        reset({ users: formattedData });
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
  }, [getValuesSac, reset, theme.palette.error.main]);

  const onSubmit = (data) => {
    const filteredData = data.users.map((data) =>
      Object.fromEntries(
        Object.entries(data).filter(
          ([_, v]) => v !== null && v !== "" && v !== undefined,
        ),
      ),
    );

    const isSame =
      JSON.stringify(filteredData) === JSON.stringify(originalData);

    if (isSame) {
      reset({ users: filteredData });
      setIsEdit(false);
      return;
    }

    try {
      setLoading("submitting");
      // if (deleted.length) api.post(`${url}delete`, deleted);
      api.post(`/hcm_users/upsert`, filteredData);
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
    }

    setOriginalData(data.users);
    reset({ users: data.users });
    setIsEdit(false);
  };

  const onError = (errors) => {
    const errVals = Object.values(errors.users.find((i) => i));

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
      CustomerNum: getValuesSac("CustomerNum"),
      UserName: "",
      UserTitle: "",
      UserEmail: "",
      TelNum: "",
      UserAction: "Add",
      UserID: "",
      PROD_Password: "",
      DateDeleted: "",
      DateAdded: "",
      ChangeDate: "",
    });

    setTimeout(() => {
      const api = gridRef.current;
      if (!api) return;

      api.scrollToIndexes({ rowIndex: fields.length });
    }, 0);
  };

  const handleCancel = () => {
    setIsEdit(false);
    if (fields.length > originalData.length) remove(fields.length - 1);
  };

  const handleComposeEmail = async () => {
    const [selectedId] = rowSelectionModel.ids;
    if (!selectedId && selectedId !== 0) return;
    const selectedUser = getValues("users").find((user, index) => {
      return (user.PK_Number || fields[index].id) === selectedId;
    });
    if (!selectedUser) return;

    try {
      setLoading("composing");
      const accountName = getValuesSac("CustomerName") || "Customer";
      const subject = `${accountName} - Hanover Claims Manager Portal Access (hanoversecure) * Do NOT reply *`;
      const toEmail = selectedUser.UserEmail || "";

      const htmlBody = getEmailHtml(
        selectedUser,
        accountName,
        getValuesSac("CustomerNum"),
      );

      const emlContent = [
        `To: ${toEmail}`,
        `Subject: ${subject}`,
        "X-Unsent: 1",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=utf-8",
        "", // Empty line between headers and body is required
        htmlBody,
      ].join("\n");

      const blob = new Blob([emlContent], { type: "message/rfc822" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Welcome_Letter_${selectedUser.UserName.replace(/\s+/g, "_")}.eml`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Unable to download email draft",
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

  const columns = [
    {
      field: "UserName",
      headerName: (
        <b>
          User Name<sup style={{ color: "red" }}>*</sup>
        </b>
      ),
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`users.${params.row.rhfIndex}.UserName`}
            control={control}
            rules={{ required: "true" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                onKeyDown={(event) => event.stopPropagation()}
                required
                error={!!error}
              />
            )}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "UserTitle",
      headerName: (
        <b>
          Title<sup style={{ color: "red" }}>*</sup>
        </b>
      ),
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`users.${params.row.rhfIndex}.UserTitle`}
            control={control}
            rules={{ required: "true" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                onKeyDown={(event) => event.stopPropagation()}
                required
                error={!!error}
              />
            )}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "UserEmail",
      headerName: (
        <b>
          E-Mail<sup style={{ color: "red" }}>*</sup>
        </b>
      ),
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`users.${params.row.rhfIndex}.UserEmail`}
            control={control}
            rules={{
              required: "true",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                onKeyDown={(event) => event.stopPropagation()}
                required
                error={!!error}
              />
            )}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "TelNum",
      headerName: <b>Telephone Number</b>,
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <PhoneField
            name={`users.${params.row.rhfIndex}.TelNum`}
            control={control}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "UserAction",
      headerName: (
        <b>
          User Action<sup style={{ color: "red" }}>*</sup>
        </b>
      ),
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`users.${params.row.rhfIndex}.UserAction`}
            control={control}
            rules={{ required: "true" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                onKeyDown={(event) => event.stopPropagation()}
                sx={{ minWidth: 80 }}
                error={!!error}
              >
                <MenuItem value="Add">Add</MenuItem>
                <MenuItem value="Delete">Delete</MenuItem>
                <MenuItem value="No Change">No Change</MenuItem>
                <MenuItem value="Modify">Modify</MenuItem>
              </TextField>
            )}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "UserID",
      headerName: <b>User ID</b>,
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`users.${params.row.rhfIndex}.UserID`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onKeyDown={(event) => event.stopPropagation()}
              />
            )}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "PROD_Password",
      headerName: <b>Production Password</b>,
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`users.${params.row.rhfIndex}.PROD_Password`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onKeyDown={(event) => event.stopPropagation()}
              />
            )}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "DateDeleted",
      headerName: <b>Date Deleted</b>,
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name={`users.${params.row.rhfIndex}.DateDeleted`}
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <DatePicker
                  {...fieldProps}
                  value={value ? dayjs(value) : null}
                  onChange={(newValue) => {
                    onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
                />
              )}
            />
          </LocalizationProvider>
        ) : (
          params.value
        ),
    },
    {
      field: "DateAdded",
      headerName: <b>Date Added</b>,
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name={`users.${params.row.rhfIndex}.DateAdded`}
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <DatePicker
                  {...fieldProps}
                  value={value ? dayjs(value) : null}
                  onChange={(newValue) => {
                    onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
                />
              )}
            />
          </LocalizationProvider>
        ) : (
          params.value
        ),
    },
    {
      field: "ChangeDate",
      headerName: <b>Change Date</b>,
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name={`users.${params.row.rhfIndex}.ChangeDate`}
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <DatePicker
                  {...fieldProps}
                  value={value ? dayjs(value) : null}
                  onChange={(newValue) => {
                    onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
                />
              )}
            />
          </LocalizationProvider>
        ) : (
          params.value
        ),
    },
  ];

  if (loading) return <Loader size={40} height="540px" />;

  return (
    <FormProvider {...methods}>
      <form>
        <div style={{ height: 500, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={fields.map((field, index) => ({
              ...field,
              rhfIndex: index,
            }))}
            getRowId={(row) => row.PK_Number || row.id}
            columns={columns}
            disableColumnMenu
            disableRowSelectionOnClick={isEdit}
            checkboxSelection={!isEdit}
            disableMultipleRowSelection
            selectionModel={rowSelectionModel}
            onRowSelectionModelChange={(newSelection) =>
              setRowSelectionModel(newSelection)
            }
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 25 } },
            }}
            pageSizeOptions={[25, 50]}
            apiRef={gridRef}
            localeText={{
              noRowsLabel: "No Users Found",
            }}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          {!isEdit && (
            <Button
              variant="outlined"
              onClick={() => setIsEdit("true")}
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
          {!isEdit && user?.role === "Admin" && (
            <Tooltip
              title={
                !rowSelectionModel.ids?.size && "Please select a user first"
              }
              placement="top"
              TransitionComponent={Zoom}
            >
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleComposeEmail}
                  disabled={
                    loading === "composing" ||
                    !rowSelectionModel.ids?.size ||
                    user.role !== "Admin"
                  }
                  sx={{ height: "45" }}
                >
                  {loading === "composing" ? (
                    <CircularProgress size={15} color="inherit" />
                  ) : (
                    "Download Email Draft"
                  )}
                </Button>
              </span>
            </Tooltip>
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
      </form>
    </FormProvider>
  );
}
