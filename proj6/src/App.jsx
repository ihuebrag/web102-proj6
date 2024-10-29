import React from 'react';
import CharacterList from './CharacterList.jsx';
import MyChartComponent from './chartComponent.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Marvel</h1>
      <div className="components">
        <CharacterList />
        <MyChartComponent />
      </div>
      {/* You can add any additional static routes/components here if needed */}
    </div>
  );
}

export default App;
