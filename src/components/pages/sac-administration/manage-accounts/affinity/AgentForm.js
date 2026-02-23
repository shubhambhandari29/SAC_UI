import {
  Autocomplete,
  Box,
  createFilterOptions,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { Controller, FormProvider } from "react-hook-form";
import PhoneField from "../../../../ui/PhoneField";
import EmailField from "../../../../ui/EmailField";
import useDropdownData from "../../../../../hooks/useDropdownData";

const customStyle = {
  border: "1px solid lightgrey",
  borderRadius: "15px",
  p: 1,
};

export default function AgentForm({
  index,
  control,
  isEnabled,
  isEditing,
  setValue,
}) {
  const { data: options, loading: optionsLoading } = useDropdownData(
    "/dropdowns/EDW_AGENT_LIST",
  );

  const filter = createFilterOptions({ limit: 100 });

  return (
    <FormProvider>
      <Paper>
        <Grid
          container
          spacing={1}
          sx={{
            padding: "16px",
            border: "1px solid lightgrey",
            borderRadius: "15px",
          }}
        >
          <Grid size={4}>
            <FormControl fullWidth>
              <Controller
                name={`agents.${index}.AgentName`}
                control={control}
                rules={{
                  required: "Agent Name is mandatory and cannot be empty",
                }}
                render={({
                  field: { onChange, value, ref, ...fieldProps },
                  fieldState: { error },
                }) => (
                  <Autocomplete
                    {...fieldProps}
                    disabled={!isEnabled("AgentName")}
                    readOnly={!isEditing}
                    options={options || []}
                    filterOptions={filter}
                    loading={optionsLoading}
                    getOptionLabel={(i) => i.Agent_Name || ""}
                    isOptionEqualToValue={(i, val) =>
                      i.Agent_Name === val?.Agent_Name
                    }
                    value={
                      value
                        ? options.find((i) => i.Agent_Name === value) || {
                            Agent_Name: value,
                          }
                        : null
                    }
                    onChange={(_, newVal) => {
                      setValue(
                        `agents.${index}.AgentCode`,
                        newVal?.Agent_Code || "",
                      );
                      setValue(
                        `agents.${index}.AgentName`,
                        newVal?.Agent_Name || "",
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Agent Name"
                        inputRef={ref}
                        disabled={!isEnabled("AgentName")}
                        required
                        error={!!error}
                      />
                    )}
                    renderOption={(props, option) => {
                      const { key, ...rest } = props;
                      return (
                        <Box
                          key={props["data-option-index"]}
                          {...rest}
                          sx={{ borderRadius: "15px" }}
                        >
                          {option.Agent_Name}
                        </Box>
                      );
                    }}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={4}>
            <FormControl fullWidth>
              <Controller
                name={`agents.${index}.AgentCode`}
                control={control}
                rules={{
                  required: "Agent Code is mandatory and cannot be empty",
                }}
                render={({
                  field: { onChange, value, ref, ...fieldProps },
                  fieldState: { error },
                }) => (
                  <Autocomplete
                    {...fieldProps}
                    disabled={!isEnabled("AgentCode")}
                    readOnly={!isEditing}
                    options={options || []}
                    filterOptions={filter}
                    loading={optionsLoading}
                    getOptionLabel={(i) => i.Agent_Code || ""}
                    isOptionEqualToValue={(i, val) =>
                      i.Agent_Code === val?.Agent_Code
                    }
                    value={
                      value
                        ? options.find((i) => i.Agent_Code === value) || {
                            Agent_Code: value,
                          }
                        : null
                    }
                    onChange={(_, newVal) => {
                      setValue(
                        `agents.${index}.AgentCode`,
                        newVal?.Agent_Code || "",
                      );
                      setValue(
                        `agents.${index}.AgentName`,
                        newVal?.Agent_Name || "",
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Agent Code"
                        inputRef={ref}
                        disabled={!isEnabled("AgentCode")}
                        required
                        error={!!error}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={4}>
            <FormControl fullWidth>
              <InputLabel>Primary Agent?</InputLabel>
              <Controller
                name={`agents.${index}.PrimaryAgt`}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Primary Agent?"
                    value={field.value || ""}
                    disabled={!isEnabled("PrimaryAgt")}
                    slotProps={{ input: { readOnly: !isEditing } }}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid container spacing={1} size={6} sx={customStyle}>
            <Grid size={6}>
              <Controller
                name={`agents.${index}.AgentContact1`}
                control={control}
                disabled={!isEnabled("AgentContact1")}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="1st Contact"
                    value={field.value || ""}
                    slotProps={{ input: { readOnly: !isEditing } }}
                  />
                )}
              />
            </Grid>
            <Grid size={6}>
              <PhoneField
                name={`agents.${index}.WorkTel1`}
                label="1st Work Tel"
                control={control}
                disabled={!isEnabled("WorkTel1")}
                isMobile={true}
                slotProps={{ input: { readOnly: !isEditing } }}
              />
            </Grid>

            <Grid size={6}>
              <PhoneField
                name={`agents.${index}.CellTel1`}
                label="1st Cell Tel"
                control={control}
                disabled={!isEnabled("CellTel1")}
                isMobile={true}
                slotProps={{ input: { readOnly: !isEditing } }}
              />
            </Grid>
            <Grid size={6}>
              <EmailField
                name={`agents.${index}.Email1`}
                control={control}
                disabled={!isEnabled("Email1")}
                label="1st Email"
                slotProps={{ input: { readOnly: !isEditing } }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={1} size={6} sx={customStyle}>
            <Grid size={6}>
              <Controller
                name={`agents.${index}.AgentContact2`}
                control={control}
                disabled={!isEnabled("AgentContact2")}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="2nd Contact"
                    value={field.value || ""}
                    slotProps={{ input: { readOnly: !isEditing } }}
                  />
                )}
              />
            </Grid>
            <Grid size={6}>
              <PhoneField
                name={`agents.${index}.WorkTel2`}
                label="2nd Work Tel"
                control={control}
                disabled={!isEnabled("WorkTel2")}
                isMobile={true}
                slotProps={{ input: { readOnly: !isEditing } }}
              />
            </Grid>

            <Grid size={6}>
              <PhoneField
                name={`agents.${index}.CellTel2`}
                label="2nd Cell Tel"
                control={control}
                disabled={!isEnabled("CellTel2")}
                isMobile={true}
                slotProps={{ input: { readOnly: !isEditing } }}
              />
            </Grid>
            <Grid size={6}>
              <EmailField
                name={`agents.${index}.Email2`}
                control={control}
                disabled={!isEnabled("Email2")}
                label="2nd Email"
                slotProps={{ input: { readOnly: !isEditing } }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </FormProvider>
  );
}
