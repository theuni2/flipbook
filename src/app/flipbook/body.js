

// "use client";

// import React, { useEffect, useState, forwardRef } from "react";
// import dynamic from "next/dynamic";
// import Nav from "../component/nav";
// import Footer from "../component/footer";

// // Load react-pageflip only on client
// const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

// // Page component for flipbook
// const BookPage = forwardRef(({ children }, ref) => (
//   <div
//     ref={ref}
//     style={{
//       width: "100%",
//       height: "100%",
//       background: "#fff",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       fontFamily: "sans-serif",
//       fontSize: 20,
//       boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
//     }}
//   >
//     {children}
//   </div>
// ));
// BookPage.displayName = "BookPage";

// export default function FlipbookPage() {
//   const [pages, setPages] = useState([]);

//   useEffect(() => {
//     const loadPdf = async () => {
//       // Import pdfjs only inside browser
//       const pdfjsLib = await import("pdfjs-dist/build/pdf");
//       await import("pdfjs-dist/build/pdf.worker.min.mjs");

//       pdfjsLib.GlobalWorkerOptions.workerSrc =
//         window.URL.createObjectURL(
//           new Blob(
//             [
//               `importScripts("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js");`,
//             ],
//             { type: "application/javascript" }
//           )
//         );

//       const url = "/io.pdf"; // Make sure file is inside /public
//       const pdf = await pdfjsLib.getDocument(url).promise;

//       const pageImages = [];
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const viewport = page.getViewport({ scale: 2 });
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;

//         await page.render({ canvasContext: context, viewport }).promise;
//         const dataUrl = canvas.toDataURL("image/png");
//         pageImages.push(dataUrl);
//       }
//       setPages(pageImages);
//     };

//     loadPdf();
//   }, []);

//   return (
//     <>
//     {/* <Nav/> */}
//     <main
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "#f0f2f5",
//         padding: 20,
//       }}
//     >
//       {pages.length > 0 ? (
//         <HTMLFlipBook
//           width={420}
//           height={600}
//           size="stretch"
//           minWidth={300}
//           maxWidth={1000}
//           minHeight={400}
//           maxHeight={1536}
//           showCover
//           mobileScrollSupport
//           style={{
//             margin: "0 auto",
//             borderRadius: 12,
//           }}
//         >

//           <BookPage isCover>
//   <img
//     src="/images/cover.png"   // 👈 put your cover image in /public folder
//     alt="Cover"
//     style={{
//       width: "100%",
//       height: "100%",
//       objectFit: "cover",   // makes it fill the whole page
//       borderRadius: "12px",
//     }}
//   />
// </BookPage>


//           {pages.map((src, idx) => (
//             <BookPage key={idx}>
//               <img
//                 src={src}
//                 alt={`Page ${idx + 1}`}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "contain",
//                   borderRadius: 8,
//                 }}
//               />
//             </BookPage>
//           ))}

//           <BookPage>📘 Back Cover</BookPage>
//         </HTMLFlipBook>
//       ) : (
// <div className="flex flex-col items-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
//              <p style={{ fontSize: 18, color: "#444" }}>Loading your flipbook...</p>
//            </div>
//       )}
//     </main>
//     {/* <Footer/> */}
//     </>
//   );
// }


// import React, { useState } from "react";
// import Nav from "../component/nav";
// import Footer from "../component/footer";
// import FlipbookPage from "./body";

// export default function Page() {
//   const [selectedPdf, setSelectedPdf] = useState(null);

//   // list of available PDFs (put inside /public folder)
//   const pdfs = [
//     { title: "Finance Report", file: "/io.pdf", thumbnail: "/images/pdf1.png" },
//     { title: "Case Study", file: "/io2.pdf", thumbnail: "/images/pdf2.png" },
//     { title: "Magazine", file: "/io3.pdf", thumbnail: "/images/pdf3.png" },
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
//                   <h3 className="text-lg font-semibold">{pdf.title}</h3>
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

import React, { useEffect, useState, forwardRef } from "react";
import dynamic from "next/dynamic";

// Load react-pageflip only on client
const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

const BookPage = forwardRef(({ children }, ref) => (
  <div
    ref={ref}
    style={{
      width: "100%",
      height: "100%",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      fontSize: 20,
      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    }}
  >
    {children}
  </div>
));
BookPage.displayName = "BookPage";

export default function FlipbookPage({ pdfUrl, onClose }) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const loadPdf = async () => {
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      await import("pdfjs-dist/build/pdf.worker.min.mjs");

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        window.URL.createObjectURL(
          new Blob(
            [
              `importScripts("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js");`,
            ],
            { type: "application/javascript" }
          )
        );

      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const pageImages = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        pageImages.push(canvas.toDataURL("image/png"));
      }
      setPages(pageImages);
    };

    if (pdfUrl) loadPdf();
  }, [pdfUrl]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
        padding: 20,
        position: "relative",
      }}
    >
      {/* ❌ Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
      >
        Close
      </button>

      {pages.length > 0 ? (
        <HTMLFlipBook
          width={420}
          height={600}
          size="stretch"
          minWidth={300}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1536}
          showCover
          mobileScrollSupport
          style={{
            margin: "0 auto",
            borderRadius: 12,
          }}
        >
          {pages.map((src, idx) => (
            <BookPage key={idx}>
              <img
                src={src}
                alt={`Page ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
            </BookPage>
          ))}

          <BookPage>📘 Back Cover</BookPage>
        </HTMLFlipBook>
      ) : (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
          <p style={{ fontSize: 18, color: "#444" }}>Loading your flipbook...</p>
        </div>
      )}
    </main>
  );
}
