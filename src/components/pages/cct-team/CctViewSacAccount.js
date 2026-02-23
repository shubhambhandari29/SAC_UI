import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../../ui/Loader";
import { Button, FormControl, Grid, Paper, useTheme } from "@mui/material";
import api from "../../../api/api";
import Swal from "sweetalert2";
import Modal from "../../ui/Modal";
import ViewPolicies from "../sac-administration/manage-accounts/view-policies/ViewPolicies";
import Heading1 from "./custom-components/Heading1";
import Body1 from "./custom-components/Body1";
import BorderedContainer from "./custom-components/BorderedContainer";
import Note from "./custom-components/Note";
import BlueTextField from "./custom-components/BlueTextField";

export default function CctViewSacAccount() {
  const methods = useForm();
  const { control, reset, getValues } = methods;
  const [viewPolicies, setViewPolicies] = useState(false);
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
        const res = await api.get("/sac_account/", {
          params: { [searchByColumn]: value },
        });

        //replacing all null values with empty string
        const data = Object.fromEntries(
          Object.entries(res.data[0]).map(([k, v]) => [k, v === null ? "" : v]),
        );

        reset(data);
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
    if (from.includes("policy")) setViewPolicies(true);
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
        open={viewPolicies}
        onClose={() => setViewPolicies(false)}
        maxWidth="xl"
      >
        <ViewPolicies
          CustomerNum={column_name.split("=")[1]}
          CustomerName={getValues("CustomerName")}
        />
      </Modal>

      <Grid
        container
        spacing={1.5}
        sx={{ height: "100%", alignContent: "flex-start" }}
      >
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 2,

              border: "1px solid #e0e0e0",
            }}
          >
            <Grid container spacing={2} size={12}>
              <Grid size={5.5}>
                <Heading1 text="Customer Account Name:" />
                <Body1
                  text={getValues("CustomerName")}
                  sx={{ color: "blue" }}
                />
              </Grid>
              <Grid size={2}>
                <Heading1 text="Customer #" />
                <Body1 text={getValues("CustomerNum")} sx={{ color: "blue" }} />
              </Grid>
              <Grid size={2.5}>
                <Heading1 text="Termination Date:" />
                <Body1
                  text={getValues("TermDate") || "N/A"}
                  sx={{ color: "blue" }}
                />
              </Grid>
              <Grid size={2}>
                <Heading1 text="Account Status:" />
                <Body1 text={getValues("AcctStatus")} sx={{ color: "red" }} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }} sx={{ width: "100%" }}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: "background.lightBlue",
              border: "1px solid #e0e0e0",
            }}
          >
            <Grid container spacing={2}>
              <Grid container spacing={2} size={12}>
                <Grid size={3}>
                  <BorderedContainer title="Special Accounts Contacts">
                    <Grid container spacing={2} size={{ xs: 12 }}>
                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth>
                          <Controller
                            name="SAC_Contact1"
                            control={control}
                            render={({ field }) => (
                              <BlueTextField {...field} label="SAC 1" />
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth>
                          <Controller
                            name="SAC_Contact2"
                            control={control}
                            render={({ field }) => (
                              <BlueTextField {...field} label="SAC 2" />
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </BorderedContainer>
                </Grid>

                <Grid size={3}>
                  <BorderedContainer title="Risk Solutions Consultants">
                    <Grid container spacing={2} size={12}>
                      <Grid size={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="LossCtlRep1"
                            control={control}
                            render={({ field }) => (
                              <BlueTextField
                                {...field}
                                label="Risk Solutions 1"
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid size={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="LossCtlRep2"
                            control={control}
                            render={({ field }) => (
                              <BlueTextField
                                {...field}
                                label="Risk Solutions 2"
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </BorderedContainer>
                </Grid>

                <Grid size={6}>
                  <BorderedContainer title="Creation and On-Boarding">
                    <Grid container spacing={2} size={12}>
                      <Grid size={6}>
                        <Controller
                          name="DateCreated"
                          control={control}
                          render={({ field }) => (
                            <BlueTextField {...field} label="Created Date" />
                          )}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Controller
                          name="OBMethod"
                          control={control}
                          render={({ field }) => (
                            <BlueTextField
                              {...field}
                              label="Onboarding Method"
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={6}>
                        <Controller
                          name="OnBoardDate"
                          control={control}
                          render={({ field }) => (
                            <BlueTextField {...field} label="On Board Date" />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </BorderedContainer>
                </Grid>
              </Grid>

              <Grid size={6}>
                <Controller
                  name="BranchName"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField {...field} label="Branch Name" />
                  )}
                />
              </Grid>

              <Grid size={12}>
                <Controller
                  name="AccountNotes"
                  control={control}
                  render={({ field }) => (
                    <BlueTextField
                      {...field}
                      label="Account Details"
                      multiline
                      rows={8}
                    />
                  )}
                />
              </Grid>

              <Grid size={12} sx={{ textAlign: "center" }}>
                {getValues("AcctStatus") === "Inactive" && (
                  <Note text="This Account is Inactive" />
                )}

                {getValues("AcctStatus") === "Under Construction" && (
                  <>
                    <Note text="This Account is Under Construction" />
                    <Note text="Please enter this claim as you normally would:" />
                    <Note text="* Marking as a Special Account" />
                    <Note text="* Filling out the SAC Tab" />
                    <Note text="* Attaching the SHI Document" />
                    <Note text="(There will not be a PMS Unit noted by CCT at this time)" />
                  </>
                )}

                {getValues("HCM_LOC_ONLY") === "Yes" && (
                  <Note
                    text="This is an HCM or Location Coded Only Account. There is very little account 
                  information and sometimes no Insured and/or Agent contact information in the database. 
                  The SHI will be different than you’d normally see.  Please to attach to your claim. 
                  Please mark your claim as Special following your policy instructions and fill out the SAC Tab 
                  (including Account Location Identifier, if applicable)."
                  />
                )}
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
            onClick={() => setViewPolicies(true)}
          >
            View Policies
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() =>
              navigate("/view-cct-accounts/affinity=false", { replace: true })
            }
          >
            Back
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
