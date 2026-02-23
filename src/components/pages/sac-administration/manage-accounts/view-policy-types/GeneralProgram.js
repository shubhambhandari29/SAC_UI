import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Modal from "../../../../ui/Modal";
import ReportRecipientList from "../ReportRecipientList";

export default function GeneralProgram({ isEnabled }) {
  const { control, getValues } = useFormContext();
  const [viewRecipientsList, setViewRecipientsList] = useState(false);

  return (
    <Grid container spacing={2}>
      {/*Modal for recipients list  */}
      <Modal
        open={viewRecipientsList}
        onClose={() => setViewRecipientsList(false)}
        title="Affinity Policy Type Report Distribution Scheduler"
        maxWidth="lg"
      >
        <ReportRecipientList
          url="/policy_type_distribution_affinity/"
          parameter={{ ProgramName: getValues("ProgramName") }}
        />
      </Modal>
      <Grid size={{ xs: 12, md: 4 }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          disabled={!isEnabled("ReportRecipientBtn")}
          onClick={() => setViewRecipientsList(true)}
        >
          Report Recipients
        </Button>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <Controller
          name="PolicyNotes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Affinity Program Notes"
              multiline
              rows={10}
              disabled={!isEnabled("PolicyNotes")}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
