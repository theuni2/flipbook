// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// // import { GlobalWorkerOptions } from "pdfjs-dist";
// // import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs";

// // GlobalWorkerOptions.workerSrc = workerSrc;

// import { GlobalWorkerOptions } from "pdfjs-dist";

// GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



// /**
//  * Next.js (App Router) PDF → Flipbook (no TypeScript)
//  * ---------------------------------------------------
//  * ✔ Put your PDF in /public (e.g., /public/sample.pdf)
//  * ✔ Copy pdf.worker.min.js into /public as well (see notes below)
//  * ✔ Visit /flipbook to see it
//  *
//  * Notes (PDF.js worker):
//  *   1) Install pdfjs-dist:  npm i pdfjs-dist
//  *   2) Copy node_modules/pdfjs-dist/build/pdf.worker.min.js → public/pdf.worker.min.js
//  *   3) If you prefer CDN, change WORKER_SRC to a CDN URL.
//  *
//  * This page renders PDF pages to images (client-side) with PDF.js,
//  * then shows them in a lightweight flipbook spread (2 pages) with
//  * keyboard + click + drag interactions.
//  */

// // ======= CONFIG =======
// const PDF_PATH = "/io.pdf"; // change to your PDF path in /public
// // const WORKER_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
// // const WORKER_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


// // const WORKER_SRC = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

// // const WORKER_SRC = "/pdf.worker.min.js"; // or a CDN URL if you prefer
// const INITIAL_SCALE = 1.4; // render quality (1.0–2.0 is typical)

// // Load PDF.js only on the client, and using the legacy build for browser compat
// let pdfjsLib = null;
// async function loadPdfJs() {
//   if (pdfjsLib) return pdfjsLib;
//   const mod = await import("pdfjs-dist/legacy/build/pdf");
//   pdfjsLib = mod;
//   if (pdfjsLib.GlobalWorkerOptions) {
//     pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SRC;
//   }
//   return pdfjsLib;
// }

// // if (pdfjsLib.GlobalWorkerOptions) {
// //   pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SRC;
// //   console.log("PDF.js worker set to:", pdfjsLib.GlobalWorkerOptions.workerSrc);
// // }



// function cx() {
//   return Array.from(arguments)
//     .flat()
//     .filter(Boolean)
//     .join(" ");
// }

// function PageImage({ src, onDragFlip, isLeft }) {
//   const ref = useRef(null);
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     let startX = 0;
//     let dragging = false;

//     const down = (e) => {
//       dragging = true;
//       startX = (e.touches ? e.touches[0].clientX : e.clientX) || 0;
//     };
//     const move = (e) => {
//       if (!dragging) return;
//       const x = (e.touches ? e.touches[0].clientX : e.clientX) || 0;
//       const dx = x - startX;
//       el.style.transform = `translateX(${dx * 0.08}px)`;
//       el.style.transition = "transform 0s";
//     };
//     const up = (e) => {
//       if (!dragging) return;
//       dragging = false;
//       const x = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) || 0;
//       const dx = x - startX;
//       el.style.transform = "";
//       el.style.transition = "";
//       const threshold = 80;
//       if (dx > threshold) onDragFlip(-1);
//       if (dx < -threshold) onDragFlip(1);
//     };

//     el.addEventListener("mousedown", down);
//     el.addEventListener("touchstart", down, { passive: true });
//     window.addEventListener("mousemove", move, { passive: true });
//     window.addEventListener("touchmove", move, { passive: true });
//     window.addEventListener("mouseup", up, { passive: true });
//     window.addEventListener("touchend", up, { passive: true });

//     return () => {
//       el.removeEventListener("mousedown", down);
//       el.removeEventListener("touchstart", down);
//       window.removeEventListener("mousemove", move);
//       window.removeEventListener("touchmove", move);
//       window.removeEventListener("mouseup", up);
//       window.removeEventListener("touchend", up);
//     };
//   }, [onDragFlip]);

//   return (
//     <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow">
//       <img
//         ref={ref}
//         src={src}
//         alt="page"
//         className={cx(
//           "h-full w-full object-contain select-none",
//           loaded ? "opacity-100" : "opacity-0"
//         )}
//         onLoad={() => setLoaded(true)}
//         draggable={false}
//       />
//       {!loaded && <div className="absolute inset-0 animate-pulse bg-neutral-200" />}
//       <div
//         className={cx(
//           "pointer-events-none absolute inset-y-0 w-20",
//           isLeft
//             ? "right-0 bg-gradient-to-l from-black/10 to-transparent"
//             : "left-0 bg-gradient-to-r from-black/10 to-transparent"
//         )}
//       />
//     </div>
//   );
// }

// export default function Page() {
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [index, setIndex] = useState(0); // left page index in two-page mode
//   const [zoom, setZoom] = useState(1);
//   const twoPage = true;

//   const maxIndex = useMemo(() => {
//     if (!twoPage) return Math.max(0, images.length - 1);
//     return Math.max(0, images.length - (images.length % 2 === 0 ? 2 : 1));
//   }, [images.length]);

