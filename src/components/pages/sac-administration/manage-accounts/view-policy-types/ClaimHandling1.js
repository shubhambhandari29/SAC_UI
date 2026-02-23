import { Grid, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export default function ClaimHandling1({ isEnabled }) {
  const { control } = useFormContext();
  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Controller
          name="ContactInstruct"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Contact Instructions"
              multiline
              rows={5}
              disabled={!isEnabled("ContactInstruct")}
            />
          )}
        />
      </Grid>

      <Grid size={12}>
        <Controller
          name="CoverageInstruct"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Coverage Instructions"
              multiline
              rows={5}
              disabled={!isEnabled("CoverageInstruct")}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
