import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function CctAssignment({ isEnabled }) {
  const { control, getValues, setValue } = useFormContext();
  const [specHand, setSpecHand] = useState("");

  useEffect(() => setSpecHand(getValues("SpecHand")), [getValues]);

  return (
    <Grid container spacing={2}>
      <Grid size={5}>
        <FormControl fullWidth>
          <InputLabel>Assignment Instructions</InputLabel>
          <Controller
            name="SpecHand"
            control={control}
            disabled={!isEnabled("SpecHand")}
            render={({ field }) => (
              <Select
                {...field}
                label="Assignment Instructions"
                value={specHand}
                onChange={(e) => {
                  setSpecHand(e.target.value);
                  setValue("SpecHand", e.target.value);
                }}
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
          disabled={
            !isEnabled("SpecHand") ||
            (isEnabled("SpecHand") &&
              specHand !== "See Assignment Instructions")
          }
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="CCT Assignment Instructions"
              multiline
              rows={8}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
