import { Typography } from "@mui/material";

export default function Body2({ text, size, sx }) {
  return (
    <Typography
      variant="h5"
      sx={{
        fontSize: size || 15,
        fontWeight: size ? 700 : 500,
        color: "blue",
        ...sx,
      }}
    >
      {text || "\u00a0"}
    </Typography>
  );
}
