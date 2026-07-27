import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvoiceData {
  id: string;
  date: string;
  amount: string;
  method: string;
  methodDetails: string;
  status: string;
  description: string;
}

export interface CustomerInfo {
  name?: string;
  id?: string;
  phone?: string;
  email?: string;
}

export function generateInvoicePDF(inv: InvoiceData, customer: CustomerInfo = {}) {
  const doc = new jsPDF();

  // Primary Colors
  const tealColor: [number, number, number] = [13, 148, 136]; // #0d9488
  const darkTeal: [number, number, number] = [4, 47, 46];    // #042f2e
  const darkGray: [number, number, number] = [40, 40, 40];
  const midGray: [number, number, number] = [100, 100, 100];
  const lightBg: [number, number, number] = [240, 253, 250];  // #f0fdfa

  // 1. Top Brand Banner
  doc.setFillColor(...tealColor);
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('SENIOREASE', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.text('Digital Support & Tech Tutoring UK • Official Subscription Receipt', 15, 26);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('INVOICE', 195, 22, { align: 'right' });

  // Accent amber thin stripe under banner
  doc.setFillColor(245, 158, 11); // #f59e0b
  doc.rect(0, 36, 210, 1.5, 'F');

  // 2. Billing & Invoice Metadata Grid
  const leftX = 15;
  const rightX = 110;
  const rightAlignX = 195;
  const currentY = 50;

  // BILLED TO SECTION (Left Column)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...midGray);
  doc.text('BILLED TO CUSTOMER', leftX, currentY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkGray);
  doc.text(customer.name || 'Demo Customer', leftX, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  doc.text(`Customer ID: ${customer.id || 'DEMO'}`, leftX, currentY + 14);
  if (customer.phone) {
    doc.text(`Phone: ${customer.phone}`, leftX, currentY + 20);
  }
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('UK GDPR & Safeguarding Charter Active', leftX, customer.phone ? 77 : 71);

  // INVOICE DETAILS SECTION (Right Column)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...midGray);
  doc.text('INVOICE REFERENCE', rightX, currentY);
  doc.setFontSize(11);
  doc.setTextColor(...tealColor);
  doc.text(inv.id, rightAlignX, currentY, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(...midGray);
  doc.text('ISSUE DATE', rightX, currentY + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...darkGray);
  doc.text(inv.date, rightAlignX, currentY + 8, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...midGray);
  doc.text('PAYMENT STATUS', rightX, currentY + 16);
  doc.setFontSize(10);
  doc.setTextColor(22, 101, 52); // Dark Green
  doc.text(inv.status.toUpperCase(), rightAlignX, currentY + 16, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(...midGray);
  doc.text('PAYMENT METHOD', rightX, currentY + 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkGray);
  doc.text(inv.method, rightAlignX, currentY + 24, { align: 'right' });

  doc.setFontSize(8.5);
  doc.setTextColor(...midGray);
  doc.text(inv.methodDetails, rightAlignX, currentY + 30, { align: 'right' });

  // 3. Line Items Table
  const tableStartY = 90;
  
  autoTable(doc, {
    startY: tableStartY,
    head: [['Description & Services Covered', 'Billing Cycle', 'Rate', 'Total Paid']],
    body: [
      [
        `${inv.description}\n\n• Priority 1-on-1 UK Tech Tutoring Helpline Access\n• Personalized Digital Skill Coaching & Device Guidance\n• Active Scam Prevention Alerts & Security Monitoring\n• Caregiver Safeguarding & Family Connection Controls`,
        '1 Month\n(Recurring)',
        inv.amount,
        inv.amount
      ]
    ],
    headStyles: {
      fillColor: tealColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'left',
      cellPadding: 5
    },
    bodyStyles: {
      fontSize: 9.5,
      textColor: darkGray,
      cellPadding: 6
    },
    columnStyles: {
      0: { cellWidth: 95 },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 25, halign: 'right' },
      3: { cellWidth: 25, halign: 'right' }
    },
    margin: { left: leftX, right: 15 },
    theme: 'grid',
    styles: {
      lineColor: [226, 232, 240],
      lineWidth: 0.3
    }
  });

  // 4. Summary Box Below Table
  const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : tableStartY + 40;
  
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(110, finalY, 85, 30, 3, 3, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...midGray);
  doc.text('Standard Subscription Rate:', 116, finalY + 10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkGray);
  doc.text(inv.amount, 189, finalY + 10, { align: 'right' });

  doc.setDrawColor(226, 232, 240);
  doc.line(116, finalY + 15, 189, finalY + 15);

  doc.setFontSize(11);
  doc.setTextColor(...darkTeal);
  doc.text('TOTAL PAID:', 116, finalY + 23);
  doc.setFontSize(13);
  doc.setTextColor(...tealColor);
  doc.text(inv.amount, 189, finalY + 23, { align: 'right' });

  // 5. Direct Debit Guarantee & Trust Box
  const trustBoxY = Math.max(finalY + 42, 195);
  
  doc.setFillColor(...lightBg);
  doc.setDrawColor(204, 251, 241);
  doc.roundedRect(leftX, trustBoxY, 180, 52, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkTeal);
  doc.text('Thank you for choosing SeniorEase Digital Support!', leftX + 7, trustBoxY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  
  const guaranteeText = `Direct Debit Guarantee & Payment Protection:\nYour payment is strictly protected by UK Banking Standards and the Direct Debit Guarantee scheme. If there are any changes to the amount, date, or frequency of your payment, SeniorEase Digital Support Ltd will notify you in advance. If an error is made in payment by us or your bank, you are entitled to a full and immediate refund.\n\nSupport & Inquiries:\nFor billing assistance, tech tutoring appointments, or subscription updates, please email support@seniorease.co.uk or speak directly with your assigned senior care coordinator. All personal data is protected under UK GDPR.`;
  
  const splitText = doc.splitTextToSize(guaranteeText, 166);
  doc.text(splitText, leftX + 7, trustBoxY + 20);

  // 6. Footer Line
  doc.setDrawColor(226, 232, 240);
  doc.line(leftX, 275, 195, 275);
  
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text('SeniorEase Digital Support Ltd • Registered in England & Wales • Official Subscription Payment Receipt', 105, 282, { align: 'center' });
  doc.text('Page 1 of 1', 105, 287, { align: 'center' });

  // Save PDF
  doc.save(`${inv.id}_SeniorEase_Invoice.pdf`);
}
