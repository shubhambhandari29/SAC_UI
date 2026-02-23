import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { MdOutlineCancel } from "react-icons/md";

export default function CctInstructionsPolicy({ isEnabled }) {
  const { control, setValue } = useFormContext();

  return (
    <Grid container spacing={1} flexDirection="column">
      <Grid container spacing={2}>
        <Grid size={4}>
          <FormControl fullWidth>
            <InputLabel>Business Line</InputLabel>
            <Controller
              name="CCTBusLine"
              control={control}
              disabled={!isEnabled("CCTBusLine")}
              render={({ field }) => (
                <Select {...field} value={field.value} label="Business Line">
                  <MenuItem value="Auto">Auto</MenuItem>
                  <MenuItem value="WC">WC</MenuItem>
                  <MenuItem value="Package">Package</MenuItem>
                  <MenuItem value="Liability">Liability</MenuItem>
                  <MenuItem value="Property">Property</MenuItem>
                  <MenuItem value="BOP">BOP</MenuItem>
                  <MenuItem value="Marine">Marine</MenuItem>
                  <MenuItem value="Umbrella">Umbrella</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={4}>
          <FormControl fullWidth>
            <InputLabel>Accounts With Products Claims</InputLabel>
            <Controller
              name="AcctProdClaims"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || []}
                  label="Accounts With Products Claims"
                  disabled={!isEnabled("AcctProdClaims")}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={4}>
          <FormControl fullWidth>
            <InputLabel>Accounts With Valet Coverage</InputLabel>
            <Controller
              name="AcctValetCov"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || []}
                  label="Accounts With Valet Coverage"
                  disabled={!isEnabled("AcctValetCov")}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid
          size={4}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FormLabel
            id="UnManPol"
            sx={{ color: "black", mr: "10px", textAlign: "center" }}
          >
            Unverified Manual Policy?
          </FormLabel>
          <Controller
            name="UnManPol"
            control={control}
            render={({ field }) => (
              <RadioGroup
                row
                {...field}
                sx={{
                  border: "1px solid lightgrey",
                  borderRadius: "15px",
                  pl: 0.5,
                }}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio disabled={!isEnabled("UnManPol")} />}
                  label="Yes"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio disabled={!isEnabled("UnManPol")} />}
                  label="No"
                />
              </RadioGroup>
            )}
          />
        </Grid>
        <Grid
          size={4}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FormLabel
            id="CCTAutoYN"
            sx={{ color: "black", mr: "10px", textAlign: "center" }}
          >
            Auto <br />
            Policy
          </FormLabel>
          <Controller
            name="CCTAutoYN"
            control={control}
            render={({ field }) => (
              <RadioGroup
                row
                {...field}
                sx={{
                  border: "1px solid lightgrey",
                  borderRadius: "15px",
                  pl: 0.5,
                }}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio disabled={!isEnabled("CCTAutoYN")} />}
                  label="Composite Rated"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio disabled={!isEnabled("CCTAutoYN")} />}
                  label="Specified Auto"
                />
              </RadioGroup>
            )}
          />
          <Button
            type="button"
            variant="text"
            sx={{
              minWidth: "unset",
              width: "35px",
              height: "30px",
              padding: "0px",
            }}
            onClick={() => setValue(`CCTAutoYN`, undefined)}
            disabled={!isEnabled("CCTAutoYN")}
          >
            <MdOutlineCancel size={24} />
          </Button>
        </Grid>
        <Grid
          size={4}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FormLabel
            id="RentedHired"
            sx={{ color: "black", mr: "10px", textAlign: "center" }}
          >
            Rented <br />
            or Hired
          </FormLabel>
          <Controller
            name="RentedHired"
            control={control}
            render={({ field }) => (
              <RadioGroup
                row
                {...field}
                sx={{
                  border: "1px solid lightgrey",
                  borderRadius: "15px",
                  pl: 0.5,
                }}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio disabled={!isEnabled("RentedHired")} />}
                  label="Composite Rated"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio disabled={!isEnabled("RentedHired")} />}
                  label="Specified Auto"
                />
              </RadioGroup>
            )}
          />
          <Button
            type="button"
            variant="text"
            sx={{
              minWidth: "unset",
              width: "35px",
              height: "30px",
              padding: "0px",
            }}
            onClick={() => setValue(`RentedHired`, undefined)}
            disabled={!isEnabled("RentedHired")}
          >
            <MdOutlineCancel size={24} />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
