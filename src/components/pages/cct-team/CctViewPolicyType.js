import { Box, Button, Grid, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import api from "../../../api/api";
import Loader from "../../ui/Loader";
import BlueHeaderContainer from "./custom-components/BlueHeaderContainer";
import UnderlinedHeading from "./custom-components/UnderlinedHeading";
import Body2 from "./custom-components/Body2";
import BlueTextField from "./custom-components/BlueTextField";
import Note from "./custom-components/Note";
import Swal from "sweetalert2";
import ContactInfo from "./custom-components/ContactInfo";
import Modal from "../../ui/Modal";
import RptInstructionsAffinViewer from "../print-pages/RptInstructionsAffinViewer";

const columnContainerStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default function CctViewPolicyType() {
  const [searchParams] = useSearchParams();
  const { column_name } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [affinityData, setAffinityData] = useState(null);
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const from = state?.from || "/pending-items";
  const theme = useTheme();
  const [openAdjusterInstructions, setOpenAdjusterInstructions] =
    useState(false);

  useEffect(() => {
    if (!column_name) return;

    const fetchData = async (searchByColumn, value) => {
      try {
        setLoading(true);
        const [resPolicy, resAgent, resAffinity] = await Promise.all([
          api.get("/affinity_policy_types/", {
            params: { [searchByColumn]: value },
          }),
          api.get("/affinity_agents/", {
            params: { ProgramName: searchParams.get("ProgramName") },
          }),
          api.get("/affinity_program/", {
            params: { ProgramName: searchParams.get("ProgramName") },
          }),
        ]);

        //replacing all null values with empty string
        let data = Object.fromEntries(
          Object.entries(resPolicy.data[0]).map(([k, v]) => [
            k,
            v === null ? "" : v,
          ]),
        );

        let affinityData = Object.fromEntries(
          Object.entries(resAffinity.data[0]).map(([k, v]) => [
            k,
            v === null ? "" : v,
          ]),
        );

        if (resAgent.data.length > 0) {
          affinityData["NonPrimaryAgentCodes"] = "";
          resAgent.data.forEach((i) => {
            if (i.PrimaryAgt === "Yes")
              affinityData = { ...affinityData, ...i };
            else
              affinityData.NonPrimaryAgentCodes +=
                (affinityData.NonPrimaryAgentCodes ? ", " : "") + i.AgentCode;
          });
        }

        setData(data);
        setAffinityData(affinityData);
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: "Some error occoured, unable to load data",
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
        setLoading(false);
      }
    };

    const [key, value] = column_name.split("=");
    fetchData(key, value);
  }, [column_name, searchParams, theme.palette.error.main]);

  if (loading) return <Loader size={40} height="800px" />;

  return (
    <Box
      sx={{
        backgroundColor: "background.yellow",
        py: 2,
        height: "calc(100vh - 100px)",
        overflowY: "auto",
        border: "1px solid lightgrey",
      }}
    >
      <Modal
        open={openAdjusterInstructions}
        onClose={() => setOpenAdjusterInstructions(false)}
        maxWidth="lg"
      >
        <RptInstructionsAffinViewer
          data={data}
          affinityData={affinityData}
          type="Adjuster"
        />
      </Modal>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          aligs: "center",
          gap: 2,
          pb: 2,
          px: 2,
        }}
      >
        <Box>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mr: 2 }}
            onClick={() => setOpenAdjusterInstructions(true)}
          >
            Print Adjuster Instructions
          </Button>
        </Box>
        <Box>
          <Button
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={() => navigate("/pending-items", { replace: true })}
          >
            Return to Main Menu
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() =>
              navigate(from, { state: { from: pathname }, replace: true })
            }
          >
            Back
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <BlueHeaderContainer title="Affinity Program Details">
          <Grid size={8} sx={{ textAlign: "center" }}>
            <UnderlinedHeading text="Program Name" />
            <Body2 text={data?.ProgramName} size={18} sx={{ color: "black" }} />
          </Grid>
          <Grid size={4} sx={{ textAlign: "center" }}>
            <UnderlinedHeading text="Program Policy Type" />
            <Body2 text={data?.PolicyType} size={18} sx={{ color: "black" }} />
          </Grid>

          <Grid size={4}>
            <UnderlinedHeading text="Underwriter" />
            <Body2 text={data?.UnderwriterName} sx={{ fontWeight: 700 }} />
          </Grid>
          <Grid size={4}>
            <UnderlinedHeading text="Affinity Status" />
            <Body2 text={data?.PolicyStatus} sx={{ fontWeight: 700 }} />
          </Grid>
          <Grid size={4}>
            <UnderlinedHeading text="Affinity Business Status" />
            <Body2 text={data?.PolicyBusinessType} sx={{ fontWeight: 700 }} />
          </Grid>
        </BlueHeaderContainer>

        <BlueHeaderContainer title="Primary Agent Contacts">
          <Grid
            size={3.5}
            sx={{
              ...columnContainerStyles,
              gap: 1,
            }}
          >
            <Grid textAlign="center">
              <UnderlinedHeading text="Primary Agent Name:" />
              <Body2 text={affinityData?.AgentName} sx={{ fontWeight: 700 }} />
            </Grid>

            <Grid textAlign="center">
              <UnderlinedHeading text="Primary Producer Code:" />
              <Body2 text={affinityData?.AgentCode} sx={{ fontWeight: 700 }} />
            </Grid>

            <Grid textAlign="center">
              <UnderlinedHeading text="Segmentation:" />
              <Body2 text={affinityData?.AgentSegment} />
            </Grid>
          </Grid>

          <Grid size={3.2} sx={columnContainerStyles}>
            <UnderlinedHeading text="Primary Contact" />
            <ContactInfo
              data={{
                Name: affinityData?.AgentContact1,
                "Tel #": affinityData?.WorkTel1,
                "Cell #": affinityData?.AgentCell1,
                "E-Mail": affinityData?.Email1,
              }}
              sx={{ py: 1 }}
            />
          </Grid>

          <Grid size={3.2} sx={columnContainerStyles}>
            <UnderlinedHeading text="Secondary Contact" />
            <ContactInfo
              data={{
                Name: affinityData?.AgentContact2,
                "Tel #": affinityData?.WorkTel2,
                "Cell #": affinityData?.AgentCell2,
                "E-Mail": affinityData?.Email2,
              }}
              sx={{ py: 1 }}
            />
          </Grid>

          <Grid size={2.1} sx={{ textAlign: "center" }}>
            <Body2
              text="Non-Primary Producer Codes:"
              sx={{ color: "black", mb: 1 }}
            />
            <BlueTextField
              value={affinityData?.NonPrimaryAgentCodes}
              multiline
              rows={5}
            />
          </Grid>
        </BlueHeaderContainer>

        <BlueHeaderContainer title="Insured Contacts">
          <Grid size={4} sx={columnContainerStyles}>
            <UnderlinedHeading text="Primary Contact" />
            <ContactInfo
              data={{
                Name: data?.InsuredContact1,
                "Tel #": data?.InsuredPhone1,
                "Cell #": data?.InsuredCell1,
                "E-Mail": data?.InsuredEMail1,
              }}
              sx={{ py: 1 }}
            />
          </Grid>

          <Grid size={4} sx={columnContainerStyles}>
            <UnderlinedHeading text="Secondary Contact" />
            <ContactInfo
              data={{
                Name: data?.InsuredContact2,
                "Tel #": data?.InsuredPhone2,
                "Cell #": data?.InsuredCell2,
                "E-Mail": data?.InsuredEMail2,
              }}
              sx={{ py: 1 }}
            />
          </Grid>

          <Grid size={4}>
            <BlueTextField
              label="Insured Notes"
              value={data?.InsuredNotes}
              multiline
              rows={7}
            />
          </Grid>
        </BlueHeaderContainer>

        <BlueHeaderContainer title="CCT Instructions">
          <Grid size={12} sx={{ display: "flex", direction: "row", gap: 1 }}>
            <Body2
              text="Unverified Manual:"
              sx={{ display: "flex", justifyContent: "end", color: "black" }}
            />
            <Grid sx={{ flex: 1 }}>
              <Note
                text="Any loss that falls outside of the policy effective dates must be set up as an Unverified Manual Claim."
                sx={{ fontWeight: 500, textDecoration: "underline" }}
              />
              <Note
                text="HCS claims should be entered as unverified/manual. If the policy is new business, you must enter the Mod as 00.  For renewal business, you must enter the renewal Mod (bumping the expired by one and the effective/expiration date by one year)."
                sx={{ fontWeight: 500 }}
              />
            </Grid>
          </Grid>

          {data?.AcctProdClaims === "Yes" && (
            <Grid size={12} sx={{ display: "flex", textAlign: "center" }}>
              <Body2
                text="Accounts with Products Claim:"
                sx={{ color: "black", minWidth: 220 }}
              />
              <Body2
                text="If loss involves the insured's Product of any type, no matter how the loss happened (ie...Food, something they sold, etc...) then you must fill in the Product field. If not given, enter 'Unspecified'."
                size={15}
                sx={{ color: "red" }}
              />
            </Grid>
          )}

          {data?.AcctValetCov === "Yes" && (
            <Grid size={12} sx={{ display: "flex", textAlign: "center" }}>
              <Body2
                text="Accounts with Valet Coverage:"
                sx={{ color: "black", minWidth: 220 }}
              />
              <Body2
                text="If the customer's vehicle is damaged due to a Valet, the customer's vehicle should be flagged as an 'Insured Vehicle', not Third Party.If the VIN is unknown then enter '0VALET' as the VIN #."
                size={15}
                sx={{ color: "red" }}
              />
            </Grid>
          )}

          <Grid
            size={12}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            <Body2
              text="Other Additional Instructions:"
              sx={{ display: "inline", color: "black", width: 120 }}
            />
            <BlueTextField
              value={data?.CCTOtherNotes}
              sx={{ display: "inline", flex: 1 }}
              multiline
              rows={5}
            />
          </Grid>

          {data?.PolicyType === "Workers Compensation" && (
            <Grid size={12} sx={{ textAlign: "center" }}>
              <Body2 text="This is a Workers Comp Policy Type. DO NOT set a feature on this claim." />
            </Grid>
          )}

          {data?.PolicyType === "Umbrella" && (
            <Grid size={12} sx={{ textAlign: "center" }}>
              <Body2 text="This is an Umbrella Policy Type. Please send all claims to Michelle Bond to review prior to opening a claim." />
            </Grid>
          )}

          <Grid size={12} sx={{ textAlign: "center" }}>
            <Body2 text="You must mark the claim as a Special Account and fill out all three loss description fields." />
          </Grid>

          {data?.AddLDocs === "Yes" && (
            <Grid size={12} sx={{ textAlign: "center" }}>
              <Body2
                text="There are documents in the Drive Shortcut in the 1-Cover SHEETS and UPLOADS folder that must be attached to every claim."
                size={15}
                sx={{ color: "red" }}
              />
            </Grid>
          )}

          <Grid
            size={12}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            <Body2
              text="Account Location Notes:"
              sx={{ display: "inline", color: "black", width: 120 }}
            />
            <BlueTextField
              value={data?.AcctLocNotes}
              sx={{ display: "inline", flex: 1 }}
              multiline
              rows={5}
            />
          </Grid>

          <Grid
            size={12}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            <Body2
              text="CCT Special Assignments Instructions:"
              sx={{ display: "inline", color: "black", width: 120 }}
            />
            <BlueTextField
              value={data?.CCTAssgInstruct}
              sx={{ display: "inline", flex: 1 }}
              multiline
              rows={5}
            />
          </Grid>
        </BlueHeaderContainer>
      </Grid>
    </Box>
  );
}
