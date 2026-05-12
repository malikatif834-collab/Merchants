import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = join(process.cwd(), "public", "sample-pdfs");
mkdirSync(OUT_DIR, { recursive: true });

async function generatePdf(filename, title, blocks) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const left = 56;
  const right = 612 - 56;
  const width = right - left;
  let y = 760;

  page.drawRectangle({
    x: 0, y: 740, width: 612, height: 36,
    color: rgb(0.949, 0.396, 0.133),
  });
  page.drawText("MERCHANTS PAPER COMPANY LIMITED — the friendly supply house. since 1941.", {
    x: left, y: 752, size: 9, font: bold, color: rgb(0.12, 0.12, 0.12),
  });
  y = 720;
  page.drawText(title, { x: left, y, size: 18, font: bold, color: rgb(0.12, 0.12, 0.12) });
  y -= 28;

  const wrap = (text, fnt, size, maxW) => {
    const words = text.split(/\s+/);
    const lines = [];
    let cur = "";
    for (const w of words) {
      const t = cur ? `${cur} ${w}` : w;
      if (fnt.widthOfTextAtSize(t, size) > maxW && cur) { lines.push(cur); cur = w; }
      else cur = t;
    }
    if (cur) lines.push(cur);
    return lines;
  };

  for (const b of blocks) {
    if (y < 80) break;
    if (b.kind === "spacer") { y -= 10; continue; }
    if (b.kind === "heading") {
      page.drawText(b.text, { x: left, y, size: 12, font: bold, color: rgb(0.12, 0.12, 0.12) });
      y -= 18; continue;
    }
    if (b.kind === "subheading") {
      page.drawText(b.text, { x: left, y, size: 10, font: bold, color: rgb(0.949, 0.396, 0.133) });
      y -= 14; continue;
    }
    if (b.kind === "paragraph") {
      const wrapped = wrap(b.text, font, 10, width);
      for (const line of wrapped) {
        page.drawText(line, { x: left, y, size: 10, font, color: rgb(0.18, 0.18, 0.18) });
        y -= 14;
      }
      y -= 4; continue;
    }
    if (b.kind === "bullet") {
      const wrapped = wrap("•   " + b.text, font, 10, width);
      for (const line of wrapped) {
        page.drawText(line, { x: left, y, size: 10, font, color: rgb(0.18, 0.18, 0.18) });
        y -= 13;
      }
      y -= 2; continue;
    }
    if (b.kind === "table") {
      if (b.rows) {
        for (const [k, v] of b.rows) {
          page.drawText(k, { x: left, y, size: 9.5, font: bold, color: rgb(0.35, 0.35, 0.35) });
          page.drawText(v, { x: left + 170, y, size: 9.5, font, color: rgb(0.12, 0.12, 0.12) });
          y -= 14;
        }
        y -= 4; continue;
      }
      if (b.cols && b.data) {
        const colWidth = width / b.cols.length;
        page.drawRectangle({ x: left - 2, y: y - 4, width: width + 4, height: 16, color: rgb(0.92, 0.92, 0.92) });
        b.cols.forEach((c, i) => {
          page.drawText(c, { x: left + i * colWidth + 4, y: y + 1, size: 9, font: bold, color: rgb(0.12, 0.12, 0.12) });
        });
        y -= 18;
        for (const row of b.data) {
          row.forEach((cell, i) => {
            page.drawText(cell, { x: left + i * colWidth + 4, y: y + 1, size: 9, font, color: rgb(0.18, 0.18, 0.18) });
          });
          y -= 14;
        }
        y -= 4; continue;
      }
    }
  }

  page.drawText("975 Crawford Ave, Windsor ON N9A 6N4 · merchants.ca · sales@merchants.ca", {
    x: left, y: 32, size: 8, font, color: rgb(0.5, 0.5, 0.5),
  });

  const bytes = await doc.save();
  writeFileSync(join(OUT_DIR, filename), bytes);
  console.log("wrote", filename);
}

