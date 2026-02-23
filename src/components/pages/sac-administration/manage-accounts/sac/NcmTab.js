import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function NcmTab({ isEnabled }) {
  const { control, getValues, setValue } = useFormContext();
  const [ncmStatus, setNcmStatus] = useState("");

  useEffect(() => setNcmStatus(getValues("NCMStatus")), [getValues]);

  return (
    <Grid container spacing={2}>
      <Grid size={4}>
        <FormControl fullWidth>
          <InputLabel>NT24 Status</InputLabel>
          <Controller
            name="NCMStatus"
            control={control}
            disabled={!isEnabled("NCMStatus")}
            render={({ field }) => (
              <Select
                {...field}
                label="NT24 Status"
                value={ncmStatus}
                onChange={(e) => {
                  setNcmStatus(e.target.value);
                  setValue("NCMStatus", e.target.value);
                  e.target.value === "Inactive"
                    ? setValue(
                        "NCMEndDt",
                        new Date().toISOString().split("T")[0],
                      )
                    : setValue("NCMEndDt", null);
                }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="NCMStartDt"
            control={control}
            disabled={!isEnabled("NCMStartDt")}
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <DatePicker
                {...fieldProps}
                label="NT24 Start Date"
                value={value ? dayjs(value) : null}
                onChange={(newValue) => {
                  onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid size={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="NCMEndDt"
            control={control}
            disabled={
              !isEnabled("NCMEndDt") ||
              (isEnabled("NCMEndDt") && ncmStatus !== "Inactive")
            }
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <DatePicker
                {...fieldProps}
                label="NT24 End Date"
                value={value ? dayjs(value) : null}
                onChange={(newValue) => {
                  onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
}
