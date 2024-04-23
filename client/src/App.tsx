import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Capitalize Routes and Route

import UserRouter from './Routes/UserRouter';
import AdminRouter from './Routes/AdminRouter';
import Login from './pages/user/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} /> {/* Use element prop */}
        <Route path="/*" element={<UserRouter />} /> {/* Use element prop */}
        {/* <Route path='/login' element={<Login />}></Route> */}
      </Routes>
    </Router>
  );
}

export default App;
