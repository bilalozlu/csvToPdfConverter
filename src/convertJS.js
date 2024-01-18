import './App.css';
import axios from 'axios';
import React, {useEffect, useState} from 'react';

function ConvertJS() {
    const [uploaded, setUploaded] = useState(false);
    const [converted, setConverted] = useState(false);
    const [timePassed, setTimePassed] = useState(0);

    let isProcessing = false;

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      axios
        .post("http://localhost:3333/public", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          //isUploaded = true;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    function handleFileDownload(url, fileName) {
      return axios({
        url,
        method: 'GET',
        responseType: 'blob',
      })
        .then(response => {
          const href = window.URL.createObjectURL(response.data);
    
          const anchorElement = document.createElement('a');
    
          anchorElement.href = href;
          anchorElement.download = fileName;
    
          document.body.appendChild(anchorElement);
          anchorElement.click();
    
          document.body.removeChild(anchorElement);
          window.URL.revokeObjectURL(href);
        })
        .catch(error => {
          console.log('error: ', error);
        });
    }

    function handleFileConvert() {
        isProcessing = true;


        //place converter code here
        setTimeout(() => {
            console.log("done");
            setConverted(true);
            isProcessing = false;
      }, 3000);
    }

    function measureTime() {
      if (isProcessing)
        setTimePassed((timePassed) => timePassed + 0.001)
    }

    useEffect(() => {
      const interval = setInterval(() => 
        measureTime()
      , 1);
    
      return () => clearInterval(interval);
    }, []);

  return (
    <div className="App">
        <div className="js">
            <p>convert with js</p>
            <label>
              <input type="file" onChange={handleFileUpload} />
            </label>
            {converted ? 
              <button onClick={() => handleFileDownload("http://localhost:3333/BNK3.pdf", "hello_world.pdf")}>Download file ↓</button>
              :
              <button onClick={handleFileConvert} disabled={false}>Convert file</button>
            }
            <p>{timePassed.toFixed(3)}</p>
        </div>
    </div>
  );
}

export default ConvertJS;
