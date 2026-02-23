import {
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import UpdateAllBtn from "./UpdateAllBtn";
import { useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import useDropdownData from "../../../../../hooks/useDropdownData";
import Loader from "../../../../ui/Loader";
import api from "../../../../../api/api";
import Swal from "sweetalert2";
import CurrencyField from "../../../../ui/CurrencyField";

export default function Policy({ isEnabled, disableForDirector }) {
  const { control, getValues } = useFormContext();
  const { pathname } = useLocation();
  const { data: UnderwritersData, loading: UnderwritersLoading } =
    useDropdownData("/dropdowns/Underwriters");
  const { data: ReasonData, loading: ReasonLoading } = useDropdownData(
    "/dropdowns/DNRStatus",
  );
  const theme = useTheme();

  const handleUnderwriterUpdate = async (oldVal, val) => {
    const newVal = UnderwritersData.find((i) => i["UW Last"] === val);
    if (!newVal) return;

    const data = {
      CustomerNum: getValues("CustomerNum"),
      RecipCat: "Underwriter",
      DistVia: "Email",
      AttnTo: newVal["UW Last"],
      EMailAddress: newVal["UW Email"],
    };

    try {
      await Promise.allSettled([
        api.post("/claim_review_distribution/delete", [
          { CustomerNum: getValues("CustomerNum"), AttnTo: oldVal },
        ]),
        api.post("/loss_run_distribution/delete", [
          { CustomerNum: getValues("CustomerNum"), AttnTo: oldVal },
        ]),
        api.post("/claim_review_distribution/upsert", [data]),
        api.post("/loss_run_distribution/upsert", [data]),
      ]);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Some error occoured, unable to update data in distribution table",
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

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, md: 4 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="DateCreated"
            control={control}
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <DatePicker
                {...fieldProps}
                label="Created On"
                value={value ? dayjs(value) : null}
                disabled={!isEnabled("DateCreated")}
                onChange={(newValue) => {
                  onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid size={pathname.includes("create-new-policy") ? 4 : 3.3}>
        <FormControl fullWidth>
          <Controller
            name="UnderwriterName"
            control={control}
            disabled={!isEnabled("UnderwriterName")}
            render={({ field: { onChange, value, ref, ...fieldProps } }) => (
              <Autocomplete
                {...fieldProps}
                options={UnderwritersData || []}
                loading={UnderwritersLoading}
                getOptionLabel={(option) => option["UW Last"] || ""}
                isOptionEqualToValue={(option, val) =>
                  option["UW Last"] === val["UW Last"]
                }
                value={
                  value
                    ? UnderwritersData.find(
                        (opt) => opt["UW Last"] === value,
                      ) || { "UW Last": value }
                    : null
                }
                onChange={(_, newValue) => {
                  const selectedvalue = newValue ? newValue["UW Last"] : "";
                  onChange(selectedvalue);
                  handleUnderwriterUpdate(value, selectedvalue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Underwriter Name"
                    inputRef={ref}
                  />
                )}
              />
            )}
          />
        </FormControl>
      </Grid>
      {pathname.includes("view-policy") && (
        <Grid size={0.7}>
          <UpdateAllBtn
            fieldName="UnderwriterName"
            disabled={!isEnabled("UnderwriterName") || disableForDirector}
          />
        </Grid>
      )}
      <Grid size={pathname.includes("create-new-policy") ? 4 : 3.3}>
        <FormControl fullWidth>
          <Controller
            name="UWMgr"
            control={control}
            disabled={!isEnabled("UWMgr")}
            render={({ field: { onChange, value, ref, ...fieldProps } }) => (
              <Autocomplete
                {...fieldProps}
                options={UnderwritersData || []}
                loading={UnderwritersLoading}
                getOptionLabel={(option) => option["UW Last"] || ""}
                isOptionEqualToValue={(option, val) =>
                  option["UW Last"] === val["UW Last"]
                }
                value={
                  value
                    ? UnderwritersData.find(
                        (opt) => opt["UW Last"] === value,
                      ) || { "UW Last": value }
                    : null
                }
                onChange={(_, newValue) => {
                  onChange(newValue ? newValue["UW Last"] : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Underwriting Manager"
                    inputRef={ref}
                  />
                )}
              />
            )}
          />
        </FormControl>
      </Grid>
      {pathname.includes("view-policy") && (
        <Grid size={0.7}>
          <UpdateAllBtn
            fieldName="UWMgr"
            disabled={!isEnabled("UWMgr") || disableForDirector}
          />
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 4 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="DNRDate"
            control={control}
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <DatePicker
                {...fieldProps}
                label="Policy Did Not Renew Date"
                value={value ? dayjs(value) : null}
                disabled={!isEnabled("DNRDate")}
                onChange={(newValue) => {
                  onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Reason</InputLabel>
          <Controller
            name="DNRStatus"
            control={control}
            disabled={!isEnabled("DNRStatus")}
            render={({ field }) => (
              <Select
                {...field}
                label="Reason"
                MenuProps={{
                  PaperProps: { sx: { maxHeight: 300 } },
                }}
                renderValue={(selected) => {
                  const existingOption = ReasonData.find(
                    (opt) => opt.value === selected,
                  );
                  return existingOption ? existingOption.label : selected;
                }}
              >
                {ReasonLoading ? (
                  <MenuItem disabled>
                    <Loader size={15} height="20px" />
                  </MenuItem>
                ) : (
                  ReasonData.sort(
                    (a, b) => a.DD_SortOrder - b.DD_SortOrder,
                  ).map((i) => (
                    <MenuItem key={i.DD_Value} value={i.DD_Value}>
                      {i.DD_Value}
                    </MenuItem>
                  ))
                )}
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormControl fullWidth>
          <CurrencyField
            name="PremiumAmt"
            control={control}
            disabled={!isEnabled("PremiumAmt")}
            label="Policy Premium Amount $"
          />
        </FormControl>
      </Grid>
    </Grid>
  );
}
