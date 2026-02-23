import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { TiPrinter } from "react-icons/ti";
import Modal from "../ui/Modal";
import { useLocation } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import api from "../../api/api";
import Swal from "sweetalert2";
import RptInstructionsViewer from "./print-pages/RptInstructionsViewer";
import RptUnderConstructionShiCctViewer from "./print-pages/RptUnderConstructionShiCctViewer";
import Loader from "../ui/Loader";
import RptInstructionsAffinViewer from "./print-pages/RptInstructionsAffinViewer";

export default function ShiPrint() {
  const { getValues } = useFormContext();
  const { pathname } = useLocation();
  const [openAdjuster, setOpenAdjuster] = useState(false);
  const [openAgentInsured, setOpenAgentInsured] = useState(false);
  const [accData, setAccData] = useState();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const boxStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pb: 3,
    border: "1px solid black",
    borderRadius: "25px",
    background: theme.palette.background.yellow,
  };

  console.log(getValues());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (pathname.includes("policy-types")) {
          const [resAgent, resAffinity] = await Promise.all([
            api.get("/affinity_agents/", {
              params: { ProgramName: getValues("ProgramName") },
            }),
            api.get("/affinity_program/", {
              params: { ProgramName: getValues("ProgramName") },
            }),
          ]);

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

          setAccData(affinityData);
        } else {
          const res = await api.get("/sac_account/", {
            params: { CustomerNum: getValues("CustomerNum") },
          });

          const sacdata = Object.fromEntries(
            Object.entries(res.data[0]).map(([k, v]) => [
              k,
              v === null ? "" : v,
            ]),
          );

          setAccData(sacdata);
        }
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

    fetchData();
  }, [getValues, pathname, theme.palette.error.main]);

  if (loading) return <Loader size={20} height="200px" />;

  return (
    <>
      {/*Modal for Adjuster report  */}
      <Modal
        open={openAdjuster}
        onClose={() => setOpenAdjuster(false)}
        maxWidth="lg"
      >
        {pathname.includes("policy-types") ? (
          <RptInstructionsAffinViewer
            data={getValues()}
            affinityData={accData}
            type="Adjuster"
          />
        ) : ["Special Account", "Affinity"].includes(accData?.BusinessType) ? (
          <RptInstructionsViewer
            data={getValues()}
            sacData={accData}
            type="Adjuster"
          />
        ) : accData?.AcctStatus === "Under Construction" ? (
          <RptUnderConstructionShiCctViewer
            data={getValues()}
            sacData={accData}
          />
        ) : null}
      </Modal>

      {/*Modal for Agent/Insured report  */}
      <Modal
        open={openAgentInsured}
        onClose={() => setOpenAgentInsured(false)}
        maxWidth="lg"
      >
        {pathname.includes("policy-types") ? (
          <RptInstructionsAffinViewer
            data={getValues()}
            affinityData={accData}
            type="Agent"
          />
        ) : ["Special Account", "Affinity"].includes(accData?.BusinessType) ? (
          <RptInstructionsViewer
            data={getValues()}
            sacData={accData}
            type="Agent"
          />
        ) : accData?.AcctStatus === "Under Construction" ? (
          <RptUnderConstructionShiCctViewer
            data={getValues()}
            sacData={accData}
          />
        ) : null}
      </Modal>

      <Grid container spacing={1} sx={{ justifyContent: "center" }}>
        <Typography variant="h6" color="primary">
          Report Options
        </Typography>
        <Grid
          container
          spacing={10}
          size={12}
          sx={{ justifyContent: "center" }}
        >
          <Grid size={3.5} sx={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 700 }}>
              Adjuster Instructions Report:
            </p>
            <Box sx={boxStyle}>
              <p style={{ fontSize: 16 }}>Print Preview</p>
              <Button
                type="button"
                variant="outlined"
                sx={{ padding: "10px 40px", background: "white" }}
                onClick={() => setOpenAdjuster(true)}
              >
                <TiPrinter size={24} />
              </Button>
            </Box>
          </Grid>

          <Grid size={3.5} sx={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 700 }}>
              Agent/Insured Report:
            </p>
            <Box sx={boxStyle}>
              <p style={{ fontSize: 16 }}>Print Preview</p>
              <Button
                type="button"
                variant="outlined"
                sx={{ padding: "10px 40px", background: "white" }}
                onClick={() => setOpenAgentInsured(true)}
              >
                <TiPrinter size={24} />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
