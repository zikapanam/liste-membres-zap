import React from 'react';
import './App.css';
import ZapList from './components/ZapList';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Liste des ZAP</h1>
      <ZapList />
    </div>
  );
};

export default App;
