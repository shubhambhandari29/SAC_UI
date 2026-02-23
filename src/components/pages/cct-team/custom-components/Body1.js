import { Typography } from "@mui/material";

export default function Body1({ text, sx }) {
  return (
    <Typography variant="h5" sx={{ fontSize: 15, fontWeight: 400, ...sx }}>
      {text}
    </Typography>
  );
}
