import { Typography } from "@mui/material";

export default function Heading1({ text }) {
  return (
    <Typography
      variant="h5"
      sx={{ fontSize: 18, fontWeight: 600, textDecoration: "underline" }}
    >
      {text}
    </Typography>
  );
}
