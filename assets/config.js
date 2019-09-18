/**
 * ReaderControl config file
 * ------------------------------
 * This js file is meant to simplify configuring commonly used settings for ReaderControl.
 * You can override default settings through ReaderControl.config properties, or add JavaScript code directly here.
 */
(function () {
  //= ========================================================
  // Add the VLM button to the toolbar
  //= ========================================================
  Tools.SelectAreaToolName = 'SelectAreaTool';
  class SelectAreaTool extends Tools.AnnotationEditTool {
    constructor(docViewer) {
      super(docViewer);
      this.cursor = 'copy';
    }

    mouseLeftUp(e) {
      super.mouseLeftUp(e);

      var pageIndex = this.pageCoordinates[0].pageIndex;

      // get pdf coordinate from viewer coordinate;
      let doc = readerControl.docViewer.getDocument();
      let pdfcoords1 = doc.getPDFCoordinates(pageIndex, this.pageCoordinates[0].x, this.pageCoordinates[0].y);
      let pdfcoords2 = doc.getPDFCoordinates(pageIndex, this.pageCoordinates[1].x, this.pageCoordinates[1].y);

      this.docViewer.trigger('areaSelected',
        {
          selectedPageIndex: pageIndex,
          selectedArea: { left: pdfcoords1.x, top: pdfcoords1.y, right: pdfcoords2.x, bottom: pdfcoords2.y }
        });

      readerControl.setToolMode('AnnotationEdit'); // back to default mode
    }
    switchIn(oldTool) { // activate
      Tools.Tool.ENABLE_TEXT_SELECTION = false;
    }
    switchOut(newTool) { // deactivate
      Tools.Tool.ENABLE_TEXT_SELECTION = true;
    }
  }

  //= ========================================================
  // Initialize the PDFNet
  //= ========================================================
  $(document).on('documentLoaded', function onDocumentLoaded() {
    // register a custom tool for selecting area
    var selectAreaTool = new SelectAreaTool(readerControl.docViewer);
    readerControl.registerTool({
      toolName: Tools.SelectAreaToolName,
      toolObject: selectAreaTool
    });
  });
})();
