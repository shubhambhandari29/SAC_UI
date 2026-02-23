import { Box } from "@mui/material";

export default function BorderedContainer({ title, children }) {
  return (
    <Box
      component="fieldset"
      sx={{
        border: "1px solid gray",
        borderRadius: "15px",
        p: "15px 15px",
      }}
    >
      <legend
        style={{
          padding: "0 8px",
          fontSize: "12px",
          color: "black",
          margin: "0 auto",
        }}
      >
        {title}
      </legend>
      {children}
    </Box>
  );
}
