import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import init, * as wasmModule from "./rustcsvpdf/rustcsvpdf.js";

function ConvertRust() {
  const [converted, setConverted] = useState(false);
  const [timePassed, setTimePassed] = useState(0);
  const [fileContent, setFileContent] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  const isProcessing = useRef(false);

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
    link.download = "rust-result"; // Set the desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleFileConvert() {
    isProcessing.current = true;
    const startTime = new Date().getTime();
    const convertedFileContent = wasmModule.entrypoint(fileContent);
    const endTime = new Date().getTime();
    const timeDiff = endTime - startTime; //in ms,
    setTimePassed(timeDiff);
    setPdfData(convertedFileContent);
    setConverted(true);

    // let timeDiff = endTime - startTime;
    isProcessing.current = false;
    // console.log("Conversion took " + timeDiff / 1000 + " seconds with rust.");
  }

  const run = async () => {
    await init("./rustcsvpdf_bg.wasm");
    window.wasmModule = wasmModule;
  };

  useEffect(() => {
    async function initializeWasmModule() {
      await run();
      // init();
      console.log("wasm module is ready");
    }
    initializeWasmModule();
  }, []);

  return (
    <div className="App">
      <div className="rust">
        <img src="/rust.png" alt="Rust logo" height={150} />
        <label>
          <input type="file" onChange={handleFileUpload} />
          {converted ? (
            <button onClick={() => handleFileDownload("hello_world.pdf")}>
              Download file ↓
            </button>
          ) : (
            <button onClick={handleFileConvert}>Convert file</button>
          )}
        </label>
        <p>{timePassed} ms</p>
      </div>
    </div>
  );
}

export default ConvertRust;
