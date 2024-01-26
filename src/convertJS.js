import React, { useState } from "react";
import "./App.css";

function ConvertJS() {
  const [timePassed, setTimePassed] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
  };

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
    window.Papa.parse(csvFile, {
      complete: function (result) {
        const data = result.data;
        const startTime = new Date().getTime();

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
        const endTime = new Date().getTime();
        const timeDiff = endTime - startTime; //in ms,
        setTimePassed(timeDiff);

        pdf.save("js-result.pdf");
      },
    });
  }

  return (
    <div className="App">
      <div className="js">
        <p>convert with js</p>
        <label>
          <input type="file" id="csvFileInput" onChange={handleFileUpload} />
        </label>
        <button onClick={convertCsvToPdf}>Convert file</button>
        <p>{timePassed} ms</p>
      </div>
    </div>
  );
}

export default ConvertJS;
