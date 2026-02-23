import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";
import CurrencyField from "../../../../ui/CurrencyField";

export default function Deductible({ isEnabled, isNextMod, pkProp }) {
  const { control } = useFormContext();
  const { pathname } = useLocation();

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Typography variant="h6" sx={{ color: "red", textAlign: "center" }}>
          This is for a 3rd Party Liability deductible
        </Typography>
      </Grid>

      <Grid container spacing={1} size={7.5}>
        <Grid size={4}>
          <FormControl fullWidth>
            <InputLabel>Bill for Expenses?</InputLabel>
            <Controller
              name="BillExpYN"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Bill for Expenses?"
                  disabled={!isEnabled("BillExpYN")}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={4}>
          <FormControl fullWidth>
            <InputLabel>Biller Name</InputLabel>
            <Controller
              name="BillName"
              control={control}
              disabled={!isEnabled("BillName")}
              render={({ field }) => (
                <Select {...field} label="Biller Name">
                  <MenuItem value="SAC">SAC</MenuItem>
                  <MenuItem value="Paragon">Paragon</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={4}>
          <FormControl fullWidth>
            <InputLabel>Is this a Large Deductible?</InputLabel>
            <Controller
              name="LargeDeductYN"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Is this a Large Deductible?"
                  disabled={!isEnabled("LargeDeductYN")}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid size={4}>
          <FormControl fullWidth>
            <InputLabel>Is Deductible Met?</InputLabel>
            <Controller
              name="AggMet"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Is Deductible Met?"
                  disabled={!isEnabled("AggMet")}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={4}>
          <CurrencyField
            name="AggAmt"
            control={control}
            disabled={!isEnabled("AggAmt")}
            label="Deductible Amt $"
          />
        </Grid>
        <Grid size={4}>
          <FormControl fullWidth>
            <Controller
              name="LCFrate"
              control={control}
              disabled={!isEnabled("LCFrate")}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Loss Conversion Factor (LCF)"
                  disabled={!isEnabled("LCFrate")}
                />
              )}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid size={4.5}>
        <Box
          component="fieldset"
          sx={{
            border: "1px solid lightgray",
            borderRadius: "15px",
            p: 1,
          }}
        >
          <legend
            style={{
              padding: "0 8px",
              fontSize: "12px",
              color: "gray",
              margin: "0 auto",
            }}
          >
            Letter of Credit Information
          </legend>
          <Grid container spacing={1} size={12}>
            <Grid size={6}>
              <FormControl fullWidth>
                <InputLabel>Letter of Credit</InputLabel>
                <Controller
                  name="LCYN"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Letter of Credit"
                      disabled={!isEnabled("LCYN")}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={6}>
              <CurrencyField
                name="LCAmt"
                control={control}
                disabled={!isEnabled("LCAmt")}
                label="Amount $"
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="LCBank"
                control={control}
                disabled={!isEnabled("LCBank")}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="L/C Bank Information"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid size={4}>
        <CurrencyField
          name="PerClaimAggAmt"
          control={control}
          disabled={!isEnabled("PerClaimAggAmt")}
          label="Per Claim Deductible Amt $"
        />
      </Grid>
      <Grid size={4}>
        <Controller
          name="FeatType"
          control={control}
          disabled={!isEnabled("FeatType")}
          render={({ field }) => (
            <TextField {...field} fullWidth label="Exposure type" />
          )}
        />
      </Grid>
      <Grid size={4}>
        <Controller
          name="SentParagon"
          control={control}
          disabled={!isEnabled("SentParagon")}
          render={({ field }) => (
            <TextField {...field} fullWidth label="Sent to Paragon Date" />
          )}
        />
      </Grid>

      <Grid size={6}>
        <Controller
          name="DeductNotesOne"
          control={control}
          disabled={!isEnabled("DeductNotesOne")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Deductible Notes (1)"
              multiline
              rows={3}
            />
          )}
        />
      </Grid>
      <Grid size={6}>
        <Controller
          name="DeductNotesTwo"
          control={control}
          disabled={!isEnabled("DeductNotesTwo")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Deductible Notes (2)"
              multiline
              rows={3}
            />
          )}
        />
      </Grid>
      {((pathname !== "/create-new-policy" && !isNextMod && pkProp) ||
        (!pkProp && pathname.includes("view-policy") && !isNextMod)) && (
        <>
          <Grid size={6}>
            <span style={{ color: "red", marginLeft: 15 }}>
              This comment section WILL appear on report
            </span>
          </Grid>
          <Grid size={6}>
            <span style={{ color: "red", marginLeft: 15 }}>
              This comment section WILL NOT appear on report
            </span>
          </Grid>
        </>
      )}
    </Grid>
  );
}
