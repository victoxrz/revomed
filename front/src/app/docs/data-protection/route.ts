import fs from "fs";
import path from "path";
// import { promisify } from "util";
// import Docxtemplater from "docxtemplater";
// import PizZip from "pizzip";
// import libre from "libreoffice-convert";
// import { NextResponse } from "next/server";
import mustache from "mustache";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
  const data = Object.fromEntries((await req.formData()).entries());

  const tplSrc = fs.readFileSync(
    path.resolve(process.cwd(), "../docs/DataProtection.html"),
    "binary"
  );

  const renderedHtml = mustache.render(tplSrc, data);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "data:text/html;charset=utf-8," + encodeURIComponent(renderedHtml),
    { waitUntil: "networkidle0" }
  );

  const docTitle = "Data Protection Policy";
  await page.evaluate((t) => {
    document.title = t;
  }, docTitle);

  const pdfBuf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return new Response(pdfBuf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${docTitle}.pdf"`,
    },
  });
}

// export async function POST(req: Request) {
//   const content = fs.readFileSync(
//     path.resolve(process.cwd() + "/../docs", "DataProtection.docx"),
//     "binary"
//   );
//   const data = Object.fromEntries((await req.formData()).entries());

//   const doc = new Docxtemplater(new PizZip(content), {
//     paragraphLoop: true,
//     linebreaks: true,
//   });
//   const convertAsync = promisify(libre.convertWithOptions);

//   try {
//     doc.render(data);
//   } catch (error) {
//     console.error("Error rendering template:", error);
//     throw error;
//   }

//   const buf = doc.toBuffer();
//   const ext = ".pdf";

//   console.log(process.env.SOFFICE_BINARY);

//   const pdfBuf = await convertAsync(buf, ext, undefined, {
//     sofficeBinaryPaths: [process.env.SOFFICE_BINARY!],
//   });

//   return new NextResponse(pdfBuf, {
//     status: 200,
//     headers: {
//       "Content-Type": "application/pdf",
//     },
//   });
// }
