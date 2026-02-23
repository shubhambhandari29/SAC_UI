import {
  Box,
  Checkbox,
  IconButton,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MdBrowserUpdated } from "react-icons/md";
import { MdClear } from "react-icons/md";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function MonthRow({ tabName, month, index }) {
  const { control, setValue } = useFormContext();
  const [reportTypeOpen, setReportTypeOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const { pathname } = useLocation();

  const gridStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 1,
  };

  const boxStyle = { display: "flex", alignItems: "center", height: 32 };
  const typoStyles = { fontSize: 11, fontWeight: 600 };

  const handleClear = () => {
    setValue(`${tabName}.${index}.checked`, false);
    setValue(`${tabName}.${index}.lastSendDate`, null);
    setValue(`${tabName}.${index}.NoClaims`, false);
    setValue(`${tabName}.${index}.AdHocReport`, false);
    setValue(`${tabName}.${index}.reportType`, null);
    setValue(`${tabName}.${index}.deliveryMethod`, null);
    setValue(`${tabName}.${index}.narrativesProcessed`, null);
  };

  return (
    <Grid
      container
      spacing={0.5}
      alignItems="end"
      justifyContent="center"
      textAlign="center"
      size={12}
    >
      <Grid sx={{ minWidth: 60, ...gridStyle }}>
        {((index === 0 && tabName === "ClaimRevCheckboxes") ||
          ((index === 0 || index === 6) &&
            (tabName === "LossRunCheckboxes" ||
              tabName === "DeductCheckboxes"))) && (
          <Typography sx={typoStyles}>
            Due if <br />
            Checked
          </Typography>
        )}
        <Controller
          name={`${tabName}.${index}.checked`}
          control={control}
          disabled={user.role === "Underwriter"}
          render={({ field }) => (
            <Box sx={{ minWidth: 70, ...boxStyle }}>
              <Checkbox {...field} checked={field.value} />
              {month}
            </Box>
          )}
        />
      </Grid>

      <Grid sx={{ minWidth: 30, ...gridStyle }}>
        {((index === 0 && tabName === "ClaimRevCheckboxes") ||
          ((index === 0 || index === 6) &&
            (tabName === "LossRunCheckboxes" ||
              tabName === "DeductCheckboxes"))) && (
          <Typography sx={typoStyles}>Sent</Typography>
        )}
        <IconButton
          disabled={user.role !== "Admin"}
          onClick={() => {
            setValue(
              `${tabName}.${index}.lastSendDate`,
              new Date().toISOString().split("T")[0],
            );
            setReportTypeOpen(true);
          }}
          sx={{ minWidth: 30, ...boxStyle }}
        >
          <MdBrowserUpdated color="#818181ff" />
        </IconButton>
      </Grid>

      <Grid sx={{ minWidth: 150, ...gridStyle }}>
        {((index === 0 && tabName === "ClaimRevCheckboxes") ||
          ((index === 0 || index === 6) &&
            (tabName === "LossRunCheckboxes" ||
              tabName === "DeductCheckboxes"))) && (
          <Typography sx={typoStyles}>Last Send Date</Typography>
        )}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name={`${tabName}.${index}.lastSendDate`}
            control={control}
            disabled={user.role !== "Admin"}
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <DatePicker
                {...fieldProps}
                value={value ? dayjs(value) : null}
                onChange={(newValue) => {
                  onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>

      {tabName === "LossRunCheckboxes" && (
        <>
          <Grid sx={{ minWidth: 30, ...gridStyle }}>
            {((index === 0 && tabName === "ClaimRevCheckboxes") ||
              ((index === 0 || index === 6) &&
                tabName === "LossRunCheckboxes")) && (
              <Typography sx={typoStyles}>
                No <br />
                Claims
              </Typography>
            )}
            <Controller
              name={`${tabName}.${index}.NoClaims`}
              control={control}
              disabled={user.role === "Underwriter"}
              render={({ field }) => (
                <Box sx={{ minWidth: 30, ...boxStyle }}>
                  <Checkbox {...field} checked={field.value} />
                </Box>
              )}
            />
          </Grid>
          <Grid sx={{ minWidth: 30, ...gridStyle }}>
            {((index === 0 && tabName === "ClaimRevCheckboxes") ||
              ((index === 0 || index === 6) &&
                tabName === "LossRunCheckboxes")) && (
              <Typography sx={typoStyles}>
                Ad Hoc <br />
                Report
              </Typography>
            )}
            <Controller
              name={`${tabName}.${index}.AdHocReport`}
              control={control}
              disabled={user.role === "Underwriter"}
              render={({ field }) => (
                <Box sx={{ minWidth: 30, ...boxStyle }}>
                  <Checkbox {...field} checked={field.value} />
                </Box>
              )}
            />
          </Grid>
        </>
      )}

      {tabName === "ClaimRevCheckboxes" && (
        <>
          <Grid sx={{ minWidth: 100, ...gridStyle }}>
            {((index === 0 && tabName === "ClaimRevCheckboxes") ||
              ((index === 0 || index === 6) &&
                tabName === "LossRunCheckboxes")) && (
              <Typography sx={typoStyles}>Report Type</Typography>
            )}
            <FormControl fullWidth>
              <Controller
                name={`${tabName}.${index}.reportType`}
                control={control}
                disabled={user.role !== "Admin"}
                render={({ field }) => (
                  <Select
                    {...field}
                    open={reportTypeOpen}
                    onClose={() => setReportTypeOpen(false)}
                    onOpen={() => setReportTypeOpen(true)}
                    sx={{ minWidth: 100, ...boxStyle }}
                  >
                    <MenuItem value="Narrative">Narrative</MenuItem>
                    <MenuItem value="NQ Letter">NQ Letter</MenuItem>
                    {pathname.includes("sac") && (
                      <MenuItem value="No Report">No Report</MenuItem>
                    )}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid sx={{ minWidth: 100, ...gridStyle }}>
            {((index === 0 && tabName === "ClaimRevCheckboxes") ||
              ((index === 0 || index === 6) &&
                tabName === "LossRunCheckboxes")) && (
              <Typography sx={typoStyles}>Delivery Method</Typography>
            )}
            <FormControl fullWidth>
              <Controller
                name={`${tabName}.${index}.deliveryMethod`}
                control={control}
                disabled={user.role !== "Admin"}
                render={({ field }) => (
                  <Select {...field} sx={{ minWidth: 100, ...boxStyle }}>
                    <MenuItem value="E-Mail">E-Mail</MenuItem>
                    <MenuItem value="Telephone">Telephone</MenuItem>
                    <MenuItem value="In Person">In Person</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid sx={{ minWidth: 70, ...gridStyle }}>
            {((index === 0 && tabName === "ClaimRevCheckboxes") ||
              ((index === 0 || index === 6) &&
                tabName === "LossRunCheckboxes")) && (
              <Typography sx={typoStyles}>
                Narratives <br />
                Processed
              </Typography>
            )}
            <FormControl fullWidth>
              <Controller
                name={`${tabName}.${index}.narrativesProcessed`}
                control={control}
                disabled={user.role !== "Admin"}
                render={({ field }) => (
                  <Select
                    {...field}
                    MenuProps={{
                      PaperProps: { sx: { maxHeight: 300 } },
                    }}
                    sx={{ minWidth: 70, ...boxStyle }}
                  >
                    {Array.from({ length: 101 }, (_, i) => i + 1).map((i) => (
                      <MenuItem key={i} value={i - 1}>
                        {i - 1}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        </>
      )}

      <Grid sx={{ minWidth: 30, ...gridStyle }}>
        {((index === 0 && tabName === "ClaimRevCheckboxes") ||
          ((index === 0 || index === 6) &&
            (tabName === "LossRunCheckboxes" ||
              tabName === "DeductCheckboxes"))) && (
          <Typography sx={typoStyles}>Clear</Typography>
        )}
        <IconButton
          disabled={user.role !== "Admin"}
          onClick={handleClear}
          sx={{ minWidth: 30, color: "#818181ff", ...boxStyle }}
        >
          <MdClear />
        </IconButton>
      </Grid>
    </Grid>
  );
}
