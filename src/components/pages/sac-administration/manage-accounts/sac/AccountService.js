import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import Modal from "../../../../ui/Modal";
import HcmUserList from "./HcmUserList";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../../../api/api";
import Loader from "../../../../ui/Loader";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import useDropdownData from "../../../../../hooks/useDropdownData";
import Swal from "sweetalert2";
import CurrencyField from "../../../../ui/CurrencyField";

export default function AccountService({ isEnabled }) {
  const { control, getValues, setValue } = useFormContext();
  const [viewHcmUserList, setViewHcmUserList] = useState(false);
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { data: ddData, loading: ddLoading } =
    useDropdownData("/dropdowns/all");
  const { data: ServLevelData, loading: ServLevelLoading } = useDropdownData(
    "/dropdowns/ServLevel",
  );

  const handleRecalculatePrem = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/sac_policies/get_premium", {
        params: { CustomerNum: getValues("CustomerNum") },
      });

      if (res?.status === 200)
        setValue("TotalPrem", res.data ? res.data.toFixed(2) : 0.0);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Some error occoured, unable to calculate premium",
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
  }, [getValues, setValue, theme.palette.error.main]);

  useEffect(() => {
    handleRecalculatePrem();
  }, [handleRecalculatePrem]);

  return (
    <Grid container spacing={1}>
      {/*Modal for hcm users list  */}
      <Modal
        open={viewHcmUserList}
        onClose={() => setViewHcmUserList(false)}
        title="HCM User List"
        maxWidth="xl"
      >
        <HcmUserList
          customerNum={getValues("CustomerNum")}
          getValuesSac={getValues}
        />
      </Modal>

      <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
        <FormControl fullWidth>
          <InputLabel>Services Requested?</InputLabel>
          <Controller
            name="ServicesReq"
            control={control}
            disabled={!isEnabled("ServicesReq")}
            render={({ field }) => (
              <Select {...field} label="Services Requested?">
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
        <FormControl fullWidth>
          <InputLabel>Exceptions?</InputLabel>
          <Controller
            name="Exceptions"
            control={control}
            disabled={!isEnabled("Exceptions")}
            render={({ field }) => (
              <Select {...field} label="Exceptions?">
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormControl fullWidth>
          <InputLabel>HCM Access</InputLabel>
          <Controller
            name="HCMAccess"
            control={control}
            disabled={!isEnabled("HCMAccess")}
            render={({ field }) => (
              <Select
                {...field}
                label="HCM Access"
                MenuProps={{
                  PaperProps: { sx: { maxHeight: 300 } },
                }}
                renderValue={(selected) => {
                  const existingOption = ddData
                    .filter((i) => i.DD_Type === "HCMAccess")
                    .find((opt) => opt.value === selected);
                  return existingOption ? existingOption.label : selected;
                }}
              >
                {ddLoading ? (
                  <MenuItem disabled>
                    <Loader size={15} height="20px" />
                  </MenuItem>
                ) : (
                  ddData
                    .filter((i) => i.DD_Type === "HCMAccess")
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
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        {pathname !== "/sac-create-new-account" && (
          <CurrencyField
            name="TotalPrem"
            control={control}
            disabled={!isEnabled("TotalPrem")}
            label="Total Active Premium"
          />
        )}
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormControl fullWidth>
          <Controller
            name="ServLevel"
            control={control}
            disabled={!isEnabled("ServLevel")}
            render={({ field: { onChange, value, ref, ...fieldProps } }) => (
              <Autocomplete
                {...fieldProps}
                options={ServLevelData || []}
                loading={ServLevelLoading}
                getOptionLabel={(option) =>
                  option["service Level"] +
                    " - " +
                    option["Dollar Threshold"] || ""
                }
                isOptionEqualToValue={(option, val) =>
                  option["service Level"] === val["service Level"]
                }
                value={
                  value
                    ? ServLevelData.find(
                        (opt) => opt["service Level"] === value,
                      ) || { "service Level": value }
                    : null
                }
                onChange={(_, newValue) => {
                  onChange(newValue ? newValue["service Level"] : "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Service Level" inputRef={ref} />
                )}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormControl fullWidth>
          <Controller
            name="AccomType"
            control={control}
            disabled={!isEnabled("AccomType")}
            render={({ field: { onChange, value, ref, ...fieldProps } }) => (
              <Autocomplete
                {...fieldProps}
                options={
                  ddData
                    .filter((i) => i.DD_Type === "AccomType")
                    .sort((a, b) => a - b) || []
                }
                loading={ddLoading}
                getOptionLabel={(option) => option.DD_Value || ""}
                isOptionEqualToValue={(option, val) =>
                  option.DD_Value === val?.DD_Value
                }
                value={
                  value
                    ? ddData.find((opt) => opt.DD_Value === value) || {
                        DD_Value: value,
                      }
                    : null
                }
                onChange={(_, newValue) => {
                  onChange(newValue ? newValue.DD_Value : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Accommodation Type"
                    inputRef={ref}
                  />
                )}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        {pathname !== "/sac-create-new-account" && (
          <Button
            name="RecalculatePremBtn"
            variant="outlined"
            color="primary"
            fullWidth
            disabled={!isEnabled("RecalculatePremBtn") || loading}
            // disabled
            onClick={handleRecalculatePrem}
          >
            {loading ? (
              <Loader size={16} height="25px" />
            ) : (
              "Recalculate Premium"
            )}
          </Button>
        )}
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormControl fullWidth>
          <Controller
            name="ExceptType"
            control={control}
            disabled={!isEnabled("ExceptType")}
            render={({ field: { onChange, value, ref, ...fieldProps } }) => (
              <Autocomplete
                {...fieldProps}
                options={
                  ddData
                    .filter((i) => i.DD_Type === "ExceptType")
                    .sort((a, b) => a - b) || []
                }
                loading={ddLoading}
                getOptionLabel={(option) => option.DD_Value || ""}
                isOptionEqualToValue={(option, val) =>
                  option.DD_Value === val?.DD_Value
                }
                value={
                  value
                    ? ddData.find((opt) => opt.DD_Value === value) || {
                        DD_Value: value,
                      }
                    : null
                }
                onChange={(_, newValue) => {
                  onChange(newValue ? newValue.DD_Value : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Exception Type"
                    inputRef={ref}
                  />
                )}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Business Type</InputLabel>
          <Controller
            name="BusinessType"
            control={control}
            disabled={!isEnabled("BusinessType")}
            render={({ field }) => (
              <Select
                {...field}
                label="Business Type"
                MenuProps={{
                  PaperProps: { sx: { maxHeight: 300 } },
                }}
                renderValue={(selected) => {
                  const existingOption = ddData
                    .filter((i) => i.DD_Type === "BusinessType")
                    .find((opt) => opt.value === selected);
                  return existingOption ? existingOption.label : selected;
                }}
              >
                {ddLoading ? (
                  <MenuItem disabled>
                    <Loader size={15} height="20px" />
                  </MenuItem>
                ) : (
                  ddData
                    .filter((i) => i.DD_Type === "BusinessType")
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
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        {pathname !== "/sac-create-new-account" ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="RenewLetterDt"
              control={control}
              disabled={!isEnabled("RenewLetterDt")}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <DatePicker
                  {...fieldProps}
                  label="Renewal Letter Sent Date"
                  value={value ? dayjs(value) : null}
                  onChange={(newValue) => {
                    onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                  }}
                />
              )}
            />
          </LocalizationProvider>
        ) : (
          <Button
            name="HCMUserListBtn"
            variant="outlined"
            color="primary"
            fullWidth
            disabled
            onClick={() => setViewHcmUserList(true)}
          >
            HCM Users List
          </Button>
        )}
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="EffectiveDate"
            control={control}
            disabled={!isEnabled("EffectiveDate")}
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <DatePicker
                {...fieldProps}
                label="HCM Effective Date"
                value={value ? dayjs(value) : null}
                onChange={(newValue) => {
                  onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="DiscDate"
            control={control}
            disabled={!isEnabled("DiscDate")}
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <DatePicker
                {...fieldProps}
                label="HCM Disconnect Date"
                value={value ? dayjs(value) : null}
                onChange={(newValue) => {
                  onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        {pathname !== "/sac-create-new-account" && (
          <Button
            name="HCMUserListBtn"
            variant="outlined"
            color="primary"
            fullWidth
            disabled={!isEnabled("HCMUserListBtn")}
            onClick={() => setViewHcmUserList(true)}
          >
            HCM Users List
          </Button>
        )}
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Controller
          name="InsuredWebsite"
          control={control}
          disabled={!isEnabled("InsuredWebsite")}
          render={({ field }) => (
            <TextField {...field} fullWidth label="Insured Web Site" />
          )}
        />
      </Grid>
    </Grid>
  );
}
