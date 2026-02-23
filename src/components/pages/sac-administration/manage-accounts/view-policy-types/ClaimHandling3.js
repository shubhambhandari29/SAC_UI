import { Grid, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export default function ClaimHandling3({ isEnabled }) {
  const { control } = useFormContext();
  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Controller
          name="RecoveryInstruct"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Recovery Instructions"
              multiline
              rows={5}
              disabled={!isEnabled("RecoveryInstruct")}
            />
          )}
        />
      </Grid>

      <Grid size={12}>
        <Controller
          name="MiscCovInstruct"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Miscellaneous Instructions"
              multiline
              rows={5}
              disabled={!isEnabled("MiscCovInstruct")}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
