import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Checkbox,
  FormGroup,
  Container,
  Paper,
  Box,
} from "@mui/material";

const dummyPatients = [
  { id: "P123", name: "Alice Smith", dob: "1990-01-01", gender: "Female", phone: "9876543210", email: "alice@gmail.com" },
  { id: "P456", name: "Bob Jones", dob: "1985-05-10", gender: "Male", phone: "9123456780", email: "bob@yahoo.com" },
];

const communicationOptions = ["Email", "Phone", "WhatsApp"];
const knownEmailDomains = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com", "hotmail.com", "protonmail.com"];

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function Page1({ onNext, initialValues }) {
  const [searchInput, setSearchInput] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    communication: [],
    ...initialValues
  });

  useEffect(() => {
    if (selectedPatient) {
      const age = selectedPatient.dob ? calculateAge(selectedPatient.dob) : "";
      setFormData({
        ...formData,
        ...selectedPatient,
        age,
      });
    }
  }, [selectedPatient]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const newFormData = { ...formData, [field]: value };

    if (field === "dob") {
      newFormData.age = value ? calculateAge(value) : formData.age;
    }

    setFormData(newFormData);
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 1 && Number(value) <= 100)) {
      setFormData({ ...formData, age: value });
    }
  };

  const handleNextClick = () => {
    onNext(formData);
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Autocomplete
            freeSolo
            options={dummyPatients.map((p) => `${p.phone} / ${p.id}`)}
            inputValue={searchInput}
            onInputChange={(e, val) => setSearchInput(val)}
            onChange={(e, val) => {
              const match = dummyPatients.find(
                (p) => val && (val.includes(p.phone) || val.includes(p.id))
              );
              setSelectedPatient(match || null);
            }}
            renderInput={(params) => <TextField {...params} label="Search by Phone or Patient ID" />}
          />

          <TextField label="Name" value={formData.name} onChange={handleChange("name")} />
          <TextField type="date" label="Date of Birth" value={formData.dob} onChange={handleChange("dob")} InputLabelProps={{ shrink: true }} />
          <TextField label="Age" value={formData.age} onChange={handleAgeChange} />
          <FormLabel>Biological Gender</FormLabel>
          <RadioGroup row value={formData.gender} onChange={handleChange("gender")}>
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
            <FormControlLabel value="Transgender" control={<Radio />} label="Transgender" />
          </RadioGroup>
          <TextField label="Phone Number" value={formData.phone} onChange={handleChange("phone")} inputProps={{ maxLength: 10 }} />
          <TextField
            label="Email"
            value={formData.email}
            onChange={handleChange("email")}
            type="email"
            inputProps={{ list: "email-domains" }}
          />
          <datalist id="email-domains">
            {knownEmailDomains.map((domain) => (
              <option key={domain} value={`@${domain}`} />
            ))}
          </datalist>
          <TextField label="Address" value={formData.address} onChange={handleChange("address")} />
          <FormGroup row>
            {communicationOptions.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={formData.communication.includes(option)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...formData.communication, option]
                        : formData.communication.filter((c) => c !== option);
                      setFormData({ ...formData, communication: updated });
                    }}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
          <button onClick={handleNextClick}>Next</button>
        </Box>
      </Paper>
    </Container>
  );
}
