import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { format, differenceInYears } from "date-fns";

const KNOWN_EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "icloud.com"];
const dummyPatients = ["1234567890", "P00123", "P00456"];

export default function PatientInfoForm() {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleDobChange = (e) => {
    const value = e.target.value;
    console.log("DOB changed to:", value);
    setDob(value);
    if (value) {
      const calculatedAge = differenceInYears(new Date(), new Date(value));
      console.log("Calculated age from DOB:", calculatedAge);
      setAge(calculatedAge);
    } else {
      console.log("DOB cleared, resetting age");
      setAge("");
    }
  };

  const handleAgeChange = (e) => {
    if (!dob) {
      const value = e.target.value;
      console.log("Age input changed to:", value);
      if (value >= 1 && value <= 100) {
        setAge(value);
      } else {
        console.warn("Invalid age input:", value);
        setAge("");
      }
    }
  };

  const filteredEmailSuggestions = email.includes("@") ? [] : KNOWN_EMAIL_DOMAINS.map(domain => `${email}@${domain}`);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Autocomplete
            freeSolo
            options={dummyPatients}
            inputValue={searchValue}
            onInputChange={(event, newInputValue) => {
              console.log("Search input changed to:", newInputValue);
              setSearchValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Search by Phone or Patient ID" variant="outlined" />
            )}
          />

          <TextField label="Name" variant="outlined" onChange={(e) => console.log("Name input:", e.target.value)} />

          <TextField
            label="Date of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dob}
            onChange={handleDobChange}
          />

          <TextField
            label="Age"
            type="number"
            value={age}
            onChange={handleAgeChange}
            disabled={!!dob}
            placeholder="Enter age if DoB not available"
          />

          <FormLabel>Biological Gender</FormLabel>
          <RadioGroup row defaultValue="male" onChange={(e) => console.log("Gender selected:", e.target.value)}>
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="transgender" control={<Radio />} label="Transgender" />
          </RadioGroup>

          <TextField
            label="Phone Number"
            type="text"
            inputProps={{ pattern: "\\d{10}", maxLength: 10 }}
            placeholder="10-digit phone number"
            onChange={(e) => console.log("Phone number input:", e.target.value)}
          />

          <Autocomplete
            freeSolo
            options={filteredEmailSuggestions}
            inputValue={email}
            onInputChange={(e, newValue) => {
              console.log("Email input changed to:", newValue);
              setEmail(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Email Address" type="email" />}
          />

          <FormLabel>Communication Preference</FormLabel>
          <FormGroup row>
            <FormControlLabel control={<Checkbox onChange={(e) => console.log("Email preference:", e.target.checked)} />} label="Email" />
            <FormControlLabel control={<Checkbox onChange={(e) => console.log("Phone preference:", e.target.checked)} />} label="Phone" />
            <FormControlLabel control={<Checkbox onChange={(e) => console.log("WhatsApp preference:", e.target.checked)} />} label="WhatsApp" />
          </FormGroup>
        </Box>
      </Paper>
    </Container>
  );
}
