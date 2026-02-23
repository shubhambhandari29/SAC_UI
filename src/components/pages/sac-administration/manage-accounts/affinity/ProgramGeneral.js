import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Modal from "../../../../ui/Modal";
import ViewAgentDetails from "./ViewAgentDetails";
import useDropdownData from "../../../../../hooks/useDropdownData";

export default function ProgramGeneral({ isEnabled, formData }) {
  const { control, getValues } = useFormContext();
  const [viewAgentDetails, setViewAgentDetails] = useState(false);
  const { data: ddData, loading: ddLoading } =
    useDropdownData("/dropdowns/all");

  return (
    <Grid container spacing={2}>
      {/*Modal for hcm users list  */}
      <Modal
        open={viewAgentDetails}
        onClose={() => setViewAgentDetails(false)}
        title="Affinity Agent List"
        maxWidth="md"
      >
        <ViewAgentDetails
          ProgramName={getValues("ProgramName")}
          isEnabled={isEnabled}
          formData={formData}
          getValuesSac={getValues}
        />
      </Modal>

      <Grid size={{ xs: 12, md: 2.5 }}>
        <FormControl fullWidth>
          <InputLabel>Services Requested?</InputLabel>
          <Controller
            name="ServReq"
            control={control}
            disabled={!isEnabled("ServReq")}
            render={({ field }) => (
              <Select {...field} label="Services Requested?">
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 2.5 }}>
        <FormControl fullWidth>
          <InputLabel>Exceptions?</InputLabel>
          <Controller
            name="ExceptYN"
            control={control}
            disabled={!isEnabled("ExceptYN")}
            render={({ field }) => (
              <Select {...field} label="Exceptions?">
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 4.5 }}>
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
      <Grid size={2.5}>
        <Button
          name="AgentDetailsBtn"
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => setViewAgentDetails(true)}
          disabled={!isEnabled("AgentDetailsBtn")}
        >
          View Agent Details
        </Button>
      </Grid>
      <Grid size={12}>
        <Controller
          name="AcctNotes"
          control={control}
          disabled={!isEnabled("AcctNotes")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Program Details"
              multiline
              rows={10}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
