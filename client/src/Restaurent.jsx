import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography, Grid } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "70%", 
    marginTop: theme.spacing(3),
  },
  textField: {
    marginBottom: theme.spacing(2), 
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function AddRestaurantForm() {
  const classes = useStyles();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/restaurants/', {
        name,
        address,
        latitude,
        longitude,
      });
      console.log('Restaurant added:', response.data);
      alert("Restaurent Added Successfully");
      setName('');
      setAddress('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      console.error('Error adding restaurant:', error);
    }
  };

  return (
    <div className={classes.paper}>
      <Typography variant="h5" gutterBottom>Add Restaurant</Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Latitude"
              variant="outlined"
              fullWidth
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Longitude"
              variant="outlined"
              fullWidth
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary" className={classes.submit}>Add Restaurant</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default AddRestaurantForm;
