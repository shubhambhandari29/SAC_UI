import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Modal from "../../../../ui/Modal";
import ReportRecipientList from "../ReportRecipientList";
import MonthRow from "../../../../ui/MonthRow";
import { months } from "../../../../../util";
import useDropdownData from "../../../../../hooks/useDropdownData";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import CurrencyField from "../../../../ui/CurrencyField";

const styles = { display: "grid", placeItems: "center" };

export default function DeductibleBill({ isEnabled }) {
  const { control, setValue, getValues } = useFormContext();
  const [viewRecipientsList, setViewRecipientsList] = useState(false);
  const { data: DistFrequencyData, loading: DistFrequencyLoading } =
    useDropdownData("/dropdowns/DistFrequency");

  return (
    <Grid container spacing={2}>
      {/*Modal for recipients list  */}
      <Modal
        open={viewRecipientsList}
        onClose={() => setViewRecipientsList(false)}
        title="Deductible Bill Report Distribution"
        maxWidth="lg"
      >
        <ReportRecipientList
          url="/deduct_bill_distribution/"
          parameter={{ CustomerNum: getValues("CustomerNum") }}
          getValuesSac={getValues}
        />
      </Modal>

      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }} sx={styles}>
        <FormControl fullWidth>
          <Controller
            name="DeductDistFreq"
            control={control}
            disabled={!isEnabled("DeductDistFreq")}
            render={({ field: { onChange, value, ref, ...fieldProps } }) => (
              <Autocomplete
                {...fieldProps}
                options={DistFrequencyData || []}
                loading={DistFrequencyLoading}
                getOptionLabel={(option) => option.DD_Value || ""}
                isOptionEqualToValue={(option, val) =>
                  option.DD_Value === val?.DD_Value
                }
                value={
                  value
                    ? DistFrequencyData.find(
                        (opt) => opt.DD_Value === value,
                      ) || { DD_Value: value }
                    : null
                }
                onChange={(_, newValue) => {
                  onChange(newValue ? newValue.DD_Value : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Distribution Frequency"
                    inputRef={ref}
                  />
                )}
                slotProps={{
                  paper: {
                    sx: {
                      minWidth: "250px",
                    },
                  },
                }}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 2 }} sx={styles}>
        <Button
          name="DeductCheckAll"
          variant="outlined"
          color="primary"
          fullWidth
          disabled={!isEnabled("DeductCheckAll")}
          onClick={() =>
            months.forEach((_, index) => {
              setValue(`DeductCheckboxes.${index}`, true);
            })
          }
        >
          Check All
        </Button>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 2 }} sx={styles}>
        <Button
          name="DeductUnCheckAll"
          variant="outlined"
          color="primary"
          fullWidth
          disabled={!isEnabled("DeductCheckAll")}
          onClick={() =>
            months.forEach((_, index) => {
              setValue(`DeductCheckboxes.${index}`, false);
            })
          }
        >
          Un-Check All
        </Button>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }} sx={styles}>
        <Button
          name="DeductReportRecipient"
          variant="outlined"
          color="primary"
          fullWidth
          disabled={!isEnabled("DeductReportRecipient")}
          onClick={() => setViewRecipientsList(true)}
        >
          Report Recipients
        </Button>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }} sx={styles}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="DueDate"
            control={control}
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <DatePicker
                {...fieldProps}
                label="Due Date"
                value={value ? dayjs(value) : null}
                disabled={!isEnabled("DueDate")}
                onChange={(newValue) => {
                  onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }} sx={styles}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="ReceivedDate"
            control={control}
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <DatePicker
                {...fieldProps}
                label="Received Date"
                value={value ? dayjs(value) : null}
                disabled={!isEnabled("ReceivedDate")}
                onChange={(newValue) => {
                  onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }} sx={styles}>
        <CurrencyField
          name="TotalAmtDue"
          control={control}
          disabled={!isEnabled("TotalAmtDue")}
          label="Total Amount Due"
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Controller
          name="DeductNotes"
          control={control}
          disabled={!isEnabled("DeductNotes")}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Deduct Bill Notes"
              multiline
              rows={6}
            />
          )}
        />
      </Grid>

      <Grid
        container
        spacing={2}
        size={{ xs: 12 }}
        justifyContent="space-around"
      >
        <Grid
          size={{ xs: 12, sm: 12, md: 12, lg: 6 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {months.map((item, index) =>
            index < 6 ? (
              <MonthRow
                key={index}
                tabName="DeductCheckboxes"
                month={item}
                index={index}
              />
            ) : null,
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
          {months.map((item, index) =>
            index >= 6 ? (
              <MonthRow
                key={index}
                tabName="DeductCheckboxes"
                month={item}
                index={index}
              />
            ) : null,
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
