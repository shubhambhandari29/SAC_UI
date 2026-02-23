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
import Note from "./custom-components/Note";
import BlueTextField from "./custom-components/BlueTextField";
import Modal from "../../ui/Modal";
import RptInstructionsViewer from "../print-pages/RptInstructionsViewer";
import RptUnderConstructionShiCctViewer from "../print-pages/RptUnderConstructionShiCctViewer";
import Swal from "sweetalert2";
import ContactInfo from "./custom-components/ContactInfo";

const columnContainerStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default function CctViewPolicy() {
  const [searchParams] = useSearchParams();
  const { column_name } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [sacData, setSacData] = useState(null);
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const from = state?.from || "/pending-items";
  const [openAdjusterInstructions, setOpenAdjusterInstructions] =
    useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (!column_name) return;

    const fetchData = async (searchByColumn, value) => {
      try {
        setLoading(true);
        const [resPolicy, resSac] = await Promise.all([
          api.get("/sac_policies/", {
            params: { [searchByColumn]: value },
          }),
          api.get("/sac_account/", {
            params: { CustomerNum: searchParams.get("CustomerNum") },
          }),
        ]);

        //replacing all null values with empty string
        const data = Object.fromEntries(
          Object.entries(resPolicy.data[0]).map(([k, v]) => [
            k,
            v === null ? "" : v,
          ]),
        );

        const sacdata = Object.fromEntries(
          Object.entries(resSac.data[0]).map(([k, v]) => [
            k,
            v === null ? "" : v,
          ]),
        );

        setData(data);
        setSacData(sacdata);
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

  if (loading) return <Loader size={40} height="600px" />;

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
        {["Special Account", "Affinity"].includes(sacData?.BusinessType) ? (
          <RptInstructionsViewer
            data={data}
            sacData={sacData}
            type="Adjuster"
          />
        ) : sacData?.AcctStatus === "Under Construction" ? (
          <RptUnderConstructionShiCctViewer
            data={data}
            sacData={sacData}
            type="Adjuster"
          />
        ) : null}
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
            disabled={
              !["Special Account", "Affinity"].includes(
                sacData?.BusinessType,
              ) && sacData?.AcctStatus !== "Under Construction"
            }
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

      <Grid container spacing={2} sx={{}}>
        <BlueHeaderContainer title="Policy Details">
          <Grid container spacing={2} size={4} sx={{ textAlign: "left" }}>
            <Grid size={3}>
              <UnderlinedHeading text="Prefix" />
              <Body2 text={data?.PolPref} size={18} sx={{ color: "black" }} />
            </Grid>
            <Grid size={5}>
              <UnderlinedHeading text="Policy #" />
              <Body2 text={data?.PolicyNum} size={18} sx={{ color: "black" }} />
            </Grid>
            <Grid size={4}>
              <UnderlinedHeading text="Mod" />
              <Body2 text={data?.PolMod} size={18} sx={{ color: "black" }} />
            </Grid>
          </Grid>
          <Grid size={4} sx={{ textAlign: "center" }}>
            <UnderlinedHeading text="Customer Name" />
            <Body2 text={data?.AccountName} size={18} sx={{ color: "black" }} />
          </Grid>
          <Grid size={4} sx={{ textAlign: "right" }}>
            <UnderlinedHeading text="Inception Date" />
            <Body2 text={data?.InceptDate} />
          </Grid>

          <Grid size={4}>
            <UnderlinedHeading text="Policy Type" />
            <Body2 text={data?.PolicyType} sx={{ fontSize: 18 }} />
          </Grid>
          <Grid size={4} sx={{ textAlign: "center" }}>
            <UnderlinedHeading text="Policy Name Insured" />
            <Body2 text={data?.AcctOnPolicyName} sx={{ fontSize: 18 }} />
          </Grid>
          <Grid size={4} sx={{ textAlign: "right" }}>
            <UnderlinedHeading text="Expiration Date" />
            <Body2 text={data?.ExpDate} />
          </Grid>

          <Grid size={3.6}>
            <UnderlinedHeading text="Underwriter Name" />
            <Body2 text={data?.UnderwriterName} />
          </Grid>
          <Grid size={2.7}>
            <UnderlinedHeading text="Policy Status" />
            <Body2 text={data?.PolicyStatus} />
          </Grid>
          <Grid size={2.7}>
            <UnderlinedHeading text="Cancellation Date" />
            <Body2 text={""} />
          </Grid>
          <Grid size={3} sx={{ textAlign: "right" }}>
            <UnderlinedHeading text="Policy Business Status" />
            <Body2 text={data?.PolicyBusinessType} />
          </Grid>
        </BlueHeaderContainer>

        <BlueHeaderContainer title="Agent Contacts">
          <Grid
            size={4}
            sx={{
              ...columnContainerStyles,
              gap: 1,
            }}
          >
            <Grid textAlign="center">
              <UnderlinedHeading text="Agent Name:" />
              <Body2 text={data?.AgentName} />
            </Grid>

            <Grid textAlign="center">
              <UnderlinedHeading text="Agent Code:" />
              <Body2 text={data?.AgentCode} />
            </Grid>

            <Grid textAlign="center">
              <UnderlinedHeading text="Segmentation:" />
              <Body2 text={data?.AgentSeg} />
            </Grid>
          </Grid>

          <Grid size={4} sx={columnContainerStyles}>
            <UnderlinedHeading text="Primary Agent Contact" />
            <ContactInfo
              data={{
                Name: data?.AgentContact1,
                "Work #": data?.AgentWork1,
                "Cell #": data?.AgentCell1,
                "E-Mail": data?.AgentEmail1,
              }}
              sx={{ py: 1 }}
            />
          </Grid>

          <Grid size={4} sx={columnContainerStyles}>
            <UnderlinedHeading text="Secondary Agent Contact" />
            <ContactInfo
              data={{
                Name: data?.AgentContact2,
                "Work #": data?.AgentWork2,
                "Cell #": data?.AgentCell2,
                "E-Mail": data?.AgentEmail2,
              }}
              sx={{ py: 1 }}
            />
          </Grid>
        </BlueHeaderContainer>

        <BlueHeaderContainer title="Insured Contacts">
          <Grid size={4} sx={columnContainerStyles}>
            <UnderlinedHeading text="Primary Insured Contact" />
            <ContactInfo
              data={{
                Name: data?.InsuredContact1,
                "Work #": data?.InsuredPhone1,
                "Cell #": data?.InsuredCell1,
                "E-Mail": data?.InsuredEMail1,
              }}
              sx={{ py: 1 }}
            />
          </Grid>

          <Grid size={4} sx={columnContainerStyles}>
            <UnderlinedHeading text="Secondary Insured Contact" />
            <ContactInfo
              data={{
                Name: data?.InsuredContact2,
                "Work #": data?.InsuredPhone2,
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
          <Grid size={12} sx={{ textAlign: "center" }}>
            <UnderlinedHeading text="Business Line / Policy Type:" />
            <Body2 text={data?.CCTBusLine} />
          </Grid>

          {data?.UnManPol === "1" && (
            <Grid size={12} sx={{ display: "flex", direction: "row", gap: 1 }}>
              <Body2
                text="Unverified Manual:"
                sx={{ display: "flex", justifyContent: "end", color: "black" }}
              />
              <Grid sx={{ flex: 1 }}>
                <Note
                  text="This policy is not yet set up in PMS. HCS claims should be entered as Unverified/Manual."
                  sx={{ fontWeight: 500 }}
                />
                <Note
                  text="If the policy is New Business, you must enter the mod as 00. For Renewal Business, you must enter the renewal mod and the dates for the new policy year. Your Mod # and date should be at the top of these instructions."
                  sx={{ fontWeight: 500 }}
                />
              </Grid>
            </Grid>
          )}

          {data?.CCTBusLine === "Auto" && (
            <Grid size={12} sx={{ display: "flex", gap: 1 }}>
              <Body2
                text="Auto Policy:"
                sx={{ display: "inline", color: "black", flexShrink: 0 }}
              />
              <Body2
                text={
                  data?.CCTAutoYN === "1"
                    ? "This is a COMPOSITE RATED AUTO Policy. PMS UNIT #: Go to PMS: PISV screen. Find the State your vehicle is registered in. This is your Unit #. When entering your vehicle in HCS you must choose NEW and enter as much info as given (Year/Make/Model/VIN/Plate/State). You must always check the Total Loss radio button (yes/no). If you're unsure if a Total Loss, please select No."
                    : "This is a SPECIFIED AUTO Policy. Go to PMS: PIAT screen. Find your vehicle. This is your Unit #. If you don't find your vehicle, try PIAX. When entering your vehicle in HCS you may pick your vehicle from the drop down list. If your vehicle is not listed, please choose NEW and enter as much info as given (Year/Make/Model/VIN/Plate/State). Please set an activity on the unlisted vehicles. You must always check the Total Loss radio button (yes/no). If you're unsure if a Total Loss, select NO."
                }
                sx={{ display: "inline", ml: 1 }}
              />
            </Grid>
          )}

          {data?.RentedHired && (
            <Grid size={12} sx={{ display: "flex", gap: 1 }}>
              <Body2
                text="Rented or Hired:"
                sx={{ display: "inline", color: "black", flexShrink: 0 }}
              />
              <Body2
                text={
                  data?.RentedHired === "1"
                    ? "RENTED/HIRED AUTOS: Use Hired Auto Line for Liability coverage. For Physical Damage use Hired Auto-Phys Dmg. If Hired Auto-Phys Dmg is not an option, use the Composite rate line."
                    : "RENTED/HIRED AUTOS: Use PMS Unit # 010"
                }
                sx={{ display: "inline", ml: 1 }}
              />
            </Grid>
          )}

          {["Auto", "Package", "BPO"].includes(data?.CCTBusLine) && (
            <Grid size={12}>
              <Body2
                text="Gatekeepers:"
                sx={{ display: "inline", color: "black" }}
              />
              <Body2
                text="These claims are to be set up on the AUTO policy unless specified in the 'Other Instructions' section below."
                sx={{ display: "inline", ml: 1 }}
              />
            </Grid>
          )}

          {data?.CCTBusLine === "Umbrella" && (
            <>
              <Grid size={12}>
                <Body2
                  text="This is an Umbrella Policy:"
                  sx={{ display: "inline", color: "black" }}
                />
                <Body2
                  text="If a loss is sent in under this policy, please search for the corresponding liability claim. Upload the Umbrella report and note the file."
                  sx={{ display: "inline", ml: 1 }}
                />
              </Grid>

              <Grid size={12} sx={{ textAlign: "center" }}>
                <Body2
                  text="Umbrella claim received and uploaded to this file.  Please review and e-mail SPACCTCLAIM to request a claim to be keyed on the Umbrella policy, if deemed necessary."
                  size={15}
                  sx={{ color: "black" }}
                />
              </Grid>

              <Grid size={12} sx={{ textAlign: "center" }}>
                <Body2 text="If a loss is not found, please send to Michelle Bond to review." />
              </Grid>
            </>
          )}

          <Grid size={6} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Body2
              text="Location List:"
              sx={{ display: "inline", color: "black", width: 120 }}
            />
            <BlueTextField
              value={data?.LocList}
              sx={{ display: "inline", flex: 1 }}
            />
          </Grid>

          <Grid size={6} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Body2
              text="Location Completion Date:"
              sx={{ display: "inline", color: "black" }}
            />
            <BlueTextField
              value={data?.LocCompDate}
              sx={{ display: "inline", flex: 1 }}
            />
          </Grid>

          {data?.LocCoded === "Yes" &&
            data?.PolicyStatus === "Pending Renewal" && (
              <Grid
                size={12}
                sx={{ textAlign: "center", width: "80%", mx: "auto" }}
              >
                <Body2
                  text="This policy is in renewal. Please use the expired prior mod for your location coding. DO NOT note the PMS Unit #. DO NOT set an activity for Michelle."
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
              text="Account Location ID:"
              sx={{ display: "inline", color: "black", width: 120 }}
            />
            <BlueTextField
              value={data?.AcctLocNotes}
              sx={{ display: "inline", flex: 1 }}
              multiline
              rows={3}
            />
          </Grid>

          <Grid
            size={12}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            <Body2
              text="PMS Unit:"
              sx={{ display: "inline", color: "black", width: 120 }}
            />
            <BlueTextField
              value={data?.PMSUnitNotes}
              sx={{ display: "inline", flex: 1 }}
              multiline
              rows={3}
            />
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

          {/* <Grid size={12} sx={{ justifyItems: "center" }}>
            <Body2
              text={
                <>
                  <p>You must set an activity for HCS Support:</p>
                  <ol>
                    <li>Subject: SA CLAIM</li>
                    <li>
                      Assign to queue: HCS Hanover Manual (search with "HCS")
                    </li>
                    <li>Note the unit # as per current protocols</li>
                  </ol>
                </>
              }
              size={15}
              sx={{ color: "red" }}
            />
          </Grid> */}

          {data?.SpecHand === "See Assignment Instructions" && (
            <Grid size={12} sx={{ textAlign: "center" }}>
              <Body2
                text="SEE ASSIGNMENT INSTRUCTIONS"
                size={15}
                sx={{ color: "red" }}
              />
            </Grid>
          )}

          {data?.SpecHand === "Auto Assign" && (
            <Grid size={12} sx={{ textAlign: "center" }}>
              <Body2
                text="AUTO ASSIGN ADJUSTERS"
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
