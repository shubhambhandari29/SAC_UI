import { Grid, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";
import UpdateAllBtn from "./UpdateAllBtn";
import { useSelector } from "react-redux";

export default function ClaimHandling3({ isEnabled }) {
  const { control } = useFormContext();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.auth.user);

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid size={pathname.includes("create-new-policy") ? 12 : 11.3}>
        <Controller
          name="RecoveryInstruct"
          control={control}
          disabled={!isEnabled("RecoveryInstruct")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Recovery Instructions"
              multiline
              rows={5}
            />
          )}
        />
      </Grid>
      {pathname.includes("view-policy") && (
        <Grid size={0.7}>
          <UpdateAllBtn
            disabled={!isEnabled("RecoveryInstruct") || user.role !== "Admin"}
            fieldName="RecoveryInstruct"
          />
        </Grid>
      )}

      <Grid size={pathname.includes("create-new-policy") ? 12 : 11.3}>
        <Controller
          name="MiscCovInstruct"
          control={control}
          disabled={!isEnabled("MiscCovInstruct")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Miscellaneous Instructions"
              multiline
              rows={5}
            />
          )}
        />
      </Grid>
      {pathname.includes("view-policy") && (
        <Grid size={0.7}>
          <UpdateAllBtn
            disabled={!isEnabled("MiscCovInstruct") || user.role !== "Admin"}
            fieldName="MiscCovInstruct"
          />
        </Grid>
      )}
    </Grid>
  );
}
