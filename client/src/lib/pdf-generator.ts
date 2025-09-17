import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Project } from "@shared/schema";

// Helper function to capture charts as images
async function captureChartsAsImages() {
  const chartImages = [];
  
  try {
    // Try to find chart containers in the DOM
    const pieChartContainer = document.querySelector('[data-testid="pie-chart-container"]');
    const barChartContainer = document.querySelector('[data-testid="bar-chart-container"]');
    
    if (pieChartContainer) {
      const pieCanvas = await html2canvas(pieChartContainer as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 400,
        height: 300
      });
      chartImages.push({
        type: 'pie',
        dataURL: pieCanvas.toDataURL('image/png'),
        width: 400,
        height: 300
      });
    }
    
    if (barChartContainer) {
      const barCanvas = await html2canvas(barChartContainer as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 400,
        height: 300
      });
      chartImages.push({
        type: 'bar',
        dataURL: barCanvas.toDataURL('image/png'),
        width: 400,
        height: 300
      });
    }
  } catch (error) {
    console.warn('Could not capture charts:', error);
  }
  
  return chartImages;
}

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

  // Try to include charts
  try {
    const charts = await captureChartsAsImages();
    if (charts.length > 0) {
      doc.addPage();
      currentY = margin;
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      currentY = addText("Requirements Analysis", margin, currentY, undefined, 14);
      
      // Add charts
      let chartY = currentY + 20;
      charts.forEach((chart, index) => {
        if (chartY > 150) {
          doc.addPage();
          chartY = margin;
        }
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        const chartTitle = chart.type === 'pie' ? 'Requirements Distribution' : 'Requirements by Stakeholder';
        chartY = addText(chartTitle, margin, chartY, undefined, 12);
        
        // Scale chart to fit page
        const maxWidth = pageWidth - 2 * margin;
        const maxHeight = 120;
        const aspectRatio = chart.width / chart.height;
        let chartWidth = maxWidth;
        let chartHeight = chartWidth / aspectRatio;
        
        if (chartHeight > maxHeight) {
          chartHeight = maxHeight;
          chartWidth = chartHeight * aspectRatio;
        }
        
        doc.addImage(chart.dataURL, 'PNG', margin, chartY + 10, chartWidth, chartHeight);
        chartY += chartHeight + 30;
      });
    }
  } catch (error) {
    console.warn('Could not add charts to PDF:', error);
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
