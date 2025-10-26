'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import react-pdf components with SSR disabled
const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

// Import pdfjs separately and configure it
import { pdfjs } from 'react-pdf';

// Use CDN worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function FilesViewCore({ isOpen, onClose, fileData }: any) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [isOpen]);

  if (!isOpen || !fileData?.file_url) return null;
  const fileUrl = fileData.file_url;
  const fileExtension = fileUrl.split('.').pop()?.toLowerCase();

  const onDocumentLoadSuccess = ({ numPages }: any) => setNumPages(numPages);
  const onDocumentLoadError = (error: any) => {
    console.error('PDF load error:', error);
    setPdfError('Failed to load PDF.');
  };

  const renderFilePreview = () => {
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension!)) {
      return <img src={fileUrl} alt="preview" className="max-w-full max-h-[80vh] mx-auto" />;
    } else if (fileExtension === 'pdf') {
      return (
        <div ref={containerRef} className="w-full max-w-full overflow-auto bg-gray-100 min-h-[300px] flex justify-center">
          {pdfError ? (
            <div className="text-red-500 p-4">{pdfError}</div>
          ) : (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="text-gray-500 p-4">Loading PDF...</div>}
            >
              <Page
                pageNumber={1}
                width={Math.min(containerWidth, 800)}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>
          )}
        </div>
      );
    } else {
      return <p className="text-red-500 p-4 text-center">Preview not available</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl relative flex flex-col">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-xl font-bold">
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">File Preview</h2>
        <div className="flex-1 overflow-auto">{renderFilePreview()}</div>
      </div>
    </div>
  );
}

export default FilesViewCore;