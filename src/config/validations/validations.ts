export interface Rule {
  type: string;
  message: string;
}

export interface ArrayRule extends Rule {
  type: 'array';
}

export interface EmailRule extends Rule {
  type: 'email';
}

const defaultLabel = 'this field';
export const minName = 3;
export const maxName = 50;
export const minDescription = 3;
export const maxDescription = 500;
export const minMobile = 8;
export const maxMobile = 15;
export const minEmail = 3;
export const maxEmail = 70;
export const minPassword = 8;
export const maxPassword = 20;
export const minEmailPort = 2;
export const maxEmailPort = 5;

export const regexPatterns = {
  // password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!$%^&+=])(?=.*[0-9]).*$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%*()\-_=+\[\]|,.])(?=.*[0-9]).{7,15}$/,
  mobile: /^[0-9]+$/,
  twoDecimal: /^\d*(\.\d{0,2})?$/,
  numeric: /^[0-9\b]+$/,
  phone: /^\d{4} \d{3} \d{3}$/,
  mobileValidation: /^[0-9]{10}$/,
  // specialCharacter: /^[a-zA-Z0-9]+$/,
  specialCharacter: /^[-_a-zA-Z0-9]+$/,

  whitespace:
    /^[A-Za-z0-9@#.!$%^&+=/_-]+(?:\s*[^A-Za-z0-9@#.!$%^&+=/_-]+\s*[A-Za-z0-9@#. !$%^&+=/_-]+)*$/,
  singleSpace: /^[^\s]+(?:\s[^\s]+)*(?:,\s[^\s]+(?:\s[^\s]+)*)*$/,
  firstName: /^[A-Za-z][A-Za-z\s]*$/,
  lastName: /^[A-Za-z][A-Za-z\s]*$/,
  email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  //   /^(\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+)(,\s?\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+)*$/,
  toEmail: /^(?:\b\S+@\S+\.\S+\b(?:[,\s]*)?)+$/,

  url: /^(https?|ftp):\/\/(?:www\.)?[^\s/$.?#]+\.(?:[a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,}\.[a-zA-Z]{2,})?(\/[^\s/?#]*)?$/,
  domainName: /^(?=.*\.)\S+$/,
  port: /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
  host: /^((([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/,
  multiEmail: /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,},?)+$/,
};

export const validations = {
  required: {
    text: (field = defaultLabel) => {
      return { required: true, message: `${field} is required.` };
    },
    select: (field = defaultLabel) => {
      return { required: true, message: `Please select ${field}.` };
    },
  },
  min: {
    text: (min = 3, field = defaultLabel) => {
      return {
        min,
        message: `${field} should contain minimum ${min} characters.`,
      };
    },
    select: (min: number, field = defaultLabel) => {
      return {
        min,
        message: `Please select minimum ${min} ${field}.`,
      };
    },
    number: (min: number, field = defaultLabel) => {
      return {
        min,
        message: `${field} should contain minimum ${min} digits.`,
      };
    },
  },
  max: {
    text: (max = 20, field = defaultLabel) => {
      return {
        max,
        message: `${field} should contain maximum ${max} characters.`,
      };
    },
    select: (max: number, field = defaultLabel) => {
      return {
        max,
        message: `Please select maximum ${max} ${field}.`,
      };
    },
    number: (max: number, field = defaultLabel) => {
      return {
        max,
        message: `${field} should contain maximum ${max} digits.`,
      };
    },
  },
  pattern: {
    whitespace: {
      pattern: regexPatterns.whitespace,
      message: 'Whitespace is not allowed.',
    },
    specialCharacter: {
      pattern: regexPatterns.specialCharacter,
      message: 'SpecialCharacter is not allowed.',
    },
    iP_Domain: (field = defaultLabel) => {
      return {
        pattern: regexPatterns.domainName,
        message: `Please enter a valid ${field}.`,
      };
    },
    singleSpace: {
      pattern: regexPatterns.singleSpace,
      message: 'Multiple space is not allowed.',
    },
    firstName: {
      pattern: regexPatterns.firstName,
      message: 'First letter must be capital',
    },
    lastName: {
      pattern: regexPatterns.lastName,
      message: 'First letter must be capital',
    },
    phone: {
      pattern: regexPatterns.mobileValidation,
      message: 'Phone should contain only 10 numbers.',
    },
    password: (field = defaultLabel) => {
      return {
        pattern: regexPatterns.password,
        message: `${field} should contain at least 7 to 15 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.`,
      };
    },
    numeric: {
      pattern: regexPatterns.numeric,
      message: 'Please enter digits only.',
    },
    decimal: (number: number) => {
      return {
        pattern: regexPatterns.twoDecimal,
        message: `Please enter digits or decimal digits up to ${number} decimal places only.`,
      };
    },
    other: (field = defaultLabel) => {
      return {
        pattern: regexPatterns.firstName,
        message: `Please enter a valid ${field}.`,
      };
    },
    email: (field?: string | undefined): EmailRule => {
      return { type: 'email', message: `${field} Is Invalid email.` };
    },
    toEmail: () => {
      return {
        pattern: regexPatterns.toEmail,
        message: `Please enter valid email addresses.`,
      };
    },
    url: (field = defaultLabel) => {
      return {
        pattern: regexPatterns.url,
        message: `${field} Is Invalid URL.`,
      };
    },

    port: {
      pattern: regexPatterns.port,
      message: 'Please enter a valid port number between 0 and 65535.',
    },
    host: {
      pattern: regexPatterns.host,
      message:
        'The hostname must be a valid domain name. It should only contain alphanumeric characters, hyphens (but not at the beginning or end), and periods.',
    },
    IP: {
      pattern: regexPatterns.host,
      message: 'Please enter a valid IP address.',
    },
  },
  email: (field = defaultLabel) => {
    return {
      type: 'email',
      message: `${field} Is Invalid email.`,
    };
  },
  multiEmail: (field = defaultLabel) => {
    return {
      pattern: regexPatterns.multiEmail,
      message: `${field} Is Invalid email.`,
    };
  },
};
