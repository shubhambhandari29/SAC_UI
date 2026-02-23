import {
  Autocomplete,
  Box,
  Button,
  createFilterOptions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  useTheme,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import api from "../../../../../api/api";
import Loader from "../../../../ui/Loader";
import { useLocation } from "react-router-dom";
import UpdateAllBtn from "./UpdateAllBtn";
import PhoneField from "../../../../ui/PhoneField";
import Swal from "sweetalert2";
import EmailField from "../../../../ui/EmailField";
import useDropdownData from "../../../../../hooks/useDropdownData";
import { useSelector } from "react-redux";

const CustomContainer = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
};

const CustomPaper = (props) => {
  return (
    <Paper
      {...props}
      sx={{
        borderRadius: "15px",
        boxShadow: "0 1px 8px rgba(0, 0, 0, 0.25)",
      }}
    />
  );
};

export default function Agent({ isEnabled, disableForDirector }) {
  const { control, getValues, setValue } = useFormContext();
  const [loading, setLoading] = useState("");
  const { pathname } = useLocation();
  const theme = useTheme();
  const { data: options, loading: optionsLoading } = useDropdownData(
    "/dropdowns/EDW_AGENT_LIST",
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    setSelectedOption({ Agent_Code: getValues("AgentCode") });
  }, [getValues]);

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option) => option["Agent_Name"],
    limit: 100,
  });

  const handleRecipientList = async (from) => {
    if (
      (from === "primary" && !getValues("AgentEmail1")) ||
      (from === "secondary" && !getValues("AgentEmail2"))
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
        (!getValues("AgentContact1") ||
          getValues("AgentContact1").toLowerCase() === "n/a")) ||
      (from === "secondary" &&
        (!getValues("AgentContact2") ||
          getValues("AgentContact2").toLowerCase() === "n/a"))
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
        CustomerNum: getValues("CustomerNum"),
        RecipCat: "Agent",
        DistVia: "Email",
        AttnTo: getValues(
          from === "primary" ? "AgentContact1" : "AgentContact2",
        ),
        EMailAddress: getValues(
          from === "primary" ? "AgentEmail1" : "AgentEmail2",
        ),
      },
    ];

    setLoading(from);
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

  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <Controller
            name="AgentName"
            control={control}
            disabled={!isEnabled("AgentName")}
            render={() => (
              <Autocomplete
                filterOptions={filterOptions}
                options={options}
                loading={optionsLoading}
                slots={{ paper: CustomPaper }}
                value={
                  options.find(
                    (i) => i.Agent_Code === selectedOption?.Agent_Code,
                  ) || ""
                }
                onChange={(_, newVal) => {
                  setSelectedOption(newVal);
                  setValue("AgentCode", newVal?.Agent_Code);
                  setValue("AgentName", newVal?.Agent_Name);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Agent Name"
                    variant="outlined"
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {optionsLoading ? (
                              <Loader size={16} height="20px" />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
                getOptionLabel={(option) => option["Agent_Name"] || ""}
                groupBy={() => "header"}
                renderGroup={(params) => (
                  <Fragment key={params.key}>
                    <Table size="small" sx={{ tableLayout: "fixed" }}>
                      <TableHead>
                        <TableRow>
                          {["Agent_Name", "Agent_Code"].map((col) => (
                            <TableCell
                              key={col}
                              sx={{
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {col.split("_").join(" ")}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                    </Table>
                    {params.children}
                  </Fragment>
                )}
                renderOption={(props, option) => {
                  const { key, ...rest } = props;
                  return (
                    <Box
                      key={props["data-option-index"]}
                      {...rest}
                      sx={{ borderRadius: "15px" }}
                    >
                      <Table size="small" sx={{ tableLayout: "fixed" }}>
                        <TableBody>
                          <TableRow>
                            {["Agent_Name", "Agent_Code"].map((col) => (
                              <TableCell
                                key={col}
                                sx={{ pt: 0, fontSize: "0.7rem" }}
                              >
                                {option[col]}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  );
                }}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <Controller
            name="AgentCode"
            control={control}
            disabled={!isEnabled("AgentCode")}
            render={() => (
              <Autocomplete
                filterOptions={filterOptions}
                options={options}
                loading={optionsLoading}
                slots={{ paper: CustomPaper }}
                value={
                  options.find(
                    (i) => i.Agent_Code === selectedOption?.Agent_Code,
                  ) || ""
                }
                onChange={(_, newVal) => {
                  setSelectedOption(newVal);
                  setValue("AgentCode", newVal?.Agent_Code);
                  setValue("AgentName", newVal?.Agent_Name);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Agent Code"
                    variant="outlined"
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {optionsLoading ? (
                              <Loader size={16} height="20px" />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
                getOptionLabel={(option) => option["Agent_Code"] || ""}
                groupBy={() => "header"}
                renderGroup={(params) => (
                  <Fragment key={params.key}>
                    <Table size="small" sx={{ tableLayout: "fixed" }}>
                      <TableHead>
                        <TableRow>
                          {["Agent_Code", "Agent_Name"].map((col) => (
                            <TableCell
                              key={col}
                              sx={{
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {col.split("_").join(" ")}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                    </Table>
                    {params.children}
                  </Fragment>
                )}
                renderOption={(props, option) => {
                  const { key: muiKey, ...rest } = props;
                  return (
                    <Box key={muiKey} {...rest} sx={{ borderRadius: "15px" }}>
                      <Table size="small" sx={{ tableLayout: "fixed" }}>
                        <TableBody>
                          <TableRow>
                            {["Agent_Code", "Agent_Name"].map((col) => (
                              <TableCell
                                key={col}
                                sx={{ pt: 0, fontSize: "0.7rem" }}
                              >
                                {option[col]}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  );
                }}
              />
            )}
          />
        </FormControl>
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
          pt="3px"
          pb="3px"
          sx={{
            borderBottom: "2px solid lightgrey",
            textAlign: "center",
            borderRadius: "5px 5px 0px 0px",
          }}
        >
          Primary Agent Contact
        </Grid>

        <Grid container spacing={1} size={11} pd={1}>
          <CustomContainer>
            <Controller
              name="AgentContact1"
              control={control}
              disabled={!isEnabled("AgentContact1")}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Contact" />
              )}
            />
            {pathname.includes("view-policy") && (
              <UpdateAllBtn
                fieldName="AgentContact1"
                disabled={!isEnabled("AgentContact1") || user.role !== "Admin"}
              />
            )}
          </CustomContainer>

          <CustomContainer>
            <PhoneField
              name="AgentTel1"
              label="Work Tel #"
              control={control}
              disabled={!isEnabled("AgentTel1")}
            />
            {pathname.includes("view-policy") && (
              <UpdateAllBtn
                fieldName="AgentTel1"
                disabled={!isEnabled("AgentTel1") || user.role !== "Admin"}
              />
            )}
          </CustomContainer>

          <CustomContainer>
            <PhoneField
              name="AgentCell1"
              label="Mobile #"
              control={control}
              disabled={!isEnabled("AgentCell1")}
              isMobile={true}
            />
            {pathname.includes("view-policy") && (
              <UpdateAllBtn
                fieldName="AgentCell1"
                disabled={!isEnabled("AgentCell1") || user.role !== "Admin"}
              />
            )}
          </CustomContainer>

          <CustomContainer>
            <EmailField
              name="AgentEmail1"
              label="E-Mail"
              control={control}
              disabled={!isEnabled("AgentEmail1")}
            />
            {pathname.includes("view-policy") && (
              <UpdateAllBtn
                fieldName="AgentEmail1"
                disabled={!isEnabled("AgentEmail1") || user.role !== "Admin"}
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
          pt="3px"
          pb="3px"
          sx={{
            borderBottom: "2px solid lightgrey",
            textAlign: "center",
            borderRadius: "5px 5px 0px 0px",
          }}
        >
          Secondary Agent Contact
        </Grid>

        <Grid container spacing={1} size={11} pb={1}>
          <CustomContainer>
            <Controller
              name="AgentContact2"
              control={control}
              disabled={!isEnabled("AgentContact2")}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Contact" />
              )}
            />
            {pathname.includes("view-policy") && (
              <UpdateAllBtn
                fieldName="AgentContact2"
                disabled={!isEnabled("AgentContact2") || user.role !== "Admin"}
              />
            )}
          </CustomContainer>

          <CustomContainer>
            <PhoneField
              name="AgentTel2"
              label="Work Tel #"
              control={control}
              disabled={!isEnabled("AgentTel2")}
            />
            {pathname.includes("view-policy") && (
              <UpdateAllBtn
                fieldName="AgentTel2"
                disabled={!isEnabled("AgentTel2") || user.role !== "Admin"}
              />
            )}
          </CustomContainer>

          <CustomContainer>
            <PhoneField
              name="AgentCell2"
              label="Mobile #"
              control={control}
              disabled={!isEnabled("AgentCell2")}
              isMobile={true}
            />
            {pathname.includes("view-policy") && (
              <UpdateAllBtn
                fieldName="AgentCell2"
                disabled={!isEnabled("AgentCell2") || user.role !== "Admin"}
              />
            )}
          </CustomContainer>

          <CustomContainer>
            <EmailField
              name="AgentEmail2"
              label="E-Mail"
              control={control}
              disabled={!isEnabled("AgentEmail2")}
            />
            {pathname.includes("view-policy") && (
              <UpdateAllBtn
                fieldName="AgentEmail2"
                disabled={!isEnabled("AgentEmail2") || user.role !== "Admin"}
              />
            )}
          </CustomContainer>
        </Grid>
      </Grid>

      <Grid size={6}>
        <Button
          name="SendToRecipient"
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => handleRecipientList("primary")}
          disabled={
            loading === "primary" ||
            !isEnabled("SendToRecipient") ||
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

      <Grid size={6}>
        <Button
          name="SendToRecipient"
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => handleRecipientList("secondary")}
          disabled={
            loading === "secondary" ||
            !isEnabled("SendToRecipient") ||
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
