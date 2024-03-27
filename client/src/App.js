import React from 'react';
import AddRestaurantForm from './Restaurent'; 
import Userform from './Form'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

import Navbar from './Navbar'; 

function App() {
  return (
    <Router> 
      <div>
        <Navbar /> 
        <Routes> {/* Defining routes */}
          {/* Route for the home page */}
          <Route path="/" element={<Userform />} /> 
          {/* Route for adding a restaurant */}
          <Route path="/restaurant" element={<AddRestaurantForm />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
