import './App.css';
import React from 'react';
import ConvertJS from './convertJS';
import ConvertRust from './convertRust';

function App() {

  return (
    <div className="App">
       <header className="App-header">
        <h1>
          Convert CSV to PDF
        </h1>
        <div>
            <ConvertJS />
            <ConvertRust />
        </div>
      </header>
    </div>
  );
}

export default App;
