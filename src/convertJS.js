import "./App.css";
import React, { useEffect, useRef, useState } from "react";

function ConvertJS() {
  const [converted, setConverted] = useState(false);
  const [timePassed, setTimePassed] = useState(0);

  const isProcessing = useRef(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
  };

  const handleFileDownload = () => {
    //   const pdfBlob = new Blob([pdfData], { type: "application/pdf" });
    //   const link = document.createElement("a");
    //   link.href = window.URL.createObjectURL(pdfBlob);
    //   link.download = "your_pdf_filename.pdf"; // Set the desired file name
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
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
        console.time();

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
        console.timeEnd();

        // Save the PDF
        pdf.save("hello_world.pdf");
      },
    });
  }

  function handleFileConvert() {
    isProcessing.current = true;
    convertCsvToPdf();
    isProcessing.current = false;
  }

  function measureTime() {
    if (isProcessing.current) setTimePassed((timePassed) => timePassed + 0.005);
  }

  useEffect(() => {
    const interval = setInterval(() => measureTime(), 5);

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
        <p>{timePassed.toFixed(4)}</p>
      </div>
    </div>
  );
}

export default ConvertJS;
