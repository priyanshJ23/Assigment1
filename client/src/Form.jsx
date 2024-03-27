/*
1) In This component I defines a form for collecting user data including name, age, and gender nd fetching current location of users browser
2) Here i used Material-UI components for styling the form components
3) In this file i uses React hooks (useState and useeffeect) to manage form state and loading state.
4) The handleLocation function fetches the user's current location using the browser's geolocation API.
5) The handleSubmit function submits the form data along with the current location to a backend API endpoint.(/saveuserapi)
6) Feedback messages are displayed to the user via alerts based on the response from the backend we will get, if ok then thankyou.

*/

import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";

/* Styling Components */
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function UserForm() {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    fname:"",
    age: "",
    gender: "",
    latitude: null,
    longitude: null,
  });
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLocation = async (e) => {
    setLoading(true);
    e.preventDefault();
    let navLocation = () => {
      return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
      });
    };
    let latlong = await navLocation().then((res) => {
      let latitude = res.coords.latitude;
      let longitude = res.coords.longitude;
      return [latitude, longitude];
    });
    let [lat, long] = latlong;
    const response = await fetch("https://assigment1-ord8.onrender.com/getlocation/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latlong: { lat, long } }),
    });
    const { location } = await response.json();
    setAddress(location);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let navLocation = () => {
        return new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej);
        });
      };
      // Fetching the current location using coordinates
      let latlong = await navLocation();
      let latitude = latlong.coords.latitude;
      let longitude = latlong.coords.longitude;

      // Updating the formData with latitude and longitude
      setFormData((prevState) => ({
        ...prevState,
        latitude,
        longitude,
      }));

      console.log(formData);

      // Making POST request to save user data
      const response = await fetch("https://assigment1-ord8.onrender.com/saveuserapi/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send form data along with location
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        console.error("Error saving user data:", data.message);
        alert("User is not within 500m");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          User Data
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid item xs={12} style={{ marginBottom: "16px" }}>
            <TextField
              autoComplete="fname"
              name="fname"
              variant="outlined"
              required
              fullWidth
              id="fname"
              label="Name:"
              autoFocus
              value={formData.fname}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} style={{ marginBottom: "16px" }}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="age"
              label="Age"
              type="number"
              id="age"
              value={formData.age}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} style={{ marginBottom: "16px" }}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} style={{ marginBottom: "16px" }}>
            {loading ? (
              <CircularProgress /> // Display loading indicator while fetching location
            ) : (
              <Typography>{address}</Typography> // Display the fetched location
            )}
          </Grid>
          <Grid item xs={12} style={{ marginBottom: "16px" }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleLocation}
            >
              Current Location
            </Button>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit Data
          </Button>
        </form>
      </div>
    </Container>
  );
}
