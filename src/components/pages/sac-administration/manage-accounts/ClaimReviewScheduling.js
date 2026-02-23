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
import { useEffect, useState } from "react";
import Modal from "../../../ui/Modal";
import ReportRecipientList from "./ReportRecipientList";
import { months } from "../../../../util";
import useDropdownData from "../../../../hooks/useDropdownData";
import { useLocation } from "react-router-dom";
import CurrencyField from "../../../ui/CurrencyField";

export default function ClaimReviewScheduling({ isEnabled }) {
  const { control, setValue, getValues } = useFormContext();
  const [viewRecipientsList, setViewRecipientsList] = useState(false);
  const { pathname } = useLocation();
  const { data: DistFrequencyData, loading: DistFrequencyLoading } =
    useDropdownData("/dropdowns/DistFrequency");
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(getValues("AddCommentClaimReview"));
  }, [getValues]);

  return (
    <Grid container spacing={2}>
      {/*Modal for recipients list  */}
      <Modal
        open={viewRecipientsList}
        onClose={() => setViewRecipientsList(false)}
        title="Claim Review Scheduling Report Distribution"
        maxWidth="lg"
      >
        <ReportRecipientList
          url={
            pathname.includes("affinity")
              ? "/claim_review_distribution_affinity/"
              : "/claim_review_distribution/"
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
            name="AddCommentClaimReview"
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.checked);
              setValue("AddCommentClaimReview", e.target.checked);
            }}
            disabled={!isEnabled("AddCommentClaimReview")}
          />
        </Grid>
      )}

      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth>
          <Controller
            name="ClaimRevDistFreq"
            control={control}
            disabled={!isEnabled("ClaimRevDistFreq")}
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
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth>
          <CurrencyField
            name="CRThresh"
            control={control}
            disabled={!isEnabled("CRThresh")}
            label="Claim Review Threshold"
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Button
          name="ClaimRevCheckAll"
          variant="outlined"
          color="primary"
          disabled={!isEnabled("ClaimRevCheckAll")}
          onClick={() =>
            months.forEach((_, index) => {
              setValue(`ClaimRevCheckboxes.${index}.checked`, true);
            })
          }
          fullWidth
        >
          Check All
        </Button>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Button
          name="ClaimRevUnCheckAll"
          type="button"
          variant="outlined"
          sx={{ ml: 2 }}
          disabled={!isEnabled("ClaimRevCheckAll")}
          onClick={() =>
            months.forEach((_, index) => {
              setValue(`ClaimRevCheckboxes.${index}.checked`, false);
            })
          }
          fullWidth
        >
          Un-Check All
        </Button>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Button
          name="ClaimRevReportRecipient"
          type="button"
          variant="outlined"
          sx={{ ml: 2 }}
          disabled={!isEnabled("ClaimRevReportRecipient")}
          onClick={() => setViewRecipientsList(true)}
          fullWidth
        >
          Claim Review Scheduling Report Recipients List
        </Button>
      </Grid>

      <Grid container spacing={2} size={12} justifyContent="space-around">
        <Grid
          size={{ xs: 12 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {months.map((item, index) => (
            <MonthRow
              key={index}
              tabName="ClaimRevCheckboxes"
              month={item}
              index={index}
            />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