//   const canPrev = index > 0;
//   const canNext = index < maxIndex;

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const pdfjs = await loadPdfJs();
//         const task = pdfjs.getDocument(PDF_PATH);
//         const pdf = await task.promise;

//         const imgs = [];
//         for (let p = 1; p <= pdf.numPages; p++) {
//           const page = await pdf.getPage(p);
//           const viewport = page.getViewport({ scale: INITIAL_SCALE });
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;
//           await page.render({ canvasContext: ctx, viewport }).promise;
//           const url = canvas.toDataURL("image/jpeg", 0.92);
//           imgs.push(url);
//         }
//         if (!cancelled) {
//           setImages(imgs);
//           setIndex(0);
//         }
//       } catch (e) {
//         console.error(e);
//         setError("Failed to load PDF. Make sure the file exists in /public and the worker is set.");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "ArrowRight") next();
//       if (e.key === "ArrowLeft") prev();
//       if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(2.5, z + 0.1));
//       if (e.key === "-" || e.key === "_") setZoom((z) => Math.max(0.5, z - 0.1));
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [index, maxIndex]);

//   function prev() {
//     setIndex((i) => Math.max(0, twoPage ? i - 2 : i - 1));
//   }
//   function next() {
//     setIndex((i) => Math.min(maxIndex, twoPage ? i + 2 : i + 1));
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50 py-8 px-4 flex flex-col items-center gap-6">
//       <div className="w-full max-w-6xl">
//         <h1 className="text-2xl md:text-3xl font-semibold">PDF Flipbook</h1>
//         <p className="text-sm text-neutral-600 mt-1">
//           Serving from <code className="bg-neutral-100 px-1 rounded">/public{PDF_PATH}</code>. Use ←/→ to flip, +/- to zoom. Drag a page too.
//         </p>
//       </div>

//       {/* Controls */}
//       <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3">
//         <div className="flex items-center gap-2">
//           <button
//             onClick={prev}
//             disabled={!canPrev}
//             className={cx(
//               "px-3 py-2 rounded border",
//               canPrev ? "bg-white hover:shadow" : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
//             )}
//           >
//             Prev
//           </button>
//           <button
//             onClick={next}
//             disabled={!canNext}
//             className={cx(
//               "px-3 py-2 rounded border",
//               canNext ? "bg-white hover:shadow" : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
//             )}
//           >
//             Next
//           </button>
//           <div className="pl-2 text-sm text-neutral-600">
//             {twoPage ? (
//               <span>
//                 Pages {Math.min(index + 1, images.length)}–{Math.min(index + 2, images.length)} / {images.length}
//               </span>
//             ) : (
//               <span>
//                 Page {Math.min(index + 1, images.length)} / {images.length}
//               </span>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))} className="px-3 py-2 rounded border bg-white hover:shadow">
//             –
//           </button>
//           <div className="w-14 text-center text-sm">{(zoom * 100).toFixed(0)}%</div>
//           <button onClick={() => setZoom((z) => Math.min(2.5, z + 0.1))} className="px-3 py-2 rounded border bg-white hover:shadow">
//             +
//           </button>
//         </div>
//       </div>

//       {/* Stage */}
//       <div className="relative w-full max-w-6xl aspect-[16/10] rounded-3xl p-3 md:p-6 bg-neutral-100 shadow-inner">
//         {loading && (
//           <div className="h-full w-full grid place-items-center text-neutral-500">Rendering pages…</div>
//         )}
//         {error && !loading && (
//           <div className="h-full w-full grid place-items-center text-red-600 text-sm text-center px-6">{error}</div>
//         )}
//         {!loading && !error && (
//           <div
//             className={cx(
//               "relative h-full w-full mx-auto grid",
//               twoPage ? "grid-cols-2 gap-3" : "grid-cols-1"
//             )}
//             style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
//           >
//             {/* Left */}
//             {twoPage && (
//               <div className="h-full w-full">
//                 {images[index] ? (
//                   <PageImage src={images[index]} isLeft onDragFlip={(d) => (d < 0 ? prev() : next())} />
//                 ) : (
//                   <div className="h-full w-full rounded-2xl bg-white grid place-items-center text-neutral-400 border">
//                     —
//                   </div>
//                 )}
//               </div>
//             )}
//             {/* Right or Single */}
//             <div className="h-full w-full">
//               {images[twoPage ? index + 1 : index] ? (
//                 <PageImage src={images[twoPage ? index + 1 : index]} onDragFlip={(d) => (d < 0 ? prev() : next())} />
//               ) : (
//                 <div className="h-full w-full rounded-2xl bg-white grid place-items-center text-neutral-400 border">
//                   End
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Thumbs */}
//       {images.length > 0 && (
//         <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
//           {images.map((src, i) => (
//             <button
//               key={i}
//               onClick={() => setIndex(i - (i % 2))}
//               className={cx(
//                 "relative aspect-[3/4] overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow",
//                 (i === index || i === index + 1) && "ring-2 ring-blue-500"
//               )}
//             >
//               <img src={src} alt={`thumb-${i + 1}`} className="h-full w-full object-cover" />
//               <div className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white">
//                 {i + 1}
//               </div>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import HTMLFlipBook from "react-pageflip";

