import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#003150" },
    text: { primary: "#111111", secondary: "#333333" },
    background: {
      green: "#088819",
      yellow: "#FFFFE7",
      grey: "#c4c2c2",
      red: "red",
      grey2: "#f1f3f9",
      blue: "#1a237e",
      lightBlue: "#EBF0F8",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 650,
      md: 950,
      lg: 1200,
      xl: 1500,
    },
  },
  typography: {
    fontFamily: '"Open Sans", "Roboto", sans-serif',
    fontSize: 12,
    h1: { fontWeight: 900 },
    h6: { fontSize: "0.95rem", fontWeight: 700 },
    body1: { fontWeight: 500, fontSize: "0.8rem" },
    body2: { fontSize: "0.75rem" },
    subtitle1: { fontSize: "0.8rem", fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600, fontSize: "0.75rem" },
    allVariants: { color: "#111111" },
  },
  components: {
    // --- Inputs & Forms ---
    MuiTextField: {
      defaultProps: { size: "small", variant: "outlined", margin: "none" },
      styleOverrides: {
        root: {
          "& .MuiInputBase-root.Mui-disabled": {
            backgroundColor: "#D9D9D9",
            color: "#818181ff",
          },
          "& .MuiFormLabel-root.Mui-disabled": { color: "#818181ff" },
        },
      },
    },

    MuiFormControl: {
      defaultProps: { size: "small", variant: "outlined", margin: "none" },
    },

    MuiSelect: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "&.Mui-disabled": { backgroundColor: "#D9D9D9" },
        },
        select: {
          paddingTop: "0px",
          paddingBottom: "0px",
          height: "30px !important",
          minHeight: "30px !important",
          display: "flex",
          alignItems: "center",
          "&.MuiInputBase-input": {
            paddingRight: "24px",
          },
        },
        icon: {
          top: "calc(50% - 10px)",
          width: "20px",
          height: "20px",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          borderRadius: "25px",
          minHeight: "30px",
          paddingRight: "0px",
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: "#bdbdbd",
            borderWidth: "1px",
          },
          input: {
            padding: "0px 10px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            fontSize: "0.8rem",
            "&::placeholder": { fontSize: "0.8rem" },
          },
          adornedEnd: {
            paddingRight: "4px",
          },
        },
        notchedOutline: {
          "& legend": {
            "& span": {
              paddingRight: "2px",
              paddingLeft: "2px",
            },
          },
        },
      },
    },

    MuiInputLabel: {
      defaultProps: { margin: "dense" },
      styleOverrides: {
        root: {
          color: "grey",
          fontSize: "0.75rem",
          transform: "translate(12px, 7px) scale(1)",
          "&.Mui-focused": { transform: "translate(12px, -7px) scale(0.75)" },
          "&.MuiFormLabel-filled": {
            transform: "translate(12px, -7px) scale(0.75)",
          },
        },
        shrink: { color: "#003150", fontWeight: "600" },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "4px",
          marginLeft: "0px",
          marginRight: "0px",
          width: "28px",
          height: "28px",
          "& svg": {
            width: "18px",
            height: "18px",
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          marginTop: "0px !important",
          marginLeft: "4px",
          marginRight: "0px",
          maxHeight: "30px",
        },
      },
    },

    // --- Buttons ---
    MuiButton: {
      defaultProps: { size: "small", variant: "contained" },
      styleOverrides: {
        root: {
          borderRadius: "25px",
          textTransform: "none",
          fontWeight: 600,
          padding: "4px 16px",
          height: "30px",
          minHeight: "30px",
          boxShadow: "none",
          "&:hover": { boxShadow: "0px 2px 4px rgba(0,0,0,0.15)" },
          "&.Mui-disabled": {
            color: "#818181ff",
            background: "#D9D9D9",
          },
          "&:active": {
            boxShadow: "0px 2px 4px rgba(0,0,0,0.15)",
            transform: "scale(0.98)",
          },
        },
        contained: {
          background:
            "linear-gradient(90deg, hsla(303, 77%, 22%, 1) 0%, hsla(321, 55%, 50%, 1) 100%)",
          color: "white",
        },
        outlined: {
          color: "#640D5F",
          borderColor: "#640D5F",
        },
      },
    },

    // --- RADIO BUTTONS ---
    MuiRadio: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          padding: "4px",
          "& svg": {
            width: "18px",
            height: "18px",
          },
          "&.Mui-checked": {
            color: "#003150",
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: "0px",
          marginRight: "10px",
        },
        label: {
          fontSize: "0.8rem",
          fontWeight: 500,
          color: "#111111",
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": { color: "#818181ff" },
        },
      },
    },

    // --- AUTOCOMPLETE ---
    MuiAutocomplete: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiFormControl-root": { margin: 0 },
        },
        inputRoot: {
          paddingTop: "0px !important",
          paddingBottom: "0px !important",
          paddingLeft: "8px !important",
          minHeight: "30px",
          height: "30px",

          "& .MuiAutocomplete-input": {
            padding: "0px 4px 0px 4px !important",
            height: "100%",
            fontSize: "0.8rem",
          },
        },
        paper: {
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
        },
      },
    },

    // --- Tabs ---
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: "32px" },
        indicator: { display: "none" },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: "32px",
          padding: "4px 12px",
          borderRadius: "50px",
          marginRight: "6px",
          fontSize: "0.75rem",
          textTransform: "none",
          backgroundColor: "#EBF0F8",
          "&.Mui-selected": {
            color: "white",
            background:
              "linear-gradient(90deg, hsla(303, 77%, 22%, 1) 0%, hsla(321, 55%, 50%, 1) 100%)",
          },
        },
      },
    },

    // --- Data Grid (Tables) ---
    MuiDataGrid: {
      defaultProps: {
        density: "compact",
      },
      styleOverrides: {
        root: {
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #e0e0e0",
            minHeight: "40px !important",
            maxHeight: "40px !important",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            fontSize: "0.85rem",
            color: "#003150",
          },
          "& .MuiDataGrid-row": {
            minHeight: "35px !important",
            maxHeight: "35px !important",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "0.8rem",
            minHeight: "35px !important",
            maxHeight: "35px !important",
            paddingTop: "2px",
            paddingBottom: "2px",
          },
        },
      },
    },

    // --- Other ---
    MuiMenu: { styleOverrides: { paper: { borderRadius: "15px" } } },
    MuiPaper: {
      defaultProps: { elevation: 2 },
      styleOverrides: { rounded: { borderRadius: "15px" } },
    },

    // --- Date Picker ---
    MuiDatePicker: {
      defaultProps: {
        format: "MM-DD-YYYY",
        slotProps: {
          textField: {
            variant: "outlined",
            size: "small",
            fullWidth: true,
            sx: {
              "& .MuiPickersOutlinedInput-root": {
                borderRadius: "25px",
                backgroundColor: "white",
                height: "30px",
                px: 1,
              },
              "& .MuiPickersOutlinedInput-root.Mui-disabled": {
                backgroundColor: "#D9D9D9",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#bdbdbd",
                },
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "#818181ff",
              },
            },
          },
        },
      },
    },

    // --- Tooltip ---
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          backgroundColor: "#333333",
          color: "#ffffff",
          fontSize: "0.75rem",
          padding: "4px 8px",
          borderRadius: "15px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        },
        arrow: {
          color: "#333333", // Matches background
        },
      },
    },
  },
});

export default theme;
