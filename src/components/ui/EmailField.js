import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

export default function EmailField({
  name,
  control,
  label,
  sx,
  rules,
  slotProps,
  disabled = false,
}) {
  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      rules={{
        ...rules,
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          message: "Invalid email",
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          sx={sx}
          slotProps={slotProps}
          error={!!error}
          value={field.value ?? ""}
          // helperText={error ? error.message : ""}
          onKeyDown={(e) => e.stopPropagation()}
        />
      )}
    />
  );
}
