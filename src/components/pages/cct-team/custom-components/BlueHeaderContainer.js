import { Grid } from "@mui/material";
import BlueHeader from "./BlueHeader";

export default function BlueHeaderContainer({ title, children }) {
  return (
    <Grid container spacing={2} size={{ xs: 12 }}>
      <BlueHeader title={title} />
      <Grid container spacing={2} size={{ xs: 12 }} sx={{ px: 2 }}>
        {children}
      </Grid>
    </Grid>
  );
}
