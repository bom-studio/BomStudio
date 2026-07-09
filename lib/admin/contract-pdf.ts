import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadContractPdf(element: HTMLElement, contractNumber: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  const image = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const width = 210;
  const height = (canvas.height * width) / canvas.width;
  pdf.addImage(image, "PNG", 0, 0, width, height);
  const safeNumber = contractNumber.replace(/[\\/:*?"<>|]/g, "");
  pdf.save(`계약서_${safeNumber}.pdf`);
}
