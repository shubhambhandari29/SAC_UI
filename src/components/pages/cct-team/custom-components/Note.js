import { Typography } from "@mui/material";

export default function Note({ text, sx }) {
  return (
    <Typography
      variant="body"
      sx={{
        display: "block",
        fontSize: 15,
        fontWeight: 600,
        color: "red",
        ...sx,
      }}
    >
      {text}
    </Typography>
  );
}
