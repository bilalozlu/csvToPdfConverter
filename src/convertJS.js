import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";

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
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const href = window.URL.createObjectURL(response.data);

        const anchorElement = document.createElement("a");

        anchorElement.href = href;
        anchorElement.download = fileName;

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }

  function convertCsvToPdf() {
    const csvFileInput = document.getElementById("csvFileInput");

    // Check if a file is selected
    if (!csvFileInput.files || csvFileInput.files.length === 0) {
      alert("Please select a CSV file");
      return;
    }

    // Get the selected file
    const csvFile = csvFileInput.files[0];

    // Use PapaParse to parse CSV to JSON
    Papa.parse(csvFile, {
      complete: function (result) {
        const data = result.data;

        // Create a PDF document
        const pdf = new window.jspdf.jsPDF();

        // Set the number of rows per page
        const rowsPerPage = 29;

        // Set the column headers
        const headers = data[0];

        // Calculate the number of pages needed
        const totalRows = data.length - 1; // Excluding header
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        // Generate PDF pages
        for (let page = 0; page < totalPages; page++) {
          // Skip adding a new page for the first iteration
          if (page > 0) {
            pdf.addPage();
          }

          const startIndex = page * rowsPerPage + 1;
          const endIndex = Math.min(startIndex + rowsPerPage, totalRows + 1);
          const rows = data.slice(startIndex, endIndex);

          // Set the table headers
          pdf.setFontSize(15);
          pdf.setFont("Courier");
          pdf.text(10, 10, headers.join(","));

          // Set the table rows
          pdf.setFontSize(15);
          pdf.setFont("Courier");
          let startY = 20;

          rows.forEach((row) => {
            pdf.text(10, startY, row.join(","));
            startY += 9.9;
          });
        }

        // Save the PDF
        pdf.save("hello_world.pdf");
      },
    });
  }

  function handleFileConvert() {
    isProcessing = true;

    //place converter code here

    convertCsvToPdf();
    setTimeout(() => {
      console.log("done");
      setConverted(true);
      isProcessing = false;
    }, 3000);
  }

  function measureTime() {
    if (isProcessing) setTimePassed((timePassed) => timePassed + 0.1);
  }

  useEffect(() => {
    const interval = setInterval(() => measureTime(), 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div className="js">
        <p>convert with js</p>
        <label>
          <input type="file" id="csvFileInput" onChange={handleFileUpload} />
        </label>
        {converted ? (
          <button
            onClick={() =>
              handleFileDownload(
                "http://localhost:3333/BNK3.pdf",
                "randommmmm.pdf"
              )
            }
          >
            Download file ↓
          </button>
        ) : (
          <button onClick={handleFileConvert} disabled={false}>
            Convert file
          </button>
        )}
        <p>{timePassed.toFixed(1)}</p>
      </div>
    </div>
  );
}

export default ConvertJS;
