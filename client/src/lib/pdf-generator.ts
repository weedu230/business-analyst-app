import jsPDF from "jspdf";
import type { Project } from "@shared/schema";

export async function generatePDF(project: Project) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let currentY = margin;

  // Helper function to add text with wrapping
  const addText = (text: string, x: number, y: number, maxWidth?: number, fontSize = 10) => {
    doc.setFontSize(fontSize);
    if (maxWidth) {
      const splitText = doc.splitTextToSize(text, maxWidth);
      doc.text(splitText, x, y);
      return y + (splitText.length * fontSize * 0.5);
    } else {
      doc.text(text, x, y);
      return y + fontSize * 0.5;
    }
  };

  // Cover Page
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  currentY = addText("Requirements Document", margin, currentY + 30, undefined, 24);
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  currentY = addText(project.name, margin, currentY + 20, undefined, 18);
  
  doc.setFontSize(12);
  currentY = addText(`Domain: ${project.domain}`, margin, currentY + 15, undefined, 12);
  currentY = addText(`Generated: ${new Date().toLocaleDateString()}`, margin, currentY + 10, undefined, 12);

  // Project Description
  doc.addPage();
  currentY = margin;
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  currentY = addText("Project Overview", margin, currentY, undefined, 16);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  currentY = addText(project.description, margin, currentY + 15, pageWidth - 2 * margin, 10) + 10;

  // Stakeholders
  currentY += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  currentY = addText("Stakeholders", margin, currentY, undefined, 14);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  project.stakeholders.forEach((stakeholder, index) => {
    currentY = addText(`${index + 1}. ${stakeholder.name} - ${stakeholder.role}`, margin, currentY + 10, undefined, 10);
  });

  // Functional Requirements
  if (currentY > 200) {
    doc.addPage();
    currentY = margin;
  }
  
  currentY += 20;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  currentY = addText("Functional Requirements", margin, currentY, undefined, 14);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  project.functionalRequirements.forEach((req, index) => {
    const stakeholder = project.stakeholders.find(s => s.id === req.stakeholderId);
    const reqText = `FR-${String(index + 1).padStart(3, '0')}: ${req.description}`;
    const stakeholderText = stakeholder ? ` (${stakeholder.name})` : "";
    
    if (currentY > 250) {
      doc.addPage();
      currentY = margin;
    }
    
    currentY = addText(reqText + stakeholderText, margin, currentY + 10, pageWidth - 2 * margin, 10) + 5;
  });

  // Non-Functional Requirements
  if (project.nonFunctionalRequirements.length > 0) {
    if (currentY > 200) {
      doc.addPage();
      currentY = margin;
    }
    
    currentY += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    currentY = addText("Non-Functional Requirements", margin, currentY, undefined, 14);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    project.nonFunctionalRequirements.forEach((req, index) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = margin;
      }
      
      doc.setFont("helvetica", "bold");
      currentY = addText(`${req.category.toUpperCase()}:`, margin, currentY + 15, undefined, 10);
      doc.setFont("helvetica", "normal");
      currentY = addText(req.description, margin, currentY + 5, pageWidth - 2 * margin, 10) + 5;
    });
  }

  // Summary Statistics
  doc.addPage();
  currentY = margin;
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  currentY = addText("Project Statistics", margin, currentY, undefined, 14);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  currentY = addText(`Total Stakeholders: ${project.stakeholders.length}`, margin, currentY + 15, undefined, 10);
  currentY = addText(`Functional Requirements: ${project.functionalRequirements.length}`, margin, currentY + 10, undefined, 10);
  currentY = addText(`Non-Functional Requirements: ${project.nonFunctionalRequirements.length}`, margin, currentY + 10, undefined, 10);

  // Download the PDF
  const filename = `${project.name.replace(/\s+/g, '-')}-Requirements.pdf`;
  doc.save(filename);
}
