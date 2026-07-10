import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadEstimatePdf(
  element: HTMLElement,
  estimateNumber: string,
  customerName: string
) {
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
  const safeNumber = estimateNumber.replace(/[\\/:*?"<>|]/g, "");
  const safeName = customerName.replace(/[\\/:*?"<>|]/g, "");
  pdf.save(`견적서_${safeNumber}_${safeName}.pdf`);
}
