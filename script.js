document.getElementById('merge-button').addEventListener('click', async () => {
    const fileInput = document.getElementById('file-input');
    const outputNameInput = document.getElementById('output-name');
    const files = fileInput.files;
    const outputName = outputNameInput.value.trim();

    if (files.length < 2) {
        alert("Please select at least two PDF files to merge.");
        return;
    }

    if (!outputName) {
        alert("Please enter a name for the output PDF.");
        return;
    }

    const pdfDocs = [];

    // Load the selected PDF files
    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        pdfDocs.push(pdfDoc);
    }

    // Create a new PDF document
    const mergedPdf = await PDFLib.PDFDocument.create();

    // Copy pages from each PDF document
    for (const pdfDoc of pdfDocs) {
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Save the merged PDF
    const mergedPdfFile = await mergedPdf.save();
    const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Create a link to download the merged PDF
    const downloadLink = document.getElementById('download-link');
    downloadLink.href = url;
    downloadLink.download = `${outputName}.pdf`; // Use the output name from user input
    downloadLink.style.display = 'block';
    downloadLink.innerText = 'Download Merged PDF';
});
// Reference elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileSelectBtn = document.getElementById('file-select-btn');

// Files array to store selected PDFs
let selectedFiles = [];

// File selection through "Choose File" button
fileSelectBtn.addEventListener('click', () => {
  fileInput.click();
});

// Handle files selected by traditional file input
fileInput.addEventListener('change', (event) => {
  selectedFiles = Array.from(event.target.files);
  updateDropZoneText(selectedFiles);
});

// Handle drag-and-drop file selection
dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();  // Prevent default behavior
  dropZone.classList.add('bg-light');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('bg-light');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('bg-light');
  
  selectedFiles = Array.from(event.dataTransfer.files).filter(file => file.type === 'application/pdf');
  updateDropZoneText(selectedFiles);
});

// Update the drop zone text based on the files selected
function updateDropZoneText(files) {
  if (files.length > 0) {
    dropZone.innerHTML = `<p class="lead">${files.length} file(s) selected</p>`;
  } else {
    dropZone.innerHTML = '<p class="lead">Drag and drop PDF files here or click to select</p>';
    dropZone.appendChild(fileSelectBtn);  // Re-add the file select button
  }
}

// You can add logic for the 'Merge' button and handle the file merging functionality here
