declare module "pdf-parse" {
  interface PDFData {
    text: string;
    info: any;
    metadata: any;
    version: string;
  }

  function pdfParse(data: Buffer | Uint8Array): Promise<PDFData>;

  export default pdfParse;
}
