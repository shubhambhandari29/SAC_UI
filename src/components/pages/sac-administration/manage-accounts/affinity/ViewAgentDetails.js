import { Box, Button, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../../../api/api";
import Loader from "../../../../ui/Loader";
import Swal from "sweetalert2";
import AgentForm from "./AgentForm";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const defaultValue = {
  AgentName: "",
  AgentCode: "",
  PrimaryAgt: "No",
  AgentContact1: "",
  WorkTel1: "",
  CellTel1: "",
  Email1: "",
  AgentContact2: "",
  WorkTel2: "",
  CellTel2: "",
  Email2: "",
};

export default function ViewAgentDetails({
  ProgramName,
  isEnabled,
  formData,
  getValuesSac,
}) {
  const methods = useForm({
    defaultValues: {
      agents: [],
    },
  });
  const { control, handleSubmit, reset, getValues, setValue } = methods;
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { pathname } = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const { fields, append } = useFieldArray({
    control,
    name: "agents",
  });
  const user = useSelector((state) => state.auth.user);

  const onSubmit = async (data) => {
    if (data?.agents?.length < 1) return;
    setLoading(true);
    try {
      const temp = data?.agents;
      temp.forEach((i) => {
        if (i?.id) delete i.id;
      });
      const payload = temp.map((i) => ({ ...i, ProgramName }));
      const res = await api.post("/affinity_agents/upsert", payload);
      if (res?.status === 200) setIsEditing(false);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Some error occoured, unable to save data",
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

  const onError = (errors) => {
    const errVals = Object.values(Object.values(errors)[0][0]);

    if (errVals.length > 0) {
      Swal.fire({
        title: "Data Validation Error, changes not saved",
        text: errVals[0].message,
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
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading("fetching");
      try {
        const res = await api.get("/affinity_agents/", {
          params: { ProgramName },
        });
        reset({ agents: res.data || [] });
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
        setLoading("");
      }
    };
    fetchData();
  }, [ProgramName, reset, theme.palette.error.main]);

  const handleAdd = () => {
    if (!pathname.includes("affinity-view") && !formData) {
      Swal.fire({
        title: "Error",
        text: "Save account before adding the agent details",
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
    append(defaultValue);
  };

  const handleCancel = () => {
    const currentAgents = getValues("agents");
    const validAgents = currentAgents.filter((agent) => agent.AgentName);

    setIsEditing(false);
    reset({ agents: validAgents });
  };

  if (loading) return <Loader size={40} height="300px" />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        pb: 1,
      }}
    >
      {fields?.length < 1 && (
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          No Agents Found
        </Typography>
      )}
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          handleSubmit(onSubmit, onError)(e);
        }}
        noValidate
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {fields.map((field, index) => (
          <AgentForm
            key={field.id}
            index={index}
            control={control}
            isEnabled={isEnabled}
            isEditing={isEditing}
            setValue={setValue}
          />
        ))}
      </form>

      <Box sx={{ display: "flex", gap: 1 }}>
        {!isEditing ? (
          <Button
            variant="outlined"
            type="button"
            onClick={() => setIsEditing(true)}
            disabled={
              user.role === "Director" &&
              getValuesSac("Stage") === "Admin" &&
              getValuesSac("IsSubmitted") === 1
            }
          >
            Edit
          </Button>
        ) : (
          <>
            <Button variant="contained" type="button" onClick={handleAdd}>
              Add
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={handleSubmit(onSubmit, onError)}
            >
              Save
            </Button>
            <Button variant="outlined" type="button" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
