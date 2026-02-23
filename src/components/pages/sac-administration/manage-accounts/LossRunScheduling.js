import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import MonthRow from "../../../ui/MonthRow";
import Modal from "../../../ui/Modal";
import { useEffect, useState } from "react";
import ReportRecipientList from "./ReportRecipientList";
import { useLocation } from "react-router-dom";
import useDropdownData from "../../../../hooks/useDropdownData";
import { months } from "../../../../util";

const styles = { display: "grid", placeItems: "center" };

export default function LossRunScheduling({ isEnabled }) {
  const { control, setValue, getValues } = useFormContext();
  const [viewRecipientsList, setViewRecipientsList] = useState(false);
  const { pathname } = useLocation();
  const { data: DistFrequencyData, loading: DistFrequencyLoading } =
    useDropdownData("/dropdowns/DistFrequency");
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(getValues("AddCommentLossRun"));
  }, [getValues]);

  return (
    <Grid container spacing={2}>
      {/*Modal for recipients list  */}
      <Modal
        open={viewRecipientsList}
        onClose={() => setViewRecipientsList(false)}
        title="Loss Run Report Distribution"
        maxWidth="lg"
      >
        <ReportRecipientList
          url={
            pathname.includes("affinity")
              ? "/loss_run_distribution_affinity/"
              : "/loss_run_distribution/"
          }
          parameter={{
            [pathname.includes("sac") ? "CustomerNum" : "ProgramName"]:
              pathname.includes("sac")
                ? getValues("CustomerNum")
                : getValues("ProgramName"),
          }}
          getValuesSac={getValues}
        />
      </Modal>

      {pathname.includes("sac") && (
        <Grid
          size={{ xs: 12, sm: 12, md: 12 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: isChecked ? "red" : "inherit",
              fontWeight: isChecked ? "700" : "500",
              display: "inline",
            }}
          >
            See additional notes for special instructions
          </Typography>
          <Checkbox
            name="AddCommentLossRun"
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.checked);
              setValue("AddCommentLossRun", e.target.checked);
            }}
            disabled={!isEnabled("AddCommentLossRun")}
          />
        </Grid>
      )}

      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }} sx={styles}>
        <FormControl fullWidth>
          <Controller
            name="LossRunDistFreq"
            control={control}
            disabled={!isEnabled("LossRunDistFreq")}
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
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2 }} sx={styles}>
        <Button
          name="LossRunCheckAll"
          variant="outlined"
          color="primary"
          disabled={!isEnabled("LossRunCheckAll")}
          onClick={() =>
            months.forEach((_, index) => {
              setValue(`LossRunCheckboxes.${index}.checked`, true);
            })
          }
          fullWidth
        >
          Check All
        </Button>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2 }} sx={styles}>
        <Button
          name="LossRunUnCheckAll"
          type="button"
          variant="outlined"
          disabled={!isEnabled("LossRunCheckAll")}
          onClick={() =>
            months.forEach((_, index) => {
              setValue(`LossRunCheckboxes.${index}.checked`, false);
            })
          }
          fullWidth
        >
          Un-Check All
        </Button>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }} sx={styles}>
        <Button
          name="LossRunReportRecipient"
          type="button"
          variant="outlined"
          disabled={!isEnabled("LossRunReportRecipient")}
          onClick={() => setViewRecipientsList(true)}
          fullWidth
        >
          See Loss Run Report Recipients List
        </Button>
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
                tabName="LossRunCheckboxes"
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
                tabName="LossRunCheckboxes"
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
