import { Button, Grid, TextField, useTheme } from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import api from "../../../../../api/api";
import Loader from "../../../../ui/Loader";
import PhoneField from "../../../../ui/PhoneField";
import EmailField from "../../../../ui/EmailField";
import Swal from "sweetalert2";

export default function InsuredContacts({ isEnabled, disableForDirector }) {
  const { control, getValues } = useFormContext();
  const [loading, setLoading] = useState("");
  const theme = useTheme();

  const handleRecipientList = async (from) => {
    if (
      (from === "primary" && !getValues("InsuredEMail1")) ||
      (from === "secondary" && !getValues("InsuredEMail2"))
    ) {
      Swal.fire({
        title: "Data Validation Error",
        text: "Invalid entry email",
        icon: "error",
        confirmButtonText: "OK",
        iconColor: theme.palette.error.main,
        customClass: {
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
        buttonsStyling: false,
      });
      return;
    }

    if (
      (from === "primary" &&
        (!getValues("InsuredContact1") ||
          getValues("InsuredContact1").toLowerCase() === "n/a")) ||
      (from === "secondary" &&
        (!getValues("InsuredContact2") ||
          getValues("InsuredContact2").toLowerCase() === "n/a"))
    ) {
      Swal.fire({
        title: "Data Validation Error",
        text: "Invalid entry name",
        icon: "error",
        confirmButtonText: "OK",
        iconColor: theme.palette.error.main,
        customClass: {
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
        buttonsStyling: false,
      });
    }

    const data = [
      {
        ProgramName: getValues("ProgramName"),
        RecipCat: "Insured",
        DistVia: "Email",
        AttnTo: getValues(
          from === "primary" ? "InsuredContact1" : "InsuredContact2",
        ),
        EMailAddress: getValues(
          from === "primary" ? "InsuredEMail1" : "InsuredEMail2",
        ),
      },
    ];

    setLoading(from);
    try {
      await Promise.all([
        api.post("/loss_run_distribution_affinity/upsert", data),
        api.post("/claim_review_distribution_affinity/upsert", data),
      ]);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Some error occoured, unable to add data to Recipient Lists",
        icon: "error",
        confirmButtonText: "OK",
        iconColor: theme.palette.error.main,
        customClass: {
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
        buttonsStyling: false,
      });
    } finally {
      setLoading("");
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid
        container
        spacing={1}
        size={{ xs: 12, md: 4 }}
        flexDirection="column"
        alignItems="center"
        sx={{ border: "2px solid lightgrey", borderRadius: "15px" }}
      >
        <Grid
          size={12}
          pt="5px"
          pb="5px"
          sx={{
            borderBottom: "2px solid lightgrey",
            textAlign: "center",
            borderRadius: "5px 5px 0px 0px",
          }}
        >
          Primary Insured Contact
        </Grid>

        <Grid container spacing={1} size={11}>
          <Controller
            name="InsuredContact1"
            control={control}
            disabled={!isEnabled("InsuredContact1")}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Contact" />
            )}
          />
          <PhoneField
            name="InsuredPhone1"
            label="Work Tel #"
            control={control}
            disabled={!isEnabled("InsuredPhone1")}
          />
          <PhoneField
            name="InsuredCell1"
            label="Mobile #"
            control={control}
            disabled={!isEnabled("InsuredCell1")}
            isMobile={true}
          />
          <EmailField
            name="InsuredEMail1"
            label="E-Mail"
            control={control}
            disabled={!isEnabled("InsuredEMail1")}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={1}
        size={{ xs: 12, md: 4 }}
        flexDirection="column"
        alignItems="center"
        sx={{ border: "2px solid lightgrey", borderRadius: "15px" }}
      >
        <Grid
          size={12}
          pt="5px"
          pb="5px"
          sx={{
            borderBottom: "2px solid lightgrey",
            textAlign: "center",
            borderRadius: "5px 5px 0px 0px",
          }}
        >
          Secondary Insured Contact
        </Grid>

        <Grid container spacing={1} size={11}>
          <Controller
            name="InsuredContact2"
            control={control}
            disabled={!isEnabled("InsuredContact2")}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Contact" />
            )}
          />
          <PhoneField
            name="InsuredPhone2"
            label="Work Tel #"
            control={control}
            disabled={!isEnabled("InsuredPhone2")}
          />
          <PhoneField
            name="InsuredCell2"
            label="Mobile #"
            control={control}
            disabled={!isEnabled("InsuredCell2")}
            isMobile={true}
          />
          <EmailField
            name="InsuredEMail2"
            label="E-Mail"
            control={control}
            disabled={!isEnabled("InsuredEMail2")}
          />
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Controller
          name="InsuredNotes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Insured Notes"
              multiline
              rows={10}
              disabled={!isEnabled("InsuredNotes")}
            />
          )}
        />
      </Grid>

      <Grid size={4}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => handleRecipientList("primary")}
          disabled={
            !isEnabled("SendToRecipient") ||
            loading === "primary" ||
            disableForDirector
          }
        >
          {loading === "primary" ? (
            <Loader size={20} height="25px" />
          ) : (
            "Send Primary Contact to Recipient List"
          )}
        </Button>
      </Grid>

      <Grid size={4}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => handleRecipientList("secondary")}
          disabled={
            !isEnabled("SendToRecipient") ||
            loading === "secondary" ||
            disableForDirector
          }
        >
          {loading === "secondary" ? (
            <Loader size={20} height="25px" />
          ) : (
            "Send Secondary Contact to Recipient List"
          )}
        </Button>
      </Grid>
    </Grid>
  );
}
