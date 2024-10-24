var pdfDoc = null,
    canvasContainer = document.getElementById('pdf-viewer');

document.getElementById('file-input').addEventListener('change', function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();

    // Clear previous PDF content before loading a new one
    canvasContainer.innerHTML = ''; // Clears the canvasContainer before rendering the new PDF

    reader.onload = function() {
        var typedarray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            pdfDoc = pdf;
            renderAllPages();
        });
    };
    reader.readAsArrayBuffer(file);
});

// Render all pages at once
function renderAllPages() {
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        renderPage(i);
    }
}

// Render individual page
function renderPage(pageNumber) {
    pdfDoc.getPage(pageNumber).then(function(page) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvasContainer.appendChild(canvas);

        var viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        page.render(renderContext);
    });
}