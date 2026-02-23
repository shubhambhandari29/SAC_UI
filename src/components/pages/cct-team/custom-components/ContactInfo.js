import React from "react";
import { Box } from "@mui/material";
import Body2 from "./Body2";

export default function ContactInfo({ data, sx }) {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "max-content auto",
        columnGap: 1.5,
        rowGap: 1,
        alignItems: "baseline",
        px: 2,
        width: "fit-content",
        ...sx,
      }}
    >
      {Object.entries(data).map(([key, value]) => (
        <React.Fragment key={key}>
          <Body2 text={key + ":"} sx={{ textAlign: "right", color: "black" }} />
          <Box sx={{ textAlign: "left" }}>
            <Body2 text={value} />
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
}
