// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Signin from './components/Signin/Signin';
import SpreadsheetPage from './components/Spreadsheet/Spreadsheet';
import SpreadsheetsPage from './components/Spreadsheets/SpreadsheetsPage';
import 'handsontable/dist/handsontable.full.min.css';
import { registerAllModules } from 'handsontable/registry';
import Providers from './Providers'; // Import the Providers

registerAllModules();

function App() {
  return (
    <Providers>
      <Router>
        <div>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/spreadsheets" element={<SpreadsheetsPage />} />
            <Route path="/spreadsheet/:id" element={<SpreadsheetPage />} />
          </Routes>
        </div>
      </Router>
    </Providers>
  );
}

export default App;
