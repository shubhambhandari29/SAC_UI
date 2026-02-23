import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { LuUndo } from "react-icons/lu";

export default function CctInstructionsOther({ isEnabled }) {
  const { control, setValue } = useFormContext();

  const handleAccountLocationId = (e) => {
    setValue("AcctLocID", e.target.value);

    if (e.target.value === "1")
      setValue("AcctLocNotes", "Use Desktop Shortcut");
    if (e.target.value === "2") setValue("AcctLocNotes", "");
    if (e.target.value === "3") setValue("AcctLocNotes", "None");
  };

  return (
    <Grid container spacing={1}>
      <Grid size={4}>
        <FormControl fullWidth>
          <InputLabel>Are there any additional documents to attach?</InputLabel>
          <Controller
            name="AddLDocs"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Are there any additional documents to attach?"
                disabled={!isEnabled("AddLDocs")}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid
        container
        spacing={2}
        size={8}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FormLabel id="AcctLocID" sx={{ color: "black", textAlign: "center" }}>
          Account <br /> Location ID:
        </FormLabel>
        <Controller
          name="AcctLocID"
          control={control}
          render={({ field }) => (
            <RadioGroup
              row
              {...field}
              sx={{
                border: "1px solid lightgrey",
                borderRadius: "15px",
                pl: 0.5,
              }}
              onChange={handleAccountLocationId}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Use Desktop Shortcut"
                disabled={!isEnabled("AcctLocID")}
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="See Notes"
                disabled={!isEnabled("AcctLocID")}
              />
              <FormControlLabel
                value="3"
                control={<Radio />}
                label="None"
                disabled={!isEnabled("AcctLocID")}
              />
            </RadioGroup>
          )}
        />
        <Button
          type="button"
          variant="text"
          sx={{
            minWidth: "unset",
            padding: "0px",
          }}
          onClick={() => {
            setValue("AcctLocID", undefined);
            setValue("AcctLocNotes", "");
          }}
          disabled={!isEnabled("AcctLocID")}
        >
          <LuUndo size={24} style={{ padding: "0px" }} />
        </Button>
      </Grid>
      <Grid size={12}>
        <Controller
          name="AcctLocNotes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Account Location Notes"
              multiline
              rows={5}
              disabled={!isEnabled("AcctLocNotes")}
            />
          )}
        />
      </Grid>

      <Grid container spacing={1} size={12}>
        <Grid size={7}>
          <Controller
            name="CCTOtherNotes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Other Additional Instructions"
                multiline
                rows={4}
                disabled={!isEnabled("CCTOtherNotes")}
              />
            )}
          />
        </Grid>

        <Grid container spacing={1} size={5} alignItems="center">
          <Grid size={12}>
            <FormControl fullWidth>
              <InputLabel>Accounts With Product Claims</InputLabel>
              <Controller
                name="AcctProdClaims"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Accounts With Product Claims"
                    disabled={!isEnabled("AcctProdClaims")}
                    renderValue={(selected) => {
                      const existingOption = ["Yes", "No"].find(
                        (opt) => opt === selected,
                      );
                      return existingOption ? existingOption : selected;
                    }}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth>
              <InputLabel>Accounts With Valet Coverage</InputLabel>
              <Controller
                name="AcctValetCov"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Accounts With Valet Coverage"
                    disabled={!isEnabled("AcctValetCov")}
                    renderValue={(selected) => {
                      const existingOption = ["Yes", "No"].find(
                        (opt) => opt === selected,
                      );
                      return existingOption ? existingOption : selected;
                    }}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
