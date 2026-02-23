import { Box, Button, Grid, TextField, useTheme } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";
import UpdateAllBtn from "./UpdateAllBtn";
import PhoneField from "../../../../ui/PhoneField";
import EmailField from "../../../../ui/EmailField";
import Loader from "../../../../ui/Loader";
import { useState } from "react";
import api from "../../../../../api/api";
import Swal from "sweetalert2";

const CustomContainer = ({ children, forButton }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: forButton ? "column" : "row",
        gap: 1,
        alignItems: "center",
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
};

export default function InsuredContacts({ isEnabled, disableForDirector }) {
  const { control, getValues, setValue } = useFormContext();
  const { pathname } = useLocation();
  const [loading, setLoading] = useState("");
  const theme = useTheme();

  const handleRecipientList = async (from) => {
    const prefix = from.includes("sac") ? "Insured" : "Adjuster";
    const suffix = from.includes("primary") ? "1" : "2";

    if (from === "primary" && !getValues(`${prefix}EMail${suffix}`)) {
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
      !getValues(`${prefix}Contact${suffix}`) ||
      getValues(`${prefix}Contact${suffix}`).toLowerCase() === "n/a"
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
      return;
    }

    const data = [
      {
        CustomerNum: getValues("CustomerNum"),
        RecipCat: "Insured",
        DistVia: "Email",
        AttnTo: getValues(`${prefix}Contact${suffix}`),
        EMailAddress: getValues(`${prefix}EMail${suffix}`),
      },
    ];

    setLoading(from + "_recipient");
    try {
      await Promise.all([
        api.post("/loss_run_distribution/upsert", data),
        api.post("/claim_review_distribution/upsert", data),
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

  const handleHcmUsers = async (from) => {
    const prefix = from.includes("sac") ? "Insured" : "Adjuster";
    const suffix = from.includes("primary") ? "1" : "2";

    if (!getValues(`${prefix}EMail${suffix}`)) {
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
      !getValues(`${prefix}Contact${suffix}`) ||
      getValues(`${prefix}Contact${suffix}`).toLowerCase() === "n/a"
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
      return;
    }

    const data = [
      {
        CustomerNum: getValues("CustomerNum"),
        UserName: getValues(`${prefix}Contact${suffix}`),
        UserTitle: getValues(`${prefix}Title${suffix}`),
        UserEmail: getValues(`${prefix}EMail${suffix}`),
        TelNum: getValues(`${prefix}Phone${suffix}`),
      },
    ];

    setLoading(from + "_hcm");
    try {
      await api.post("/hcm_users/upsert", data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Some error occoured, unable to add data to HCM Users",
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

  const handleCopy = () => {
    setValue("AdjusterContact1", getValues("InsuredContact1"));
    setValue("AdjusterTitle1", getValues("InsuredTitle1"));
    setValue("AdjusterPhone1", getValues("InsuredPhone1"));
    setValue("AdjusterCell1", getValues("InsuredCell1"));
    setValue("AdjusterEMail1", getValues("InsuredEMail1"));
    setValue("AdjusterContact2", getValues("InsuredContact2"));
    setValue("AdjusterTitle2", getValues("InsuredTitle2"));
    setValue("AdjusterPhone2", getValues("InsuredPhone2"));
    setValue("AdjusterCell2", getValues("InsuredCell2"));
    setValue("AdjusterEMail2", getValues("InsuredEMail2"));
  };

  return (
    <Grid container spacing={2}>
      <Grid container spacing={1} size={{ xs: 12, md: 8 }}>
        <Grid
          container
          spacing={1}
          size={{ xs: 12, md: 6 }}
          flexDirection="column"
          alignItems="center"
          sx={{ border: "2px solid lightgrey", borderRadius: "15px" }}
        >
          <Grid
            size={12}
            sx={{
              borderBottom: "2px solid lightgrey",
              textAlign: "center",
              borderRadius: "5px 5px 0px 0px",
              py: 0.5,
            }}
          >
            SAC Primary
          </Grid>

          <Grid container spacing={1} size={11}>
            <CustomContainer>
              <Controller
                name="InsuredContact1"
                control={control}
                disabled={!isEnabled("InsuredContact1")}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Contact" />
                )}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("InsuredContact1") || disableForDirector}
                  fieldName="InsuredContact1"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <Controller
                name="InsuredTitle1"
                control={control}
                disabled={!isEnabled("InsuredTitle1")}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Title" />
                )}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("InsuredTitle1") || disableForDirector}
                  fieldName="InsuredTitle1"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <PhoneField
                name="InsuredPhone1"
                label="Work Tel #"
                control={control}
                disabled={!isEnabled("InsuredPhone1")}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("InsuredPhone1") || disableForDirector}
                  fieldName="InsuredPhone1"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <PhoneField
                name="InsuredCell1"
                label="Mobile #"
                control={control}
                disabled={!isEnabled("InsuredCell1")}
                isMobile={true}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("InsuredCell1") || disableForDirector}
                  fieldName="InsuredCell1"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <EmailField
                name="InsuredEMail1"
                label="E-Mail"
                control={control}
                disabled={!isEnabled("InsuredEMail1")}
                sx={{ mb: 1 }}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("InsuredEMail1") || disableForDirector}
                  fieldName="InsuredEMail1"
                />
              )}
            </CustomContainer>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={1}
          size={{ xs: 12, md: 6 }}
          flexDirection="column"
          alignItems="center"
          sx={{ border: "2px solid lightgrey", borderRadius: "15px" }}
        >
          <Grid
            size={12}
            sx={{
              borderBottom: "2px solid lightgrey",
              textAlign: "center",
              borderRadius: "5px 5px 0px 0px",
              py: 0.5,
            }}
          >
            SAC Secondary
          </Grid>

          <Grid container spacing={1} size={11}>
            <CustomContainer>
              <Controller
                name="InsuredContact2"
                control={control}
                disabled={!isEnabled("InsuredContact2")}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Contact" />
                )}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("InsuredContact2") || disableForDirector}
                  fieldName="InsuredContact2"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <Controller
                name="InsuredTitle2"
                control={control}
                disabled={!isEnabled("InsuredTitle2")}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Title" />
                )}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("InsuredTitle2") || disableForDirector}
                  fieldName="InsuredTitle2"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <PhoneField
                name="InsuredPhone2"
                label="Work Tel #"
                control={control}
                disabled={!isEnabled("InsuredPhone2")}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("InsuredPhone2") || disableForDirector}
                  fieldName="InsuredPhone2"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <PhoneField
                name="InsuredCell2"
                label="Mobile #"
                control={control}
                disabled={!isEnabled("InsuredCell2")}
                isMobile={true}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("InsuredCell2") || disableForDirector}
                  fieldName="InsuredCell2"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <EmailField
                name="InsuredEMail2"
                label="E-Mail"
                control={control}
                disabled={!isEnabled("InsuredEMail2")}
                sx={{ mb: 1 }}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("InsuredEMail2") || disableForDirector}
                  fieldName="InsuredEMail2"
                />
              )}
            </CustomContainer>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomContainer forButton={true}>
            <Button
              name="SendToRecipient"
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => handleRecipientList("sac_primary")}
              disabled={
                loading === "sac_primary_recipient" ||
                !isEnabled("SendToRecipient") ||
                disableForDirector
              }
            >
              {loading === "sac_primary_recipient" ? (
                <Loader size={20} height="25px" />
              ) : (
                "Send to Recipient List"
              )}
            </Button>

            <Button
              name="SendToHCMUsers"
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => handleHcmUsers("sac_primary")}
              disabled={
                loading === "sac_primary_hcm" ||
                !isEnabled("SendToHCMUsers") ||
                disableForDirector
              }
            >
              {loading === "sac_primary_hcm" ? (
                <Loader size={20} height="25px" />
              ) : (
                "Send to HCM Users"
              )}
            </Button>
          </CustomContainer>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomContainer forButton={true}>
            <Button
              name="SendToRecipient"
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => handleRecipientList("sac_secondary")}
              disabled={
                loading === "sac_secondary_recipient" ||
                !isEnabled("SendToRecipient") ||
                disableForDirector
              }
            >
              {loading === "sac_secondary_recipient" ? (
                <Loader size={20} height="25px" />
              ) : (
                "Send to Recipient List"
              )}
            </Button>

            <Button
              name="SendToHCMUsers"
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => handleHcmUsers("sac_secondary")}
              disabled={
                loading === "sac_secondary_hcm" ||
                !isEnabled("SendToHCMUsers") ||
                disableForDirector
              }
            >
              {loading === "sac_secondary_hcm" ? (
                <Loader size={20} height="25px" />
              ) : (
                "Send to HCM Users"
              )}
            </Button>
          </CustomContainer>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Controller
          name="InsuredNotes"
          control={control}
          disabled={!isEnabled("InsuredNotes")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Insured Notes"
              multiline
              rows={16}
            />
          )}
        />
      </Grid>

      <Grid container spacing={1} size={{ xs: 12, md: 8 }}>
        <Grid
          container
          spacing={1}
          size={{ xs: 12, md: 6 }}
          flexDirection="column"
          alignItems="center"
          sx={{ border: "2px solid lightgrey", borderRadius: "15px" }}
        >
          <Grid
            size={12}
            sx={{
              borderBottom: "2px solid lightgrey",
              textAlign: "center",
              borderRadius: "5px 5px 0px 0px",
              py: 0.5,
            }}
          >
            Adjuster Primary
          </Grid>

          <Grid container spacing={1} size={11}>
            <CustomContainer>
              <Controller
                name="AdjusterContact1"
                control={control}
                disabled={!isEnabled("AdjusterContact1")}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contact"
                    value={field.value ?? ""}
                  />
                )}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={
                    !isEnabled("AdjusterContact1") || disableForDirector
                  }
                  fieldName="AdjusterContact1"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <Controller
                name="AdjusterTitle1"
                control={control}
                disabled={!isEnabled("AdjusterTitle1")}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Title"
                    value={field.value ?? ""}
                  />
                )}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("AdjusterTitle1") || disableForDirector}
                  fieldName="AdjusterTitle1"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <PhoneField
                name="AdjusterPhone1"
                label="Work Tel #"
                control={control}
                disabled={!isEnabled("AdjusterPhone1")}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("AdjusterPhone1") || disableForDirector}
                  fieldName="AdjusterPhone1"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <PhoneField
                name="AdjusterCell1"
                label="Mobile #"
                control={control}
                disabled={!isEnabled("AdjusterCell1")}
                isMobile={true}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("AdjusterCell1") || disableForDirector}
                  fieldName="AdjusterCell1"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <EmailField
                name="AdjusterEMail1"
                label="E-Mail"
                control={control}
                disabled={!isEnabled("AdjusterEMail1")}
                sx={{ mb: 1 }}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("AdjusterEMail1") || disableForDirector}
                  fieldName="AdjusterEMail1"
                />
              )}
            </CustomContainer>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={1}
          size={{ xs: 12, md: 6 }}
          flexDirection="column"
          alignItems="center"
          sx={{ border: "2px solid lightgrey", borderRadius: "15px" }}
        >
          <Grid
            size={12}
            sx={{
              borderBottom: "2px solid lightgrey",
              textAlign: "center",
              borderRadius: "5px 5px 0px 0px",
              py: 0.5,
            }}
          >
            Adjuster Secondary
          </Grid>

          <Grid container spacing={1} size={11}>
            <CustomContainer>
              <Controller
                name="AdjusterContact2"
                control={control}
                disabled={!isEnabled("AdjusterContact2")}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contact"
                    value={field.value ?? ""}
                  />
                )}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={
                    !isEnabled("AdjusterContact2") || disableForDirector
                  }
                  fieldName="AdjusterContact2"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <Controller
                name="AdjusterTitle2"
                control={control}
                disabled={!isEnabled("AdjusterTitle2")}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Title"
                    value={field.value ?? ""}
                  />
                )}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("AdjusterTitle2") || disableForDirector}
                  fieldName="AdjusterTitle2"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <PhoneField
                name="AdjusterPhone2"
                label="Work Tel #"
                control={control}
                disabled={!isEnabled("AdjusterPhone2")}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("AdjusterPhone2") || disableForDirector}
                  fieldName="AdjusterPhone2"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <PhoneField
                name="AdjusterCell2"
                label="Mobile #"
                control={control}
                disabled={!isEnabled("AdjusterCell2")}
                isMobile={true}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("AdjusterCell2") || disableForDirector}
                  fieldName="AdjusterCell2"
                />
              )}
            </CustomContainer>

            <CustomContainer>
              <EmailField
                name="AdjusterEMail2"
                label="E-Mail"
                control={control}
                disabled={!isEnabled("AdjusterEMail2")}
                sx={{ mb: 1 }}
              />
              {pathname.includes("view-policy") && (
                <UpdateAllBtn
                  disabled={!isEnabled("AdjusterEMail2") || disableForDirector}
                  fieldName="AdjusterEMail2"
                />
              )}
            </CustomContainer>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomContainer forButton={true}>
            <Button
              name="SendToRecipient"
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => handleRecipientList("adjuster_primary")}
              disabled={
                loading === "adjuster_primary_recipient" ||
                !isEnabled("SendToRecipient") ||
                disableForDirector
              }
            >
              {loading === "adjuster_primary_recipient" ? (
                <Loader size={20} height="25px" />
              ) : (
                "Send to Recipient List"
              )}
            </Button>

            <Button
              name="SendToHCMUsers"
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => handleHcmUsers("adjuster_primary")}
              disabled={
                loading === "adjuster_primary_hcm" ||
                !isEnabled("SendToHCMUsers") ||
                disableForDirector
              }
            >
              {loading === "adjuster_primary_hcm" ? (
                <Loader size={20} height="25px" />
              ) : (
                "Send to HCM Users"
              )}
            </Button>
          </CustomContainer>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomContainer forButton={true}>
            <Button
              name="SendToRecipient"
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => handleRecipientList("adjuster_secondary")}
              disabled={
                loading === "adjuster_secondary_recipient" ||
                !isEnabled("SendToRecipient") ||
                disableForDirector
              }
            >
              {loading === "adjuster_secondary_recipient" ? (
                <Loader size={20} height="25px" />
              ) : (
                "Send to Recipient List"
              )}
            </Button>

            <Button
              name="SendToHCMUsers"
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => handleHcmUsers("adjuster_secondary")}
              disabled={
                loading === "adjuster_secondary_hcm" ||
                !isEnabled("SendToHCMUsers") ||
                disableForDirector
              }
            >
              {loading === "adjuster_secondary_hcm" ? (
                <Loader size={20} height="25px" />
              ) : (
                "Send to HCM Users"
              )}
            </Button>
          </CustomContainer>
        </Grid>
      </Grid>

      <Grid size={4}>
        <Button
          name="CopySacToAdjuster"
          type="button"
          variant="outlined"
          fullWidth
          disabled={!isEnabled("CopySacToAdjuster") || disableForDirector}
          onClick={handleCopy}
        >
          Copy SAC to Adjuster
        </Button>
      </Grid>
    </Grid>
  );
}
