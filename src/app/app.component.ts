import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import uuid from 'uuid';

declare var PDFTron: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app isolating pdftron issue';

  @ViewChild('webViewer') viewer: ElementRef;
  private myWebViewer: any;
  private pdfDoc: any;

  constructor() { }

  ngOnInit() {
    this.initializeDocument = this.initializeDocument.bind(this);
    this.readFileStream = this.readFileStream.bind(this);

    this.initializePDFWebViewer();
  }
  initializePDFWebViewer() {

    let licenseKey = atob('ZGVtbzprbmd1eWVuNzJAY3NjLmNvbTo3MjVkZjEzZDAxY2NkNzM4ZjRkMGMyNmNlNzk0YTZhMmJhM2JjZDU5N2Q2YmE3NGJjYw==');
    let pdfTronOptions = {
      type: 'html5',
      path: '/assets/lib',
      config: '/assets/config.js',
      css: '/assets/customStyle.css',
      preloadPDFWorker: false,
      enableAnnotations: true,
      fullAPI: true,
      l: licenseKey
    };

    this.myWebViewer = new PDFTron.WebViewer(pdfTronOptions, this.viewer.nativeElement);
    // listen ready event from pdftron lib
    this.viewer.nativeElement.addEventListener('ready', this.readFileStream);
    this.viewer.nativeElement.addEventListener('documentLoaded', this.initializeDocument);
  }

  /**
   * @property Content window of PDFTron WebViewer
   */
  public getWindow(): any {
    return this.viewer.nativeElement.querySelector('iframe').contentWindow;
  }

  /**
   * @property PdfNet instance of current component
   */
  public get getPdfNet(): any {
    let win = this.getWindow();
    return win !== null ? win.PDFNet : null;
  }


  /**
   * @property DocumentViewer instance
   */
  public get docViewer(): any {
    return this.webViewer.docViewer;
  }

  /**
   * @property WebViewer instance
   */
  public get webViewer(): any {
    return this.myWebViewer.getInstance();
  }

  /**
   * @property CoreControls instance of current WebViewer
   */
  public get coreControls(): any {
    return this.getWindow().CoreControls;
  }

  /**
   * Load document based on fileInfo
   */
  readFileStream() {
    this.coreControls.setWorkerPath('/assets/lib/core');
    this.coreControls.enableFullPDF(true);


    let loadOptions = {
      documentId: uuid(),
      filename: 'bookmark.pdf'
    };

    let uri = `https://localhost:44372/api/values/read`;

    this.webViewer.loadDocument(uri, loadOptions);
  }


  /**
   * Initialize Document and virtual content
   */
  private initializeDocument() {
    this.getPdfNet.initialize().then(() => {
      console.log('PDFNetJS has been initialized!');

      this.docViewer.getDocument().getPDFDoc().then(doc => {
        this.pdfDoc = doc;

        // TODO: The alternative solution waits 5 seconds for PDFNet lib initializing.
        // The problem is initialize method running asynchronously along with caller thread
        // Therefore, no way to determine whenever it already completed.
        // This issue need to be addressed by PDFTron team.
        // setTimeout(async () => {
          doc.initSecurityHandler();

          doc.hasSignatures().then(async signed => {
            console.log(signed);
          });
        // }, 5000);

      }).catch(err => {
        console.error('Get PdfDoc throws exception', err);
      });

    }).catch(err => {
      console.error('PDFNet initializes throwing exception', err);
    });
  }

}
