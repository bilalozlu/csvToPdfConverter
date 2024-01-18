import "./App.css";
import React, { useEffect, useState } from "react";
import init, * as wasmModule from "./rustcsvpdf/rustcsvpdf.js";

function ConvertRust() {
  //const [uploaded, setUploaded] = useState(false);
  const [converted, setConverted] = useState(false);
  const [timePassed, setTimePassed] = useState(0);
  const [fileContent, setFileContent] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  let isProcessing = false;

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const content = await file.text();
    setFileContent(content);
  };

  function handleFileDownload(url, fileName) {
    const pdfBlob = new Blob([pdfData], { type: "application/pdf" });

    // opens the file on a new tab
    // const pdfUrl = URL.createObjectURL(pdfBlob);
    // window.open(pdfUrl, "_blank");

    //downloads the file

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(pdfBlob);
    link.download = "your_pdf_filename.pdf"; // Set the desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleFileConvert() {
    const startTime = new Date();

    //place converter code here
    const convertedFileContent = wasmModule.entrypoint(fileContent);
    setPdfData(convertedFileContent);
    const endTime = new Date();
    setConverted(true);

    let timeDiff = endTime - startTime;

    console.log("Conversion took " + timeDiff / 1000 + " seconds with rust.");
  }

  function measureTime() {
    if (isProcessing) setTimePassed((timePassed) => timePassed + 0.001);
  }

  useEffect(() => {
    const interval = setInterval(() => measureTime(), 1);

    return () => clearInterval(interval);
  }, []);

  const run = async () => {
    await init("./rustcsvpdf_bg.wasm");
    window.wasmModule = wasmModule;
  };

  useEffect(() => {
    async function initializeWasmModule() {
      await run();
      init();
      console.log("wasm module is ready");
    }
    initializeWasmModule();
  }, []);

  return (
    <div className="App">
      <div className="rust">
        <p>convert with rust</p>
        <label>
          <input type="file" onChange={handleFileUpload} />
        </label>
        {converted ? (
          <button
            onClick={() =>
              handleFileDownload(
                "http://localhost:3333/BNK3.pdf",
                "hello_world.pdf"
              )
            }
          >
            Download file ↓
          </button>
        ) : (
          <button onClick={handleFileConvert}>Convert file</button>
        )}
        <p>{timePassed.toFixed(3)}</p>
      </div>
    </div>
  );
}

export default ConvertRust;
