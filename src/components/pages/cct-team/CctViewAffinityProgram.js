import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../../ui/Loader";
import { Button, Grid, Paper, useTheme } from "@mui/material";
import api from "../../../api/api";
import Modal from "../../ui/Modal";
import ViewPolicyTypes from "../sac-administration/manage-accounts/view-policy-types/ViewPolicyTypes";
import BlueTextField from "./custom-components/BlueTextField";
import Swal from "sweetalert2";

export default function CctViewAffinityProgram() {
  const methods = useForm();
  const { control, reset, getValues } = methods;
  const [viewPolicyTypes, setViewPolicyTypes] = useState(false);
  const { column_name } = useParams();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const from = state?.from || "/pending-items";
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (!column_name) return;

    const fetchData = async (searchByColumn, value) => {
      try {
        setLoading(true);
        const [resMain, resAgent] = await Promise.all([
          api.get("/affinity_program/", {
            params: { [searchByColumn]: value },
          }),
          api.get("/affinity_agents/", {
            params: { ProgramName: column_name.split("=")[1] },
          }),
        ]);

        //replacing all null values with empty string
        const data = Object.fromEntries(
          Object.entries(resMain.data[0]).map(([k, v]) => [
            k,
            v === null ? "" : v,
          ]),
        );

        let updatedData = { ...data };

        if (resAgent.data.length > 0) {
          updatedData["AdditionalProducerCodes"] = "";
          resAgent.data.forEach((item) => {
            if (item.PrimaryAgt === "Yes")
              updatedData = { ...updatedData, ...item };
            else
              updatedData.AdditionalProducerCodes +=
                (updatedData.AdditionalProducerCodes ? ", " : "") +
                item.AgentCode;
          });
        }

        reset(updatedData);
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
  }, [column_name, reset, theme.palette.error.main]);

  useEffect(() => {
    if (from.includes("policy")) setViewPolicyTypes(true);
  }, [from]);

  if (loading) return <Loader size={30} height="600px" />;

  return (
    <Grid
      container
      spacing={2}
      sx={{
        minHeight: `calc(100vh - 128px)`,
        diplay: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/*Modal for view policies  */}
      <Modal
        open={viewPolicyTypes}
        onClose={() => setViewPolicyTypes(false)}
        maxWidth="xl"
      >
        <ViewPolicyTypes ProgramName={getValues("ProgramName")} />
      </Modal>

      <Grid
        container
        spacing={1.5}
        sx={{ height: "100%", alignContent: "flex-start" }}
      >
        <Paper
          sx={{
            p: 2,
            backgroundColor: "background.lightBlue",
            border: "1px solid #e0e0e0",
            width: "100%",
          }}
        >
          <Grid container spacing={2} size={12}>
            <Grid size={12}>
              <Controller
                name="ProgramName"
                control={control}
                render={({ field }) => (
                  <BlueTextField
                    {...field}
                    label="Affinity Program Name"
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "black",
                        height: 40,
                        fontSize: 18,
                        fontWeight: 700,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={4} />
            <Grid size={4}>
              <Controller
                name="AcctStatus"
                control={control}
                render={({ field }) => (
                  <BlueTextField
                    {...field}
                    label="Account Status"
                    sx={{ "& .MuiInputBase-input": { color: "red" } }}
                  />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="TermDate"
                control={control}
                render={({ field }) => (
                  <BlueTextField
                    {...field}
                    label="Termination Date"
                    sx={{ "& .MuiInputBase-input": { color: "red" } }}
                  />
                )}
              />
            </Grid>

            <Grid size={4}>
              <Controller
                name="SpecAcct1"
                control={control}
                render={({ field }) => (
                  <BlueTextField {...field} label="Spec Accounts 1" />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="LossCtl1"
                control={control}
                render={({ field }) => (
                  <BlueTextField {...field} label="Risk Solutions 1" />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="DtCreated"
                control={control}
                render={({ field }) => (
                  <BlueTextField {...field} label="Created Date" />
                )}
              />
            </Grid>

            <Grid size={4}>
              <Controller
                name="SpecAcct2"
                control={control}
                render={({ field }) => (
                  <BlueTextField {...field} label="Spec Accounts 2" />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="LossCtl2"
                control={control}
                render={({ field }) => (
                  <BlueTextField {...field} label="Risk Solutions 2" />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="OBMethod"
                control={control}
                render={({ field }) => (
                  <BlueTextField {...field} label="On Board Method" />
                )}
              />
            </Grid>

            <Grid size={4}>
              <Controller
                name="AcctOwner"
                control={control}
                render={({ field }) => (
                  <BlueTextField {...field} label="Account Owner" />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="BranchVal"
                control={control}
                render={({ field }) => (
                  <BlueTextField {...field} label="Branch Name" />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="OnBoardDt"
                control={control}
                render={({ field }) => (
                  <BlueTextField {...field} label="On Board Date" />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="AcctNotes"
                control={control}
                render={({ field }) => (
                  <BlueTextField
                    {...field}
                    label="Program Details"
                    sx={{ "& .MuiInputBase-input": { color: "black" } }}
                    multiline
                    rows={6}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Grid size={{ xs: 12 }} sx={{ width: "100%" }}>
          <Paper
            sx={{
              p: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Grid container spacing={2}>
              <Grid size={8}>
                <Controller
                  name="AgentName"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField
                      {...field}
                      label="Primary Agent Name"
                      sx={{ "& .MuiInputBase-input": { color: "black" } }}
                    />
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  name="AgentCode"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField
                      {...field}
                      label="Producer Code"
                      sx={{ "& .MuiInputBase-input": { color: "black" } }}
                    />
                  )}
                />
              </Grid>

              <Grid container spacing={1} size={4.5}>
                <Controller
                  name="AgentContact1"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField {...field} label="Agent Contact 1" />
                  )}
                />
                <Controller
                  name="WorkTel1"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField {...field} label="Work Tel #" />
                  )}
                />
                <Controller
                  name="CellTel1"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField {...field} label="Cell Tel #" />
                  )}
                />
                <Controller
                  name="Email1"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField {...field} label="Email" />
                  )}
                />
              </Grid>

              <Grid container spacing={1} size={4.5}>
                <Controller
                  name="AgentContact2"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField {...field} label="Agent Contact 2" />
                  )}
                />
                <Controller
                  name="WorkTel2"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField {...field} label="Work Tel #" />
                  )}
                />
                <Controller
                  name="CellTel2"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField {...field} label="Cell Tel #" />
                  )}
                />
                <Controller
                  name="Email2"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField {...field} label="Email" />
                  )}
                />
              </Grid>

              <Grid size={3}>
                <Controller
                  name="AdditionalProducerCodes"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField
                      {...field}
                      label="Additional Non-Primary Producer Code"
                      sx={{ "& .MuiInputBase-input": { color: "red" } }}
                      multiline
                      rows={7}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setViewPolicyTypes(true)}
          >
            View Policies
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() =>
              navigate("/view-cct-accounts/affinity=true", { replace: true })
            }
          >
            Back
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
