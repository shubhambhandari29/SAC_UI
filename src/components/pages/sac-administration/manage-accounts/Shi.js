import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";

export default function Shi({ isEnabled }) {
  const { control } = useFormContext();
  const { pathname } = useLocation();

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, sm: 8, md: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Is SHI Complete?</InputLabel>
          <Controller
            name={pathname.includes("sac") ? "SHI_Complete" : "SHIComplete"}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Is SHI Complete?"
                disabled={
                  !isEnabled(
                    pathname.includes("sac") ? "SHI_Complete" : "SHIComplete",
                  )
                }
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Controller
          name={pathname.includes("sac") ? "SHI_Comments" : "SHINotes"}
          control={control}
          disabled={
            !isEnabled(pathname.includes("sac") ? "SHI_Comments" : "SHINotes")
          }
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="SHI Notes"
              multiline
              rows={8}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
