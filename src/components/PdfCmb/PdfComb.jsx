import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

import './PdfComb.css';

const PdfComb = () => {
  const [files, setFiles] = useState([]);
  const [combinedPdf, setCombinedPdf] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFiles = event.target.files;
    setFiles([...files, ...uploadedFiles]);
  };

  const combinePdfs = async () => {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const pdfBytes = await fetch(URL.createObjectURL(file)).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }
    const mergedPdfBytes = await mergedPdf.save();
    setCombinedPdf(new Blob([mergedPdfBytes], { type: 'application/pdf' }));
  };

  return (
    <div className='pdf-combiner'>
      <header>
        <h1>Pdf Combiner</h1>
      </header>
      <div className='file-upload'>
        <input className='file-input' type="file" multiple onChange={handleFileUpload} />
        <button className='combine-button' onClick={combinePdfs}>Combine PDFs</button>
      </div>
      <div className='pdf-preview'>
        {combinedPdf && (
          <iframe src={URL.createObjectURL(combinedPdf)} width="100%" height="600px"></iframe>
        )}
      </div>
      <footer>
        <p>© 2024 Pdf Combiner. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PdfComb;
