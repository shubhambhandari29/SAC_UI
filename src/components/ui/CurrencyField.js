import { Controller } from "react-hook-form";
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

const formatCurrency = (val, useDecimals) => {
  if (!val) return "";

  if (useDecimals) {
    const num = parseFloat(val.toString().replace(/,/g, ""));
    if (!isNaN(num)) {
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }

  if (val.toString().endsWith(".")) return val;
  const parts = val.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export default function CurrencyField({
  name,
  control,
  label,
  sx,
  disabled = false,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          disabled={disabled}
          sx={sx}
          value={formatCurrency(field.value?.toString() ?? "", !isFocused)}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            field.onBlur(e);
            if (field.value) {
              const raw = field.value.toString().replace(/,/g, "");
              const num = parseFloat(raw);
              if (!isNaN(num)) {
                field.onChange(num.toFixed(2));
              }
            }
          }}
          slotProps={{
            input: {
              startAdornment:
                field.value !== "" &&
                field.value !== null &&
                field.value !== undefined ? (
                  <InputAdornment position="start">$</InputAdornment>
                ) : null,
            },
          }}
          onChange={(e) => {
            let raw = e.target.value.replace(/,/g, "");
            if (!/^\d*\.?\d*$/.test(raw)) return;

            if (raw.includes(".")) {
              const [int, dec] = raw.split(".");
              if (dec && dec.length > 2) raw = `${int}.${dec.slice(0, 2)}`;
            }
            field.onChange(raw);
          }}
        />
      )}
    />
  );
}
