import { Typography } from "@mui/material";

export default function UnderlinedHeading({ text }) {
  return (
    <Typography
      variant="h6"
      sx={{
        display: "inline",
        textDecoration: "underline",
        fontWeight: 700,
      }}
    >
      {text}
    </Typography>
  );
}
