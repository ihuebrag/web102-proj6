import React from 'react';
import CharacterList from './CharacterList.jsx';
import MyChartComponent from './chartComponent.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CharacterDetail from './characterDetail.jsx';
import App from './App.jsx';


function Routing() {
  return (
    <Router> {/* Move the Router here to wrap the entire app */}
        <Routes>
            <Route path="/" element={<App />} />  {/* Define your Home component */}
            <Route path="/mainpage" element={<App />} />
            <Route path="/character/:id" element={<CharacterDetail />} />
        </Routes>
    </Router>
  );
}

export default Routing;
