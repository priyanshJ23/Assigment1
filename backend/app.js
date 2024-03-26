// Here I am Importing required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv").config();

// Now Initializing Express app
const app = express();
const PORT = 5000;

// Doing Middleware setup
app.use(bodyParser.json()); // For Parse incoming request bodies in JSON format
app.use(cors({ origin: "http://localhost:3000" })); // Enable CORS for specified origin so no blocking

// MongoDB connection

mongoose
  .connect(process.env.MONGO_URL)  // Connecting to MongoDB using the URL from environmental variables
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Importing models for database
const Restro = require("./models/Restaurent");
const User = require("./models/User");

// Endpoint for saving user data
app.post("/saveuserapi", async (req, res) => {
  try {
    // Destructuring data from request body
    const { fname, age, gender, latitude, longitude } = req.body;

    // Creating a GeoJSON object for user location
    const userLocation = {
      type: "Point",
      coordinates: [latitude, longitude],
    };

    // Finding the nearest restaurant
    const restaurant = await Restro.findOne();
    if (!restaurant) {
      throw new Error("No restaurant found in the database");
    }

    // Checking if the user is within 500m of the restaurant
    const isWithin500m =
      calculateDistance(
        userLocation.coordinates,
        restaurant.location.coordinates
      ) < 500;

    // Creating a new user instance with the calculated visit status
    const user = new User({
      fname,
      age,
      gender,
      location: {
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      visitedRestaurant: isWithin500m,
    });

    // Saving user data to the database
    await user.save();
    console.log("User data saved successfully");

    // Sending response based on visit status
    res.status(200).json({
      message: isWithin500m
        ? "Thank you for visiting the restaurant"
        : "You are not within 500m of the restaurant",
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(coords1, coords2) {
  // Calculation logic for distance
}

// Endpoint for getting location based on latitude and longitude

app.post("/getlocation", async (req, res) => {
  try {
  
    const { lat, long } = req.body.latlong;

    // API key 
    const apiKey = process.env.OPENCAGE_API_KEY;

    // Making request to geocoding API
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat},${long}&key=${apiKey}&pretty=1`
    );


    const location = response.data.results[0].formatted;

    // Sending location in response
    res.send({ location });
  } catch (error) {
    console.error("Error fetching location:", error.message);
    res.status(500).send("Server Error");
  }
});

// Endpoint for adding a new dummy restaurant
app.post("/api/restaurants", async (req, res) => {
  try {

    const { name, address, latitude, longitude } = req.body;

    // Creating a new restaurant instance
    const newRestaurant = new Restro({
      name,
      address,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });

    // Saving the new restaurant to the database
    await newRestaurant.save();

    // Sending response with the newly added restaurant
    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
