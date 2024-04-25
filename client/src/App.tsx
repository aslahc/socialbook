import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Capitalize Routes and Route

import UserRouter from './Routes/UserRouter';
import AdminRouter from './Routes/AdminRouter';
import Login from './pages/user/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} /> 
        <Route path="/*" element={<UserRouter />} /> 
       
      </Routes>
    </Router>
  );
}

export default App;