await generatePdf("customer-rfq-caesars-windsor.pdf", "REQUEST FOR QUOTE", [
  { kind: "subheading", text: "From the Customer" },
  { kind: "table", rows: [
    ["Buyer:", "Caesars Windsor — Food & Beverage Operations"],
    ["Contact:", "Mireille Lacasse, F&B Operations Manager"],
    ["Email:", "m.lacasse@caesars-windsor.example"],
    ["Issued:", "May 11, 2026"],
    ["RFQ #:", "CW-RFQ-2026-0118"],
    ["Required by:", "Friday, May 15, 2026"],
  ]},
  { kind: "spacer" },
  { kind: "subheading", text: "Items Requested" },
  { kind: "table", cols: ["Line", "Description", "Qty", "UOM"], data: [
    ["1", "Nitrile gloves, powder-free, blue, large", "200", "case"],
  ]},
  { kind: "spacer" },
  { kind: "heading", text: "Specifications" },
  { kind: "bullet", text: "Material: 100% nitrile, powder-free, latex-free" },
  { kind: "bullet", text: "Color: blue (food handling visibility)" },
  { kind: "bullet", text: "Size: Large (200 cases — full size run)" },
  { kind: "bullet", text: "Packaging: 100 gloves/box, 10 boxes/case" },
  { kind: "bullet", text: "Certifications: FDA food contact + ASTM D6319" },
  { kind: "spacer" },
  { kind: "heading", text: "Notes from Mireille" },
  { kind: "paragraph", text: "Sarah — going through gloves faster than expected on the casino floor and back-of-house. Need 200 cases by Friday. Last time we ordered from you it was a special order so flagging early. Please confirm in-stock availability and quote within 24 hours. Thanks, Mireille." },
  { kind: "spacer" },
  { kind: "subheading", text: "Delivery & Terms" },
  { kind: "table", rows: [
    ["Delivery address:", "377 Riverside Dr E, Windsor ON N9A 7H7 (Receiving Dock B)"],
    ["Delivery window:", "Tue-Fri 7 AM – 3 PM"],
    ["Payment terms:", "Net-30 (per existing account)"],
    ["Quote valid:", "30 days from issue"],
  ]},
]);

await generatePdf("customer-po-windsor-assembly.pdf", "PURCHASE ORDER", [
  { kind: "subheading", text: "Order Header" },
  { kind: "table", rows: [
    ["Buyer:", "Windsor Assembly Plant — Facilities Maintenance"],
    ["Contact:", "Marc Tessier, Senior Facilities Manager"],
    ["Email:", "marc.tessier@windsorassembly.example"],
    ["PO #:", "WA-PO-2026-04412"],
    ["Issued:", "May 11, 2026"],
    ["Required by:", "June 8, 2026"],
    ["Ship to:", "2199 Chrysler Centre, Windsor ON N9A 4H6"],
    ["Account #:", "MPC-WA-0042"],
  ]},
  { kind: "spacer" },
  { kind: "subheading", text: "Order Lines" },
  { kind: "table", cols: ["Line", "Description", "Qty", "Unit Price"], data: [
    ["1", "Industrial degreaser concentrate, 55-gal drum, low-VOC", "4", "$385.00"],
    ["2", "Floor scrubber pads, 17 inch, heavy-duty", "60", "$8.50"],
    ["3", "Spill containment berm, 10' x 10'", "2", "$425.00"],
    ["4", "Lint-free wipes, industrial, 500ct case", "30", "$32.00"],
  ]},
  { kind: "spacer" },
  { kind: "subheading", text: "Special Instructions" },
  { kind: "paragraph", text: "Custom-blend degreaser per spec sheet WA-MS-217 (low-VOC formulation for paint-line application). Please confirm formulation match with supplier before order placed. Lead time tolerance: up to 2 weeks acceptable for accurate spec match." },
  { kind: "spacer" },
  { kind: "table", rows: [
    ["Subtotal:", "$3,610.00"],
    ["Estimated freight:", "$185.00"],
    ["Tax (HST 13%):", "$493.35"],
    ["TOTAL ESTIMATE:", "$4,288.35"],
  ]},
  { kind: "spacer" },
  { kind: "subheading", text: "Payment Terms" },
  { kind: "bullet", text: "Net-30 from invoice date (per master service agreement)" },
  { kind: "bullet", text: "Invoice email: ap.windsorassembly@example" },
  { kind: "bullet", text: "PO number must appear on all invoices and packing slips" },
]);

