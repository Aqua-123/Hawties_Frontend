import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Signin from './components/Signin/Signin';
import SpreadsheetPage from './components/Spreadsheet/Spreadsheet';
import SpreadsheetsPage from './components/Spreadsheets/SpreadsheetsPage';
import { PrimeReactProvider } from 'primereact/api';
import 'handsontable/dist/handsontable.full.min.css';
import { registerAllModules } from 'handsontable/registry';

registerAllModules();

function App() {
  return (
    <PrimeReactProvider>
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
    </PrimeReactProvider>
  );
}

export default App;
