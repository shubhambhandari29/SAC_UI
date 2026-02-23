import { StyleSheet } from "@react-pdf/renderer";
import theme from "../../../../theme";

export const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    fontFamily: "Helvetica",
    paddingHorizontal: 30,
    paddingTop: 30,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  pageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 10,
    borderTop: "1px solid #ccc",
    marginVertical: 20,
  },
  footerText: { fontSize: 10, color: "#333", marginBottom: 4 },
  logo: { width: 120 },
  sectionSpacing: { marginBottom: 10 },

  // Custom Component Styles
  greenHeader: {
    backgroundColor: theme.palette.background.green,
    color: "white",
    padding: 4,
    paddingLeft: 8,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  redHeader: {
    backgroundColor: theme.palette.background.red,
    color: "white",
    padding: 5,
    paddingLeft: 8,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  greyHeader: {
    backgroundColor: theme.palette.background.grey,
    color: "black",
    padding: 4,
    paddingLeft: 8,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  yellowHeader: {
    backgroundColor: theme.palette.background.yellow,
    color: "black",
    padding: 4,
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    borderBottom: "1px solid black",
  },

  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  yellowContainerWrapper: { border: "1px solid black", marginBottom: 8 },

  // Grid equivalents (based on 12 col system)
  col12: { width: "100%", paddingHorizontal: 4, paddingVertical: 2 },
  col8: { width: "75%", paddingHorizontal: 4, paddingVertical: 2 },
  col6: { width: "50%", paddingHorizontal: 4, paddingVertical: 2 },
  col4: { width: "33.33%", paddingHorizontal: 4, paddingVertical: 2 },
  col2: { width: "25%", paddingHorizontal: 4, paddingVertical: 2 },

  // Typography
  underlinedHeading: {
    textDecoration: "underline",
    fontFamily: "Helvetica-Bold",
    display: "inline",
  },
  bodyBlue: { color: "blue" },
  bodyBlack: { color: "black" },
  bodyBold: { fontFamily: "Helvetica-Bold" },
  noteRed: {
    color: "red",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    width: "100%",
    marginVertical: 4,
  },

  // Contact Info Table
  contactRow: { flexDirection: "row", marginBottom: 2 },
  contactLabel: {
    width: 65,
    textAlign: "right",
    paddingRight: 5,
    color: "black",
    fontFamily: "Helvetica-Bold",
  },
  contactValue: { flex: 1, color: "blue" },
});
