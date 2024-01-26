import './App.css';
import React from 'react';
import ConvertJS from './convertJS';
import ConvertRust from './convertRust';

function App() {

  return (
    <div className="App">
      <div className='exampleCSV-area'>
        <a href={process.env.PUBLIC_URL + "/example.csv"}>Download example CSV ↓</a>
      </div>
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
