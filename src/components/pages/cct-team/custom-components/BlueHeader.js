import { Typography } from "@mui/material";

export default function BlueHeader({ title }) {
  return (
    <Typography
      variant="h6"
      sx={{
        bgcolor: "background.blue",
        color: "white",
        textAlign: "center",
        width: "100%",
        py: 0.5,
        fontWeight: 600,
      }}
    >
      {title}
    </Typography>
  );
}
