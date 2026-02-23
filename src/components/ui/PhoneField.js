import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const formatPhoneNumber = (value, isMobile) => {
  if (!value) return value;

  const digits = value.replace(/\D/g, "");

  if (isMobile) {
    if (digits.length <= 3) {
      return `(${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6,
        10,
      )}`;
    }
  } else {
    if (digits.length <= 3) {
      return `(${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length <= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6,
        10,
      )} Ext. ${digits.slice(10, 17)}`;
    }
  }
};

export default function PhoneField({
  name,
  control,
  label,
  sx,
  slotProps,
  disabled = false,
  isMobile = false,
}) {
  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      rules={{
        validate: (value) => {
          if (!value) return true;
          const digits = value.replace(/\D/g, "");
          if (isMobile) {
            if (digits.length !== 10) {
              return "Mobile number must be exactly 10 digits";
            }
          } else {
            if (digits.length < 10) {
              return "Phone number should have at least 10 digits";
            }
          }
          return true;
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
          helperText={error ? error.message : ""}
          value={field.value ?? ""}
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const rawInput = e.target.value.replace(/\D/g, "");
            const maxDigits = isMobile ? 10 : 17;
            const cleanDigits = rawInput.slice(0, maxDigits);
            const formatted = formatPhoneNumber(cleanDigits, isMobile);
            field.onChange(formatted);
          }}
        />
      )}
    />
  );
}
