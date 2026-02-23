import { Box, Button, useTheme } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import api from "../../../../../api/api";
import Loader from "../../../../ui/Loader";
import Swal from "sweetalert2";

export default function UpdateAllBtn({ fieldName, disabled }) {
  const { getValues } = useFormContext();
  const [loading, setLoading] = useState("");
  const theme = useTheme();

  const handleClick = async (btnName) => {
    const data = {
      updateVia: btnName === "C" ? "CustomerNum" : "PolicyNum",
      updateViaValue: getValues(btnName === "C" ? "CustomerNum" : "PolicyNum"),
      fieldName,
      fieldValue: getValues(fieldName),
    };

    setLoading(btnName);
    try {
      const res = await api.post(
        "/sac_policies/update_field_for_all_policies",
        data,
      );

      if (res?.status === 200) {
        if (res.data.count === 1) {
          Swal.fire({
            title: "No Match",
            text: `There are no other policies with the same ${
              btnName === "C" ? "Customer Number" : " Policy Number"
            }`,
            icon: "error",
            confirmButtonText: "Ok",
            iconColor: theme.palette.error.main,
            customClass: {
              confirmButton: "swal-confirm-button",
              cancelButton: "swal-cancel-button",
            },
            buttonsStyling: false,
          });
        } else {
          Swal.fire({
            title: "Update Successful",
            text: `This field was updated for all records with same ${
              btnName === "C" ? "Customer" : "Policy"
            } Number`,
            icon: "success",
            confirmButtonText: "Ok",
            iconColor: theme.palette.success.main,
            customClass: {
              confirmButton: "swal-confirm-button",
              cancelButton: "swal-cancel-button",
            },
            buttonsStyling: false,
          });
        }
      } else {
        Swal.fire({
          title: "Update Failed",
          text: "Some error occoured, unable to update the field",
          icon: "error",
          confirmButtonText: "Ok",
          iconColor: theme.palette.error.main,
          customClass: {
            confirmButton: "swal-confirm-button",
            cancelButton: "swal-cancel-button",
          },
          buttonsStyling: false,
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Update Failed",
        text: "Some error occoured, unable to update the field",
        icon: "error",
        confirmButtonText: "Ok",
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
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
      <Button
        variant="text"
        sx={{
          border: "1px solid lightgray",
          color: "red",
          fontSize: 12,
          minWidth: "unset",
          p: 1,
        }}
        disabled={loading === "C" || disabled}
        onClick={() => handleClick("C")}
      >
        {loading === "C" ? <Loader size={15} height="30px" /> : "C"}
      </Button>
      <Button
        variant="text"
        sx={{
          border: "1px solid lightgray",
          color: "blue",
          fontSize: 12,
          minWidth: "unset",
          p: 1,
        }}
        disabled={loading === "P" || disabled}
        onClick={() => handleClick("P")}
      >
        {loading === "P" ? <Loader size={15} height="30px" /> : "P"}
      </Button>
    </Box>
  );
}
