import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { LuUndo } from "react-icons/lu";
import UpdateAllBtn from "./UpdateAllBtn";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CctInstructionsOther({ isEnabled }) {
  const { control, setValue, getValues } = useFormContext();
  const { pathname } = useLocation();
  const [accLocId, setAccLocId] = useState("");
  const [pmsUnit, setPmsUnit] = useState("");
  const [isAddlDocs, setIsAddlDocs] = useState("");

  useEffect(() => {
    setAccLocId(getValues("AcctLocID"));
    setPmsUnit(getValues("PMSUnit"));
    setIsAddlDocs(getValues("AddLDocs"));
  }, [getValues]);

  const handleAccountLocationId = (e) => {
    setValue("AcctLocID", e.target.value);
    setAccLocId(e.target.value);

    if (e.target.value === "1")
      setValue("AcctLocNotes", "Use Desktop Shortcut");
    if (e.target.value === "2") setValue("AcctLocNotes", "");
    if (e.target.value === "3") setValue("AcctLocNotes", "None");
  };

  const handlePmsUnit = (e) => {
    setValue("PMSUnit", e.target.value);
    setPmsUnit(e.target.value);

    if (e.target.value === "1")
      setValue("PMSUnitNotes", "Use Desktop Shortcut");
    if (e.target.value === "2") setValue("PMSUnitNotes", "");
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid size={6}>
        <FormControl fullWidth>
          <InputLabel>Are there any additional documents to attach?</InputLabel>
          <Controller
            name="AddLDocs"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Are there any additional documents to attach?"
                disabled={!isEnabled("AddLDocs")}
                onChange={(e) => {
                  setValue("AddLDocs", e.target.value);
                  setIsAddlDocs(e.target.value);
                }}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={6} textAlign="center">
        {(accLocId === "1" || pmsUnit === "1" || isAddlDocs === "Yes") && (
          <Link
            to="/\\DFS01\HARED\WOR) (X:) Claims\Special Accounts Claims\Location Lists-All\CCT Pilot Location Lists"
            target="_blank"
            rel="noopener noreferrer"
          >
            Network Drive Folder
          </Link>
        )}
      </Grid>

      <Grid
        container
        spacing={2}
        size={6}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FormLabel id="AcctLocID" sx={{ color: "black", textAlign: "center" }}>
          Account <br /> Location ID:
        </FormLabel>
        <Controller
          name="AcctLocID"
          control={control}
          render={({ field }) => (
            <RadioGroup
              row
              {...field}
              sx={{
                border: "1px solid lightgrey",
                borderRadius: "15px",
                pl: 0.5,
              }}
              onChange={handleAccountLocationId}
            >
              <FormControlLabel
                value="1"
                control={<Radio disabled={!isEnabled("AcctValetCov")} />}
                label="Use Desktop Shortcut"
              />
              <FormControlLabel
                value="2"
                control={<Radio disabled={!isEnabled("AcctValetCov")} />}
                label="See Notes"
              />
              <FormControlLabel
                value="3"
                control={<Radio disabled={!isEnabled("AcctValetCov")} />}
                label="None"
              />
            </RadioGroup>
          )}
        />
        <Button
          type="button"
          variant="text"
          sx={{
            minWidth: "unset",
            padding: "0px",
          }}
          onClick={() => {
            setValue("AcctLocID", undefined);
            setValue("AcctLocNotes", "");
            setAccLocId("");
          }}
          disabled={!isEnabled("AcctValetCov")}
        >
          <LuUndo size={24} style={{ padding: "0px" }} />
        </Button>
      </Grid>
      <Grid
        container
        spacing={2}
        size={6}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <FormLabel id="PMSUnit" sx={{ color: "black", textAlign: "center" }}>
          PMS <br /> Unit:
        </FormLabel>
        <Controller
          name="PMSUnit"
          control={control}
          render={({ field }) => (
            <RadioGroup
              row
              {...field}
              sx={{
                border: "1px solid lightgrey",
                borderRadius: "15px",
                pl: 0.5,
              }}
              onChange={handlePmsUnit}
            >
              <FormControlLabel
                value="1"
                control={<Radio disabled={!isEnabled("PMSUnit")} />}
                label="Use Desktop Shortcut"
              />
              <FormControlLabel
                value="2"
                control={<Radio disabled={!isEnabled("PMSUnit")} />}
                label="See Notes"
              />
            </RadioGroup>
          )}
        />
        <Button
          type="button"
          variant="text"
          sx={{
            minWidth: "unset",
            padding: "0px",
          }}
          onClick={() => {
            setValue("PMSUnit", undefined);
            setValue("PMSUnitNotes", "");
            setPmsUnit("");
          }}
          disabled={!isEnabled("PMSUnit")}
        >
          <LuUndo size={24} style={{ padding: "0px" }} />
        </Button>
      </Grid>

      <Grid size={6}>
        <Controller
          name="AcctLocNotes"
          control={control}
          disabled={!isEnabled("AcctLocNotes")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Account Location Notes"
              multiline
              rows={3}
            />
          )}
        />
      </Grid>
      <Grid size={6}>
        <Controller
          name="PMSUnitNotes"
          control={control}
          disabled={!isEnabled("PMSUnitNotes")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="PMS Unit Notes"
              multiline
              rows={3}
            />
          )}
        />
      </Grid>

      <Grid size={pathname.includes("create-new-policy") ? 12 : 11.3}>
        <Controller
          name="CCTOtherNotes"
          control={control}
          disabled={!isEnabled("CCTOtherNotes")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Other Additional Instructions"
              multiline
              rows={3}
            />
          )}
        />
      </Grid>
      {pathname.includes("view-policy") && (
        <Grid size={0.7}>
          <UpdateAllBtn
            disabled={!isEnabled("CCTOtherNotes")}
            fieldName="UnderwriterName"
          />
        </Grid>
      )}
    </Grid>
  );
}