// // Tell pdfjs where the worker is
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// export default function FlipBook() {
//   const [numPages, setNumPages] = useState(null);

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <HTMLFlipBook
//         width={600}
//         height={800}
//         className="shadow-2xl rounded-2xl"
//         showCover={true}
//       >
//         <Document file="/io.pdf" onLoadSuccess={onDocumentLoadSuccess}>
//           {Array.from(new Array(numPages), (el, index) => (
//             <div key={`page_${index + 1}`} className="p-4 bg-white">
//               <Page pageNumber={index + 1} width={500} />
//             </div>
//           ))}
//         </Document>
//       </HTMLFlipBook>
//     </div>
//   );
// }


// working




// import React from 'react'
// import FlipbookPage from './body'
// import Nav from '../component/nav'
// import Footer from '../component/footer'

// export default function Page() {
//   return (
//     <div>
// <Nav/>
// <FlipbookPage/>
// <Footer/>
//     </div>
//   )
// }


// "use client";

// import React, { useState } from "react";
// import Nav from "../component/nav";
// import Footer from "../component/footer";
// import FlipbookPage from "./body";

// export default function Page() {
//   const [selectedPdf, setSelectedPdf] = useState(null);

//   // list of available PDFs (put inside /public folder)
//   const pdfs = [
//     { title: "Reforesting the Forgotten", file: "/pdf/Reforesting_the_Forgotten.pdf", thumbnail: "/images/cover/cover1.png" },
//     { title: "AI for Green Governance", file: "/pdf/Singapore_Waste_Awakening.pdf", thumbnail: "/images/cover/cover2.png" },
//     { title: "Singapore’s Waste Awakening", file: "/pdf/AI_for_Green_Governance_Thailand.pdf", thumbnail: "/images/cover/cover3.png" },
//     { title: "Japan Eco Policy Paper", file: "/pdf/Japan_Eco_Policy_Paper.pdf", thumbnail: "/images/cover/cover4.png" },
//     { title: "Singapore’s Waste Management Challenges", file: "/pdf/Singapore_Waste_Management_Solutions_With_Main_Heading.pdf", thumbnail: "/images/cover/cover5.png" },
//   ];

//   return (
//     <div>
//       <Nav />

//       {!selectedPdf ? (
//         // 📚 Show PDF Library
//         <section className="min-h-screen bg-gray-50 py-16">
//           <h2 className="text-3xl font-bold text-center mb-8">Our PDFs</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
//             {pdfs.map((pdf, idx) => (
//               <div
//                 key={idx}
//                 className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden hover:scale-[1.03] transition-transform"
//                 onClick={() => setSelectedPdf(pdf.file)}
//               >
//                 <img
//                   src={pdf.thumbnail}
//                   alt={pdf.title}
//                   className="w-full h-64 object-cover"
//                 />
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold text-black">{pdf.title}</h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       ) : (
//         // 📖 Show Flipbook when PDF selected
//         <FlipbookPage pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
//       )}

//       <Footer />
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
// import Nav from "../component/nav";
// import Footer from "../component/footer";
import Footer from "./footer";
import Nav from "./nav";
import FlipbookPage from "./body";

export default function Home1() {
  const [selectedPdf, setSelectedPdf] = useState(null);

  // list of available PDFs (put inside /public folder)
  const pdfs = [
    { title: "Reforesting the Forgotten", file: "/pdf/Reforesting_the_Forgotten.pdf", thumbnail: "/images/cover/cover1.png" },
    { title: "AI for Green Governance", file: "/pdf/Singapore_Waste_Awakening.pdf", thumbnail: "/images/cover/cover2.png" },
    { title: "Singapore’s Waste Awakening", file: "/pdf/AI_for_Green_Governance_Thailand.pdf", thumbnail: "/images/cover/cover3.png" },
    { title: "Japan Eco Policy Paper", file: "/pdf/Japan_Eco_Policy_Paper.pdf", thumbnail: "/images/cover/cover4.png" },
    { title: "Singapore’s Waste Management Challenges", file: "/pdf/Singapore_Waste_Management_Solutions_With_Main_Heading.pdf", thumbnail: "/images/cover/cover5.png" },
  ];

  return (
    <div>
      <Nav />

      {!selectedPdf ? (
        // 📚 Show PDF Library
        <section className="min-h-screen bg-gray-50 py-16">
          <div className="text-center max-w-3xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-green-900 mb-4">
              Green Governance Journal
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              A collection of responses from students across Japan, Singapore, and India, 
              sharing innovative ideas for sustainable development. 
              These papers explore how emerging technologies like AI and IoT can strengthen 
              green governance and propose actionable policies to advance global sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 mt-12">
            {pdfs.map((pdf, idx) => (
              <div
                key={idx}
                className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden hover:scale-[1.03] transition-transform"
                onClick={() => setSelectedPdf(pdf.file)}
              >
                <img
                  src={pdf.thumbnail}
                  alt={pdf.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-black">{pdf.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        // 📖 Show Flipbook when PDF selected
        <FlipbookPage pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}

      <Footer />
    </div>
  );
}

