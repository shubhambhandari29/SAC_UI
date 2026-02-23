import { Button, Grid, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import api from "../../../../api/api";
import Loader from "../../../ui/Loader";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";

export default function ViewAffiliates({
  accountName,
  customerNum,
  disableforDirector,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const methods = useForm({ defaultValues: { affiliateList: [] } });
  const [loading, setLoading] = useState("");
  const { control, handleSubmit, reset } = methods;
  const { fields, append, replace } = useFieldArray({
    control,
    name: "affiliateList",
  });
  const gridRef = useRef();
  const theme = useTheme();

  const columns = [
    {
      field: "CustomerNum",
      headerName: (
        <b>
          Customer Number <sup style={{ color: "red" }}>*</sup>
        </b>
      ),
      flex: 1,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`affiliateList.${params.row.rhfIndex}.CustomerNum`}
            control={control}
            rules={{
              required:
                "Customer Number is a mandatory field & cannot be empty",
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                onKeyDown={(event) => event.stopPropagation()}
                disabled={true}
                error={!!error}
                onChange={(e) => {
                  // Replace anything that is NOT a number (0-9) with an empty string
                  field.onChange(e.target.value.replace(/[^0-9]/g, ""));
                }}
              />
            )}
          />
        ) : (
          params.value
        ),
    },
    {
      field: "AffiliateName",
      headerName: (
        <b>
          Affiliate Name <sup style={{ color: "red" }}>*</sup>
        </b>
      ),
      flex: 2,
      renderCell: (params) =>
        isEdit ? (
          <Controller
            name={`affiliateList.${params.row.rhfIndex}.AffiliateName`}
            control={control}
            rules={{
              required: "Affiliate Name is a mandatory field & cannot be empty",
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                onKeyDown={(event) => event.stopPropagation()}
                error={!!error}
              />
            )}
          />
        ) : (
          params.value
        ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading("fetching");
      try {
        const res = await api.get("/sac_affiliates/", {
          params: { CustomerNum: customerNum },
        });
        setOriginalData(res.data);
        reset({ affiliateList: res.data });
      } catch (err) {
        console.error("Failed to fetch affiliates:", err);
      } finally {
        setLoading("");
      }
    };
    fetchData();
  }, [customerNum, reset]);

  const onSubmit = (data) => {
    const filteredList = data.affiliateList.filter(
      (item) => item.CustomerNum.trim() || item.AffiliateName.trim(),
    );

    const isSame =
      JSON.stringify(filteredList) === JSON.stringify(originalData);

    if (isSame) {
      reset({ affiliateList: filteredList });
      setIsEdit(false);
      return;
    }

    try {
      setLoading("submitting");
      // if (deleted.length) api.post(`${url}delete`, deleted);
      api.post(`/sac_affiliates/upsert`, filteredList);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Some error occoured, unable to save",
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

    setOriginalData(filteredList);
    reset({ affiliateList: filteredList });
    setIsEdit(false);
  };

  const onError = (errors) => {
    const errVals = Object.values(errors.affiliateList.find((i) => i));

    if (errVals.length > 0) {
      Swal.fire({
        title: "Data Validation Error",
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

  const handleAdd = () => {
    append({ CustomerNum: customerNum, AffiliateName: "" });

    setTimeout(() => {
      const api = gridRef.current;
      if (!api) return;

      api.scrollToIndexes({ rowIndex: fields.length });
    }, 0);
  };

  const handleCancel = () => {
    setIsEdit(false);
    replace(originalData);
  };

  if (loading) return <Loader size={40} height="435px" />;

  return (
    <FormProvider {...methods}>
      <form>
        <>
          <Grid container spacing={2} size={12} justifyContent="space-evenly">
            <Grid>
              <b>Account Name: </b>
              <Typography color="#003150" display="inline">
                {accountName}
              </Typography>
            </Grid>
            <Grid>
              <b>Cust #: </b>
              <Typography color="#003150" display="inline">
                {customerNum}
              </Typography>
            </Grid>
          </Grid>
          <div style={{ height: 350, width: "100%", marginTop: "20px" }}>
            <DataGrid
              rows={fields.map((field, index) => ({
                ...field,
                id: field.id,
                rhfIndex: index,
              }))}
              columns={columns}
              disableColumnMenu
              disableRowSelectionOnClick
              disableSelectionOnClick
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 25 } },
              }}
              pageSizeOptions={[25, 50]}
              apiRef={gridRef}
              localeText={{
                noRowsLabel: "No Affiliates Found",
              }}
            />
          </div>
        </>

        <div style={{ marginTop: 16 }}>
          {!isEdit && (
            <Button
              variant="outlined"
              onClick={() => setIsEdit(true)}
              sx={{ height: "45" }}
              disabled={disableforDirector}
            >
              Edit
            </Button>
          )}
          {isEdit && (
            <>
              <Button
                variant="contained"
                onClick={handleAdd}
                disabled={loading === "submitting"}
                sx={{ height: "45" }}
              >
                Add Row
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: 8 }}
                onClick={handleSubmit(onSubmit, onError)}
                disabled={loading === "submitting"}
                sx={{ height: "45" }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                style={{ marginLeft: 8 }}
                onClick={handleCancel}
                disabled={loading === "submitting"}
                sx={{ height: "45" }}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
