
export interface Book {
    id: string;
    volumeInfo: {
      title: string;
      subtitle?: string;
      authors: string[];
      publishedDate?: string;
      industryIdentifiers: {
        type: string;
        identifier: string;
      }[];
      readingModes: {
        text: boolean;
        image: boolean;
      };
      pageCount: number;
      printType: string;
      categories: string[];
      maturityRating: string;
      allowAnonLogging: boolean;
      contentVersion: string;
      panelizationSummary: {
        containsEpubBubbles: boolean;
        containsImageBubbles: boolean;
      };
      imageLinks: {
        smallThumbnail: string;
        thumbnail: string;
      };
      language: string;
      previewLink: string;
      infoLink: string;
      canonicalVolumeLink: string;
    };
    saleInfo: {
      country: string;
      saleability: string;
      isEbook: boolean;
    };
    accessInfo: {
      country: string;
      viewability: string;
      embeddable: boolean;
      publicDomain: boolean;
      textToSpeechPermission: string;
      epub: {
        isAvailable: boolean;
      };
      pdf: {
        isAvailable: boolean;
      };
      webReaderLink: string;
      accessViewStatus: string;
      quoteSharingAllowed: boolean;
    };
    searchInfo: {
      textSnippet: string;
    };
  }
  