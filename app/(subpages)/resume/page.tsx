"use client";

import { useRef, useEffect } from 'react';
import styles from './resume.module.css';
//import { useRouter } from 'next/navigation';
import { resumeID } from '@lib/social-links';

// Error boundary to catch PDF rendering errors
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.errorBoundary}>
      {children}
    </div>
  );
}

export default function ResumePage() {

  const GOOGLE_DRIVE_FILE_ID = resumeID;
  const EMBED_URL = `https://drive.google.com/file/d/${GOOGLE_DRIVE_FILE_ID}/preview`;
  const DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_FILE_ID}`;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  //const router = useRouter();

  // Handle iframe load and cleanup
  useEffect(() => {
    const iframe = iframeRef.current; // Capture ref value when effect runs
    return () => {
      // Use captured value in cleanup to avoid stale ref warnings
      if (iframe) {
        iframe.src = 'about:blank';
      }
    };
  }, []);

  // Handle iframe errors
  const handleIframeError = () => {
    if (iframeRef.current) {
      iframeRef.current.style.display = 'none';
    }
    const container = document.querySelector(`.${styles.pdfContainer}`);
    if (container) {
      const errorDiv = document.createElement('div');
      errorDiv.className = styles.error;
      errorDiv.textContent = 'Error loading PDF. Please use the download link instead.';
      container.appendChild(errorDiv);
    }
  };

  return (
    <section className={styles.container}>
      <h1>Résumé</h1>
      <p className={styles.downloadLink}>
        <a href={DOWNLOAD_URL} download="arvin-singh-resume.pdf" target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>
      </p>

      <ErrorBoundary>
        <div className={styles.pdfContainer}>
          <iframe
            ref={iframeRef}
            src={EMBED_URL}
            className={styles.pdfFrame}
            title="Resume PDF"
            loading="lazy"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="auto"
            onError={handleIframeError}
            allow="autoplay"
          />
        </div>
      </ErrorBoundary>
    </section>
  );
}