await generatePdf("supplier-quote-cascades.pdf", "SUPPLIER QUOTE", [
  { kind: "subheading", text: "From: Cascades Tissue Group" },
  { kind: "table", rows: [
    ["Supplier:", "Cascades Tissue Group"],
    ["Sales contact:", "Renée Belisle, Account Manager"],
    ["Email:", "rbelisle@cascades.example"],
    ["Quote #:", "CTG-Q-2026-1184"],
    ["In response to:", "Merchants Paper RFQ MPC-RFQ-24120"],
    ["Customer (end-user):", "Riverbend Suites & Conference"],
    ["Issued:", "May 10, 2026"],
    ["Quote valid until:", "June 10, 2026"],
  ]},
  { kind: "spacer" },
  { kind: "subheading", text: "Quoted Items" },
  { kind: "table", cols: ["Line", "SKU / Description", "Qty", "$/case"], data: [
    ["1", "CleanBeyondGreen hardwound roll towel, natural, 800ft, 6/case, custom-embossed", "240", "$26.10"],
  ]},
  { kind: "spacer" },
  { kind: "table", rows: [
    ["Subtotal:", "$6,264.00"],
    ["Embossing plate:", "$0.00 (amortized — existing plate on file)"],
    ["Freight:", "Included in unit price"],
    ["TOTAL:", "$6,264.00 CAD"],
  ]},
  { kind: "spacer" },
  { kind: "subheading", text: "Lead Time & Logistics" },
  { kind: "bullet", text: "Production lead time: 11 business days from order confirmation" },
  { kind: "bullet", text: "Shipping: FOB Cascades-Kingsey Falls mill, freight prepaid to Windsor" },
  { kind: "bullet", text: "Pallet count: 4 (240 cases / 60 cases per pallet)" },
  { kind: "spacer" },
  { kind: "subheading", text: "Recurring Order Terms" },
  { kind: "paragraph", text: "For confirmed quarterly recurring orders of 240+ cases, Cascades will lock the $26.10/case rate for 12 months. Embossing plate remains on file at no additional charge. Lead time may reduce to 8 business days after first three production cycles." },
  { kind: "spacer" },
  { kind: "subheading", text: "Payment Terms" },
  { kind: "bullet", text: "Net-30 from delivery, per standard Cascades / Merchants Paper terms" },
]);

await generatePdf("supplier-quote-diversey.pdf", "SUPPLIER QUOTE — LEAD-TIME UPDATE", [
  { kind: "subheading", text: "From: Diversey Canada" },
  { kind: "table", rows: [
    ["Supplier:", "Diversey Canada Inc."],
    ["Sales contact:", "Derek Holloway, Healthcare Accounts"],
    ["Email:", "derek.holloway@diversey.example"],
    ["Quote #:", "DVS-2026-Q2-08819"],
    ["In response to:", "Merchants Paper RFQ MPC-RFQ-24105"],
    ["Customer (end-user):", "Erie Shores Healthcare"],
    ["Issued:", "May 11, 2026"],
    ["Quote valid until:", "May 25, 2026"],
  ]},
  { kind: "spacer" },
  { kind: "subheading", text: "Quoted Item" },
  { kind: "table", cols: ["Line", "Product", "Qty", "$/case"], data: [
    ["1", "Diversey Oxivir Plus disinfectant cleaner, ready-to-use, 12/case", "120", "$112.00"],
  ]},
  { kind: "spacer" },
  { kind: "table", rows: [
    ["Subtotal:", "$13,440.00"],
    ["Healthcare-segment discount (5%):", "-$672.00"],
    ["Freight:", "Included"],
    ["TOTAL:", "$12,768.00 CAD"],
  ]},
  { kind: "spacer" },
  { kind: "subheading", text: "LEAD TIME UPDATE — Important" },
  { kind: "paragraph", text: "Current Oxivir Plus production lead time has extended from 5 business days to 21 business days due to global container shortage and supplier reformulation upgrade. We expect normal 5-day lead times to resume by Q3 2026. If urgent, please consider Oxivir Tb (alternative SKU below) which remains at 3-day stock availability." },
  { kind: "spacer" },
  { kind: "subheading", text: "Alternative — Oxivir Tb (faster availability)" },
  { kind: "table", cols: ["SKU", "Pack", "Lead", "$/case"], data: [
    ["100850909", "Oxivir Tb, 4x946ml/case", "3 days", "$98.50"],
  ]},
  { kind: "spacer" },
  { kind: "subheading", text: "Recommendation from Diversey" },
  { kind: "paragraph", text: "For Erie Shores Healthcare's 6-month requirement, we recommend splitting the order: 40 cases Oxivir Tb (immediate delivery to bridge supply) + 80 cases Oxivir Plus (delivery in 3 weeks). Holloway can coordinate." },
]);

console.log("Done.");
