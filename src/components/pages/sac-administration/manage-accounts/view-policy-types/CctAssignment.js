import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export default function CctAssignment({ isEnabled }) {
  const { control } = useFormContext();
  return (
    <Grid container spacing={1}>
      <Grid size={5}>
        <FormControl fullWidth>
          <InputLabel>Assignment Instructions</InputLabel>
          <Controller
            name="SpecHand"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Assignment Instructions"
                disabled={!isEnabled("SpecHand")}
              >
                <MenuItem value="Auto Assign">Auto Assign</MenuItem>
                <MenuItem value="See Assignment Instructions">
                  See Assignment Instructions
                </MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      <Grid size={12}>
        <Controller
          name="CCTAssgInstruct"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="CCT Assignment Instructions"
              multiline
              rows={9}
              disabled={!isEnabled("CCTAssgInstruct")}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
