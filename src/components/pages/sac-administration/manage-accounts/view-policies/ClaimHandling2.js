import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";
import UpdateAllBtn from "./UpdateAllBtn";
import { useSelector } from "react-redux";
import PhoneField from "../../../../ui/PhoneField";
import EmailField from "../../../../ui/EmailField";
import { useEffect, useState } from "react";

export default function ClaimHandling2({ isEnabled }) {
  const { control, setValue, getValues } = useFormContext();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [prefCounsel, setPrefCounsel] = useState("");

  useEffect(() => {
    setPrefCounsel(getValues("PrefCounselYN"));
  }, [getValues]);

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid size={pathname.includes("create-new-policy") ? 6 : 5.3}>
        <FormControl fullWidth>
          <InputLabel>Is Preferred Counsel Approved?</InputLabel>
          <Controller
            name="PrefCounselYN"
            control={control}
            rules={{
              required:
                "Is Preferred Counsel Approved is mandatory and cannot be empty",
            }}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                label="Is Preferred Counsel Approved?"
                disabled={!isEnabled("PrefCounselYN")}
                error={!!error}
                value={prefCounsel}
                onChange={(e) => {
                  setValue("PrefCounselYN", e.target.value);
                  setPrefCounsel(e.target.value);
                }}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      {pathname.includes("view-policy") && (
        <Grid size={0.7}>
          <UpdateAllBtn
            disabled={!isEnabled("PrefCounselYN") || user.role !== "Admin"}
            fieldName="PrefCounselYN"
          />
        </Grid>
      )}

      {prefCounsel === "Yes" && (
        <Grid container spacing={3}>
          <Grid container spacing={1} size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              name="FirmName"
              control={control}
              disabled={!isEnabled("FirmName")}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Preferred Counsel Firm Name"
                />
              )}
            />
            <Controller
              name="FirmAddress"
              control={control}
              disabled={!isEnabled("FirmAddress")}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Firm Street Address & Suite/Unit #"
                  multiline
                  rows={4}
                />
              )}
            />
            <Controller
              name="FirmCityStateZip"
              control={control}
              disabled={!isEnabled("FirmCityStateZip")}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Firm City, State, Zip" />
              )}
            />
            <Controller
              name="FirmWebsite"
              control={control}
              disabled={!isEnabled("FirmWebsite")}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Firm's Website'" />
              )}
            />
          </Grid>

          <Grid container spacing={1} size={{ xs: 12, sm: 12, md: 6 }}>
            <Controller
              name="CounselName"
              control={control}
              disabled={!isEnabled("CounselName")}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Counsel Name" />
              )}
            />
            <PhoneField
              name="CounselPhone"
              label="Counsel Phone #"
              control={control}
              disabled={!isEnabled("CounselPhone")}
            />
            <EmailField
              name="CounselEmail"
              label="Counsel Email"
              control={control}
              disabled={!isEnabled("CounselEmail")}
            />
            <Grid
              size={12}
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                border: "1px solid lightgrey",
                borderRadius: "15px",
                p: 1,
              }}
            >
              <label>Approved Hourly Rates: </label>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: "100%",
                }}
              >
                <Controller
                  name="HourlyRatesPartner"
                  control={control}
                  disabled={!isEnabled("HourlyRatesPartner")}
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="Partner" />
                  )}
                />
                <Controller
                  name="HourlyRatesAssociate"
                  control={control}
                  disabled={!isEnabled("HourlyRatesAssociate")}
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="Associate" />
                  )}
                />
                <Controller
                  name="HourlyRatesParalegal"
                  control={control}
                  disabled={!isEnabled("HourlyRatesParalegal")}
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="Paralegal" />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Grid size={pathname.includes("create-new-policy") ? 12 : 11.3}>
        <Controller
          name="LitigationInstruct"
          control={control}
          disabled={!isEnabled("LitigationInstruct")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Litigation Instructions"
              multiline
              rows={4}
            />
          )}
        />
      </Grid>
      {pathname.includes("view-policy") && (
        <Grid size={0.7}>
          <UpdateAllBtn
            disabled={!isEnabled("LitigationInstruct") || user.role !== "Admin"}
            fieldName="LitigationInstruct"
          />
        </Grid>
      )}
    </Grid>
  );
}
