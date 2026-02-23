import { Grid, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";
import UpdateAllBtn from "./UpdateAllBtn";
import { useSelector } from "react-redux";

export default function ClaimHandling1({ isEnabled }) {
  const { control } = useFormContext();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.auth.user);

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid size={pathname.includes("create-new-policy") ? 12 : 11.3}>
        <Controller
          name="ContactInstruct"
          control={control}
          disabled={!isEnabled("ContactInstruct")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Contact Instructions"
              multiline
              rows={3}
            />
          )}
        />
      </Grid>
      {pathname.includes("view-policy") && (
        <Grid size={0.7}>
          <UpdateAllBtn
            disabled={!isEnabled("ContactInstruct") || user.role !== "Admin"}
            fieldName="ContactInstruct"
          />
        </Grid>
      )}

      <Grid size={pathname.includes("create-new-policy") ? 12 : 11.3}>
        <Controller
          name="CoverageInstruct"
          control={control}
          disabled={!isEnabled("CoverageInstruct")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Coverage Instructions"
              multiline
              rows={3}
            />
          )}
        />
      </Grid>
      {pathname.includes("view-policy") && (
        <Grid size={0.7}>
          <UpdateAllBtn
            disabled={!isEnabled("CoverageInstruct") || user.role !== "Admin"}
            fieldName="CoverageInstruct"
          />
        </Grid>
      )}
    </Grid>
  );
}
