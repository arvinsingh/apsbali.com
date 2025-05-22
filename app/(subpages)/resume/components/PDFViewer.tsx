"use client";

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import styles from '../resume.module.css';

const PDFViewer = ({ url }: { url: string }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className={styles.pdfContainer}>
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className={styles.loading}>Loading résumé...</div>}
        error={<div className={styles.error}>Error loading résumé. Please try again later.</div>}
        className={styles.document}
      >
        {Array.from(new Array(numPages || 0), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className={styles.page}
          />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
