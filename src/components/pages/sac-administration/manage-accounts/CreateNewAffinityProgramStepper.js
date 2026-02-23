import { useState, useRef, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Container,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import AffinityCreateNewProgram from "./affinity/AffinityCreateNewProgram";
import ViewPolicyTypes from "./view-policy-types/ViewPolicyTypes";
import CreateNewPolicyType from "./view-policy-types/CreateNewPolicyType";

const steps = ["Create Program", "Add Policy Types"];

export default function CreateNewAffinityProgramStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [viewMode, setViewMode] = useState("list"); //Internal Mode: 'list' (ViewPolicies) or 'form' (CreateNewPolicy)
  const [selectedPolicyPK, setSelectedPolicyPK] = useState(null);
  const [policyCount, setPolicyCount] = useState(0);
  const accountFormRef = useRef();
  const policyFormRef = useRef();
  const navigate = useNavigate();
  const theme = useTheme();
  const { column_name } = useParams();
  const [isCreatingMod, setIsCreatingMod] = useState(false);
  const [isPolicySaved, setIsPolicySaved] = useState(false);

  useEffect(() => {
    if (!column_name) {
      setAccountData(null);
      setActiveStep(0);
      setViewMode("list");
      setSelectedPolicyPK(null);
      setPolicyCount(0);
    }
  }, [column_name]);

  const resetToListView = () => {
    setViewMode("list");
    setSelectedPolicyPK(null);
    setIsCreatingMod(false);
  };

  const handleSave = async () => {
    setLoading("save");
    if (activeStep === 0 && accountFormRef.current) {
      const result = await accountFormRef.current.submit("save");
      if (result) setAccountData(result);
    }

    if (activeStep === 1 && viewMode === "form" && policyFormRef.current) {
      const result = await policyFormRef.current.submit("save");
      if (result) {
        setIsPolicySaved(true);
        setIsCreatingMod(false);
        setSelectedPolicyPK(result);
      }
    }

    setLoading("");
  };

  const handleNext = async () => {
    setLoading("next");

    // Step 1 (Create Account)
    if (activeStep === 0) {
      if (accountFormRef.current) {
        const result = await accountFormRef.current.submit("save");
        if (result) {
          setAccountData(result);
          setActiveStep(1);
        }
      }
    }

    // Step 2 (Policy List View) -> SUBMIT
    else if (activeStep === 1 && viewMode === "list") {
      const result = await accountFormRef.current.submit("submit");
      if (result) navigate("/pending-items", { replace: true });
    }

    // Step 2 (Policy Form View) -> SAVE POLICY
    else if (activeStep === 1 && viewMode === "form") {
      if (policyFormRef.current) {
        const result = await policyFormRef.current.submit("submit");
        if (result) {
          resetToListView();
          setIsPolicySaved(false);
          setSelectedPolicyPK(result);
        }
      }
    }

    setLoading("");
  };

  const handleBack = async () => {
    if (activeStep === 1 && viewMode === "form") {
      const res = await Swal.fire({
        title: "Confirm Request to Cancel",
        text: "Any unsaved changes will be lost, are you sure you want to do this?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        iconColor: theme.palette.warning.main,
        customClass: {
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
        buttonsStyling: false,
        cancelButtonColor: theme.palette.error.main,
      });

      if (res.isConfirmed) {
        resetToListView();
        setIsPolicySaved(false);
      }
    } else if (activeStep === 0) {
      const res = await Swal.fire({
        title: "Confirm Request to Cancel",
        text: "Any unsaved changes will be lost, are you sure you want to do this?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        iconColor: theme.palette.warning.main,
        customClass: {
          confirmButton: "swal-confirm-button",
          cancelButton: "swal-cancel-button",
        },
        buttonsStyling: false,
        cancelButtonColor: theme.palette.error.main,
      });

      if (res.isConfirmed) {
        setIsPolicySaved(false);
        navigate("/pending-items", { replace: true });
      }
    } else setActiveStep((prev) => prev - 1);
  };

  const getNextButtonText = () => {
    if (loading === "next")
      return <CircularProgress size={20} color="inherit" />;
    if (activeStep === 0) return "Next: Add Policy Types"; // changed
    if (activeStep === 1 && viewMode === "form") return "Submit Policy Type";
    return "Submit";
  };

  const handleNewPolicy = () => {
    setIsPolicySaved(false);
    policyFormRef.current?.createNewPolicy();
  };

  const handleNextMod = () => {
    setIsPolicySaved(false);
    policyFormRef.current?.createNextMod();
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 1 }}>
      <Stepper activeStep={activeStep} sx={{ width: "80%", mx: "auto", mb: 2 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mb: 2, minHeight: "400px" }}>
        <Box sx={{ display: activeStep === 0 ? "block" : "none" }}>
          <AffinityCreateNewProgram
            key={accountData ? accountData.ProgramName : "fresh-form"} // changed
            ref={accountFormRef}
            isStepper={true}
            formData={accountData}
          />
        </Box>

        {activeStep === 1 && (
          <>
            {viewMode === "list" && accountData && (
              <ViewPolicyTypes
                ProgramName={accountData.ProgramName} // changed
                isStepper={true}
                onCreatePolicy={() => {
                  setSelectedPolicyPK(null);
                  setViewMode("form");
                }}
                onViewPolicy={(pk) => {
                  setSelectedPolicyPK(pk);
                  setViewMode("form");
                }}
                onDataFetch={(count) => setPolicyCount(count)}
              />
            )}

            {viewMode === "form" && (
              <CreateNewPolicyType
                ref={policyFormRef}
                isStepper={true}
                accountData={accountData}
                pkProp={selectedPolicyPK}
                onCreatePolicy={() => {
                  setSelectedPolicyPK(null);
                  setViewMode("form");
                }}
                onModStart={() => setIsCreatingMod(true)}
              />
            )}
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
          {((activeStep === 1 &&
            viewMode === "form" &&
            selectedPolicyPK &&
            !isCreatingMod) ||
            isPolicySaved) && (
            <>
              <Button variant="outlined" onClick={handleNewPolicy}>
                Create New Policy Type
              </Button>

              <Button variant="outlined" onClick={handleNextMod}>
                Create Next Policy Type
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={handleBack} variant="outlined" disabled={loading}>
            Back
          </Button>

          {(activeStep === 0 || (activeStep === 1 && viewMode === "form")) && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading === "save" ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
          )}

          <Button
            onClick={handleNext}
            variant="contained"
            disabled={
              loading ||
              (activeStep === 1 && viewMode === "list" && policyCount === 0)
            }
          >
            {getNextButtonText()}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
