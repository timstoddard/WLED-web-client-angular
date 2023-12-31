import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { HtmlHighlightService } from './html-highlight.service';

fdescribe('HtmlHighlightService', () => {
  let htmlHighlightService: HtmlHighlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HtmlHighlightService,
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (s: string) => s,
          },
        },
      ],
    });
    htmlHighlightService = TestBed.inject(HtmlHighlightService);
  })

  it('should work for blank html text, blank filter text', () => {
    // arrange
    const htmlText = '';
    const filterText = '';
    const highlightClass = 'highlight';
    const htmlStringsToIgnore: string[] = [];
    const expectedResult = '';
    // act
    const actualResult = htmlHighlightService.highlightHtmlText(
      htmlText,
      filterText,
      highlightClass,
      htmlStringsToIgnore,
    );
    // assert
    expect(actualResult).toEqual(expectedResult);
  });

  it('should work for blank html text, has filter text', () => {
    // arrange
    const htmlText = '';
    const filterText = 'a';
    const highlightClass = 'highlight';
    const htmlStringsToIgnore: string[] = [];
    const expectedResult = '';
    // act
    const actualResult = htmlHighlightService.highlightHtmlText(
      htmlText,
      filterText,
      highlightClass,
      htmlStringsToIgnore,
    );
    // assert
    expect(actualResult).toEqual(expectedResult);
  });

  it('should work for has html text, blank filter text', () => {
    // arrange
    const htmlText = 'this is a bit of basic text';
    const filterText = '';
    const highlightClass = 'highlight';
    const htmlStringsToIgnore: string[] = [];
    const expectedResult = 'this is a bit of basic text';
    // act
    const actualResult = htmlHighlightService.highlightHtmlText(
      htmlText,
      filterText,
      highlightClass,
      htmlStringsToIgnore,
    );
    // assert
    expect(actualResult).toEqual(expectedResult);
  });

  it('should work for has html text, has filter text', () => {
    // arrange
    const htmlText = 'this is a bit of basic text';
    const filterText = 'a';
    const highlightClass = 'highlight';
    const htmlStringsToIgnore: string[] = [];
    const expectedResult = 'this is <span class="highlight">a</span> bit of b<span class="highlight">a</span>sic text';
    // act
    const actualResult = htmlHighlightService.highlightHtmlText(
      htmlText,
      filterText,
      highlightClass,
      htmlStringsToIgnore,
    );
    // assert
    expect(actualResult).toEqual(expectedResult);
  });

  it('should work for consecutive matched filter texts', () => {
    // arrange
    const htmlText = 'aaabbbccc';
    const filterText = 'b';
    const highlightClass = 'highlight';
    const htmlStringsToIgnore: string[] = [];
    const expectedResult = 'aaa<span class="highlight">b</span><span class="highlight">b</span><span class="highlight">b</span>ccc';
    // act
    const actualResult = htmlHighlightService.highlightHtmlText(
      htmlText,
      filterText,
      highlightClass,
      htmlStringsToIgnore,
    );
    // assert
    expect(actualResult).toEqual(expectedResult);
  });

  // highlight class
  it('should work for highlight class', () => {
    // arrange
    const htmlText = 'this is a bit of basic text';
    const filterText = 'a';
    const highlightClass = 'CUSTOM_HIGHLIGHT_CLASS';
    const htmlStringsToIgnore: string[] = [];
    const expectedResult = 'this is <span class="CUSTOM_HIGHLIGHT_CLASS">a</span> bit of b<span class="CUSTOM_HIGHLIGHT_CLASS">a</span>sic text';
    // act
    const actualResult = htmlHighlightService.highlightHtmlText(
      htmlText,
      filterText,
      highlightClass,
      htmlStringsToIgnore,
    );
    // assert
    expect(actualResult).toEqual(expectedResult);
  });

  it('should work for no html strings to ignore', () => {
    // arrange
    const htmlText = 'test fil&shy;ter text';
    const filterText = 'filter';
    const highlightClass = 'highlight';
    const htmlStringsToIgnore: string[] = [];
    const expectedResult = 'test fil&shy;ter text';
    // act
    const actualResult = htmlHighlightService.highlightHtmlText(
      htmlText,
      filterText,
      highlightClass,
      htmlStringsToIgnore,
    );
    // assert
    expect(actualResult).toEqual(expectedResult);
  });

  it('should work for has html strings to ignore', () => {
    // arrange
    const htmlText = 'test fil&shy;ter text';
    const filterText = 'filter';
    const highlightClass = 'highlight';
    const htmlStringsToIgnore: string[] = ['&shy;'];
    const expectedResult = 'test <span class="highlight">fil&shy;ter</span> text';
    // act
    const actualResult = htmlHighlightService.highlightHtmlText(
      htmlText,
      filterText,
      highlightClass,
      htmlStringsToIgnore,
    );
    // assert
    expect(actualResult).toEqual(expectedResult);
  });
});
