import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export default function ClaimHandling2({ isEnabled }) {
  const { control } = useFormContext();
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Is Preferred Counsel Approved?</InputLabel>
          <Controller
            name="PrefCounselYN"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Is Preferred Counsel Approved?"
                disabled={!isEnabled("PrefCounselYN")}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      <Grid size={12}>
        <Controller
          name="LitigationInstruct"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Litigation Instructions"
              multiline
              rows={9}
              disabled={!isEnabled("LitigationInstruct")}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
