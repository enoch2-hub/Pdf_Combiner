import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

import './PdfComb.css';

const PdfComb = () => {
  const [files, setFiles] = useState([]);
  const [combinedPdf, setCombinedPdf] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false); // New state for drag-and-drop

  const handleFileUpload = (event) => {
    // This function will now handle both input file selection and dropped files
    const uploadedFiles = event.target.files || Array.from(event.dataTransfer.files).filter(file => file.type === 'application/pdf');
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add a visual cue for the user that files can be dropped
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleFileUpload(e); // Use the existing file upload handler for dropped files
  };

  const combinePdfs = async () => {
    if (files.length === 0) {
      alert("Please add PDF files to combine.");
      return;
    }

    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      try {
        const pdfBytes = await file.arrayBuffer(); // Use file.arrayBuffer() directly
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      } catch (error) {
        console.error("Error processing PDF file:", file.name, error);
        alert(`Failed to process ${file.name}. Please ensure it's a valid PDF.`);
      }
    }
    const mergedPdfBytes = await mergedPdf.save();
    setCombinedPdf(new Blob([mergedPdfBytes], { type: 'application/pdf' }));
  };

  return (
    <div className='pdf-combiner'>
      <header>
        <h1>Pdf Combiner</h1>
      </header>
      {/* The drag-and-drop area */}
      <div
        className={`drop-zone ${isDragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          className='file-input'
          type="file"
          multiple
          onChange={handleFileUpload}
          // Make the input invisible but still accessible for direct file selection
          style={{ display: 'none' }}
          id="file-upload-input"
        />
        <label htmlFor="file-upload-input" className="drop-zone-text">
          {isDragActive ? "Drop here!" : "Drag & Drop PDFs here or click to select files"}
        </label>
      </div>

      <button className='combine-button' onClick={combinePdfs}>Combine PDFs</button>

      {files.length > 0 && (
        <div className="file-list">
          <h3>Files to combine:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className='pdf-preview'>
        {combinedPdf && (
          <iframe src={URL.createObjectURL(combinedPdf)} width="100%" height="600px" title="Combined PDF"></iframe>
        )}
      </div>
      <footer>
        <p>© 2024 Pdf Combiner. All rights reserved.</p>
        <p>~Enoch</p>
      </footer>
    </div>
  );
};

export default PdfComb;