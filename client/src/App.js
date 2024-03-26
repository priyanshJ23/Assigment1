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
        <Routes>
          <Route path="/" element={<Userform />} />
          <Route path="/restaurant" element={<AddRestaurantForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
