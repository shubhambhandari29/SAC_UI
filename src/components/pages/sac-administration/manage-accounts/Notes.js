import { Grid, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export default function Notes({ name, label, isEnabled }) {
  const { control } = useFormContext();
  return (
    <Grid size={{ xs: 12, md: 12 }}>
      <Controller
        name={name}
        control={control}
        disabled={!isEnabled(name)}
        render={({ field }) => (
          <TextField {...field} fullWidth label={label} multiline rows={10} />
        )}
      />
    </Grid>
  );
}
