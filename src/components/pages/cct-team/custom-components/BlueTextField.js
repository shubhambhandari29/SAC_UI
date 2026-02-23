import { TextField } from "@mui/material";

export default function BlueTextField({ sx, ...rest }) {
  return (
    <TextField
      {...rest}
      sx={{ "& .MuiInputBase-input": { color: "blue" }, ...sx }}
      slotProps={{ input: { readOnly: true } }}
      fullWidth
      aria-readonly
    />
  );
}
