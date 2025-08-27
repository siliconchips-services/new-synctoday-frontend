import { editor } from 'monaco-editor';

export const CONSTANT = {
  DATE_FORMAT: 'DD-MMM-YYYY',
  TIME_FORMAT: 'hh:mm a',
  DATE_TIME_FORMAT: 'DD-MMM-YYYY hh:mm a',
  POST_DATE_FORMAT: 'MM/DD/YYYY',
  POST_TIME_FORMAT: 'HH:mm',
  POST_TIME_FORMAT_VP: 'HH:mm:ss',
  POST_DATE_TIME_FORMAT: 'MM/DD/YYYY HH:mm',
  POST_DATE_TIME_FORMAT_MONTH: 'MMM DD, YYYY, HH:mm',
  DATE_TIME_FORMAT1: 'MM/DD/YYYY HH:mm:ss',

  SERVER_LINK: 'http://localhost:5012/api/',
  // DOMAIN_LINK: 'http://192.168.1.237:5012/',

  NO_DATA_FOUND: '-',
  NO_DATA_FOUND_TITLE: 'No Data Found',
  NO_DATA_SUB_TITLE:
    'Please use the filter to refine the search and retrieve the data.',

  DEFAULT_PAGE_NUMBER: 1,
  DEFAULT_PAGE_SIZE: 15,
  PER_PAGE_RECORD: [15, 30, 50, 100, 200, 500],
  SET_TIMEOUT: 200,
  DEFAULT_LANGUAGE: 'en-US',
  DEFAULT_TIMEZONE: 'India Standard Time',
  DEFAULT_TIME_FORMAT: '12Hr',
};

export const DEFAULT_THEME = {
  APP_LOGO: 'SyncToday.png',
  PRIMARY_FONT: 'Poppins',
  PRIMARY_COLOR: '#041a5e',
  SECONDARY_COLOR: '#243dda',
  LANGUAGE: CONSTANT.DEFAULT_LANGUAGE,
  TIME_ZONE: CONSTANT.DEFAULT_TIMEZONE,
  DATE_FORMAT: CONSTANT.DATE_FORMAT,
  TIME_FORMAT: CONSTANT.DEFAULT_TIME_FORMAT,
  BORDER_RADIUS: 10,
};

export const JSON_EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions =
  {
    matchBrackets: 'always',
    fontSize: 14,
    wordWrapColumn: 60,
    formatOnPaste: true,
    formatOnType: true,
    minimap: {
      enabled: false,
      autohide: false,
      size: 'fill',
      side: 'right',
      showSlider: 'mouseover',
      scale: 3,
      renderCharacters: true,
      // maxColumn: 80,
      showRegionSectionHeaders: true,
      showMarkSectionHeaders: true,
      sectionHeaderFontSize: 10,
      sectionHeaderLetterSpacing: 1,
    },
    padding: {
      top: 0,
      bottom: 0,
    },
    bracketPairColorization: {
      enabled: true,
      independentColorPoolPerBracketType: false,
    },
    stickyScroll: {
      enabled: false,
      scrollWithEditor: true,
    },
    scrollbar: {
      verticalScrollbarSize: 5,
      horizontalScrollbarSize: 8,
    },
  };
