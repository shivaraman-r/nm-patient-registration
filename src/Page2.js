import React from "react";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  FormGroup,
  Container,
  Paper,
  Box,
  MenuItem,
  Autocomplete,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  ListItemText
} from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const referralSources = ["Self", "Doctor", "Company", "Partner Lab"];
const referringEntitiesBySource = {
  Doctor: ["Dr. Smith", "Dr. Mehta", "Dr. Lee"],
  Company: ["ABC Corp", "XYZ Ltd", "Global Diagnostics"],
  "Partner Lab": ["LabOne", "Central Lab", "Precision Labs"]
};
const testOptions = [
  "Complete Blood Count (CBC)",
  "Lipid Profile",
  "Liver Function Test",
  "Thyroid Panel",
  "Blood Sugar",
  "Urine Routine"
];

export default function MedicalInfoForm({ patientName = "" }) {
  const [symptoms, setSymptoms] = React.useState("");
  const [hasInsurance, setHasInsurance] = React.useState(false);
  const [insuranceProvider, setInsuranceProvider] = React.useState("");
  const [insuranceNumber, setInsuranceNumber] = React.useState("");
  const [consentGiven, setConsentGiven] = React.useState(false);
  const [referralSource, setReferralSource] = React.useState("");
  const [referringEntity, setReferringEntity] = React.useState("");
  const [prescriptionFile, setPrescriptionFile] = React.useState(null);
  const [selectedTests, setSelectedTests] = React.useState([]);

  const handlePrescriptionUpload = (event) => {
    if (event.target.files.length > 0) {
      setPrescriptionFile(event.target.files[0]);
      console.log("Uploaded prescription file:", event.target.files[0]);
    }
  };

  React.useEffect(() => {
    if (referralSource === "Self") {
      setReferringEntity(patientName);
    } else {
      setReferringEntity("");
    }
  }, [referralSource, patientName]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          <TextField
            label="Brief Description of Symptoms"
            variant="outlined"
            multiline
            rows={4}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />

          <FormLabel component="legend">Do you have insurance coverage?</FormLabel>
          <RadioGroup
            row
            value={hasInsurance ? "yes" : "no"}
            onChange={(e) => setHasInsurance(e.target.value === "yes")}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>

          {hasInsurance && (
            <>
              <TextField
                label="Insurance Provider"
                variant="outlined"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
              />
              <TextField
                label="Insurance Number"
                variant="outlined"
                value={insuranceNumber}
                onChange={(e) => setInsuranceNumber(e.target.value)}
              />
            </>
          )}

          <FormControl fullWidth>
            <InputLabel>Referral Source</InputLabel>
            <Select
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              input={<OutlinedInput label="Referral Source" />}
            >
              {referralSources.map((source) => (
                <MenuItem key={source} value={source}>{source}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {referralSource !== "Self" && (
            <Autocomplete
              options={referringEntitiesBySource[referralSource] || []}
              value={referringEntity}
              onChange={(e, newValue) => setReferringEntity(newValue)}
              renderInput={(params) => <TextField {...params} label="Referring Entity" variant="outlined" />}
            />
          )}

          {referralSource === "Self" && (
            <TextField
              label="Referring Entity"
              variant="outlined"
              value={referringEntity}
              disabled
            />
          )}

          <Box>
            <FormLabel>Upload Prescription (Image)</FormLabel>
            <input
              accept="image/*"
              type="file"
              onChange={handlePrescriptionUpload}
              style={{ marginTop: 8 }}
            />
          </Box>

          <FormControl component="fieldset">
            <FormLabel component="legend">Tests Being Ordered</FormLabel>
            <FormGroup>
              {testOptions.map((test) => (
                <FormControlLabel
                  key={test}
                  control={
                    <Checkbox
                      checked={selectedTests.includes(test)}
                      onChange={(e) => {
                        const newTests = e.target.checked
                          ? [...selectedTests, test]
                          : selectedTests.filter((t) => t !== test);
                        setSelectedTests(newTests);
                      }}
                    />
                  }
                  label={test}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                />
              }
              label="I consent to my data being used for medical consultation and processing."
            />
          </FormGroup>
        </Box>
      </Paper>
    </Container>
  );
}
