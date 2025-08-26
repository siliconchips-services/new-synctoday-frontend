import { RcFile } from 'antd/lib/upload';
import CryptoJS from 'crypto-js';
import { debounce } from 'lodash';
import { CONSTANT } from './Constant';
import { Button, Flex, message, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';

export const Constant = {
  API_KEY: 'secret-api-key',
  SSO_KEY: 'secretSSO-api-key',
};

/**
 * Converts a CSV permission string into an array
 */
export const convertCSVToArray = (input: string): string[] => {
  if (!input) return [];
  return decodeURIComponent(input)
    .split(',')
    .map((item) => item.trim());
};

/**
 * Retrieves current user's permissions as array
 */
export const checkPermissionArray = (): string[] => {
  const permissionStr = Cookies.get('permission');
  return convertCSVToArray(permissionStr || '');
};

/**
 * Checks whether user has given module-action permission
 * Core reusable function
 * Supports:
 * - Full match: Module.Action
 * - Wildcard module: Module.All
 * - Full access: All.All
 */
export const checkPermission = (module: string, action: string): boolean => {
  const permissions = checkPermissionArray();
  return (
    permissions.includes(`${module}.${action}`) ||
    permissions.includes(`${module}.All`) ||
    permissions.includes(`All.All`)
  );
};

// Specific permission helpers
export const checkEditPermission = (
  module: string,
): 'edit' | 'read' | 'none' => {
  const isEditable = checkPermission(module, 'Edit');
  const isReadonly = checkPermission(module, 'Read');

  if (isEditable) return 'edit';
  if (isReadonly) return 'read';
  return 'none';
};
// Checks whether user has add permission
export const checkAddPermission = (module: string): boolean => {
  return checkPermission(module, 'Add');
};
// Checks whether user has delete permission
export const checkDeletePermission = (module: string): boolean => {
  return checkPermission(module, 'Delete');
};
// Checks whether user has export permission
export const checkExportPermission = (module: string): boolean => {
  return checkPermission(module, 'Export');
};

export const uploadedFileOnPreview = async (file: any) => {
  let src = file.url as string;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as RcFile);
      reader.onload = () => resolve(reader.result as string);
    });
  }

  const image = new Image();
  image.src = src;
  const imgWindow: any = window.open(src);
  imgWindow.document.write(image.outerHTML);
};

const insertAt = (array: any[], index: number, ...elementsArray: any[]) => {
  array.splice(index, 0, ...elementsArray);
};

export const convertTextToID = (
  textArray: any,
  mainArray: any,
  textKey = 'name',
  idKey = 'id',
) => {
  const newArray: any = [];
  if (textArray && textArray.values && textArray.values.length > 0) {
    textArray.values.forEach((x: any) => {
      const temp = mainArray.find((y: any) => y[textKey] === x);
      if (x && temp) {
        newArray.push(temp[idKey]);
      } else {
        insertAt(newArray, 0, x);
      }
    });
  }

  return newArray;
};

export const copyTextToClipboard = (textToCopy: any) => {
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // text area method
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    // make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise<void>((res, rej) => {
      // here the magic happens
      if (document.execCommand('copy')) {
        res();
      } else {
        rej();
      }
      textArea.remove();
    });
  }
};

export const stringEncryption = (string: string) => {
  return CryptoJS.AES.encrypt(string, Constant.API_KEY)
    .toString()
    .replace(/\+/g, 'xMl3Jk')
    .replace(/\//g, 'Por21Ld')
    .replace(/=/g, 'Ml32');
};

export const stringWithKeyEncryption = (string: string) => {
  return CryptoJS.AES.encrypt(string, Constant.SSO_KEY)
    .toString()
    .replace(/\+/g, 'xMl3Jk')
    .replace(/\//g, 'Por21Ld')
    .replace(/=/g, 'Ml32');
};

export const stringDecryption = (string) => {
  try {
    string = string
      .replace(/xMl3Jk/g, '+')
      .replace(/Por21Ld/g, '/')
      .replace(/Ml32/g, '=');

    const decrypted = CryptoJS.AES.decrypt(string, Constant.API_KEY).toString(
      CryptoJS.enc.Utf8,
    );

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null; // Or handle the error in an appropriate way
  }
};

export const stringWithKeyDecryption = (string) => {
  try {
    string = string
      .replace(/xMl3Jk/g, '+')
      .replace(/Por21Ld/g, '/')
      .replace(/Ml32/g, '=');

    const decrypted = CryptoJS.AES.decrypt(string, Constant.SSO_KEY).toString(
      CryptoJS.enc.Utf8,
    );

    return decrypted;
  } catch (error) {
    console.error('Error: ', error);
    return null; // Or handle the error in an appropriate way
  }
};

export const dataToFormDataConverter = (data: any) => {
  const formData = new FormData();

  for (const name in data) {
    const value = data[name];

    // Only add values that are not undefined or null
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // If it's an array, append each item to the formData
        value.forEach((item) => {
          // If the item is a File, append as a File; otherwise, append as normal data
          if (item instanceof File) {
            formData.append(name, item);
          } else {
            formData.append(name, item);
          }
        });
      } else if (value instanceof File) {
        // If it's a single File, append directly as File
        formData.append(name, value);
      } else {
        // For other types, append as normal data (string, number, etc.)
        formData.append(name, value);
      }
    }
  }

  return formData;
};

export const detectMimeType = (binary: string): 'image/png' | 'image/jpeg' => {
  const header = binary.slice(0, 4);

  // PNG header: \x89PNG
  if (
    header.charCodeAt(0) === 0x89 &&
    header.charCodeAt(1) === 0x50 &&
    header.charCodeAt(2) === 0x4e &&
    header.charCodeAt(3) === 0x47
  ) {
    return 'image/png';
  }

  // JPEG header: \xFF\xD8\xFF
  if (
    header.charCodeAt(0) === 0xff &&
    header.charCodeAt(1) === 0xd8 &&
    header.charCodeAt(2) === 0xff
  ) {
    return 'image/jpeg';
  }

  // Default fallback
  return 'image/png';
};

export const binaryToBase64 = (
  buffer: ArrayBuffer,
  mimeType: string,
): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const base64String = window.btoa(binary);

  // Return full data URL
  return `data:${mimeType};base64,${base64String}`;
};

// export const binaryToBase64 = (binary: string): string => {
//   // Convert string to Uint8Array
//   const uint8Array = new TextEncoder().encode(binary);

//   // Convert Uint8Array to base64 string
//   let binaryString = '';
//   for (let i = 0; i < uint8Array.length; i++) {
//     binaryString += String.fromCharCode(uint8Array[i]);
//   }

//   const base64String = btoa(binaryString);

//   return base64String;
// };

export const b64toBlob = (
  b64Data: string,
  contentType = '',
  sliceSize = 512,
): File => {
  // const byteCharacters = Buffer.from(b64Data, 'base64').toString('binary');
  const byteCharacters = new TextDecoder().decode(
    Uint8Array.from(atob(b64Data), (c) => c.charCodeAt(0)),
  );

  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new File(byteArrays, 'pot', { type: contentType });
};

/**
 * Convert a base64 string to a valid image `src` string
 * @param base64 - Raw base64 string (may include text after image data)
 * @returns string - Full data URL to be used as `src` for <img>
 */
export const base64ToImageSrc = (base64: string): string => {
  if (base64 === undefined) {
    return;
  }
  const cleaned =
    base64 && base64?.trim()?.match(/^([A-Za-z0-9+/=]+)[^A-Za-z0-9+/=]*$/);

  const validBase64 = cleaned ? cleaned[1] : base64;
  return `data:image/png;base64,${validBase64}`;
};

export const validateFields = debounce((form, setDisabled) => {
  form
    .validateFields()
    .then(() => {
      setDisabled(false);
    })
    .catch(() => {
      setDisabled(true);
    });
}, 500);

export const dateFormatter = (
  date: string | number | Date | null | undefined,
  customFormat?: string,
): string => {
  if (!date) return CONSTANT.NO_DATA_FOUND;

  try {
    const userPrefRaw = Cookies.get('userPreference');
    let format = customFormat;

    if (!format && userPrefRaw) {
      const userPref = JSON.parse(userPrefRaw);
      const updatedTimeFormat =
        userPref?.timeFormat === '12Hr'
          ? CONSTANT.TIME_FORMAT
          : CONSTANT.POST_TIME_FORMAT;
      const dateFormat = userPref?.dateFormat || CONSTANT.DATE_FORMAT;
      const timeFormat = updatedTimeFormat;
      format = `${dateFormat} ${timeFormat}`;
    }

    if (!format) {
      format = CONSTANT.DATE_TIME_FORMAT;
    }

    return dayjs(date).format(format);
  } catch (error) {
    console.error('Date formatting error:', error);
    return CONSTANT.NO_DATA_FOUND;
  }
};

export const snakeCaseString = (str: any): string => {
  return (
    str &&
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
      )
      .map((s: any) => s.toLowerCase())
      .join('_')
  );
};

export const camelCaseString = (str: string): string => {
  return str
    .replace(/[-_]+/g, ' ') // Replace hyphens and underscores with spaces
    .split(' ') // Split into words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('');
};

export const numberWithCommas = (numberString: string): string => {
  const number = parseFloat(numberString);
  if (isNaN(number)) return ''; // Handle invalid input

  // Convert number to string with 2 decimal places
  const formattedNumber = number.toFixed(2);

  // Split the number into integer and fractional parts
  const parts = formattedNumber.split('.');

  // Add commas to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Join the parts and return
  return parts.join('.');
};

export const convertTimeFormat = (timeString: string): string => {
  const parts = timeString.split(':'); // Split the time string by colon (:)

  // Check if there are enough parts to extract minutes and seconds
  if (parts.length < 2) {
    return '00:00'; // Return default if format is incorrect
  }

  const minutes = parseInt(parts[0], 10); // Extract minutes part and convert to integer
  const secondsWithDecimals = parts[1].split('.')[0]; // Extract seconds part without decimals
  const seconds = parseInt(secondsWithDecimals.substring(0, 2), 10); // Convert seconds to integer

  // Pad minutes and seconds with leading zeros and return formatted time
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Global function to convert time in seconds to "min:sec" format
export const convertToMinSec = (seconds: any) => {
  if (seconds === 0) {
    return '00:00';
  }

  // const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60); // Round down the seconds
  const fractionalPart = Math.round(((seconds % 60) - remainingSeconds) * 100); // Extract fractional part and round
  const secondsWithFraction = `${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}:${fractionalPart < 10 ? '0' : ''}${fractionalPart}`; // Ensure leading zeros for single-digit seconds and fractional part
  return secondsWithFraction;
};

export const secondsToMinutes = (seconds: any) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const audioStreamToURL = async (stream: any, contentType: any) => {
  return URL.createObjectURL(new Blob([stream], { type: contentType }));
};

export const downloadAudio = (url, filename) => {
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  // document.body.removeChild(a);s
  window.URL.revokeObjectURL(url);
};

export const exportJSONToCSV = (
  jsonData: Record<string, any>[],
  filename = 'data.csv',
) => {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    console.warn('No data available to export');
    return;
  }

  // Flatten nested objects as JSON strings
  const processRow = (row: Record<string, any>) => {
    const processed: Record<string, any> = {};
    Object.keys(row).forEach((key) => {
      const value = row[key];
      if (typeof value === 'object' && value !== null) {
        processed[key] = JSON.stringify(value);
      } else {
        processed[key] = value ?? '';
      }
    });
    return processed;
  };

  const processedData = jsonData.map(processRow);

  // Collect and sort all unique keys alphabetically
  const allKeys = new Set<string>();
  processedData.forEach((row) => {
    Object.keys(row).forEach((key) => allKeys.add(key));
  });

  const sortedKeys = Array.from(allKeys).sort();

  // Build CSV rows
  const csvRows = [
    sortedKeys.join(','), // Header
    ...processedData.map((row) =>
      sortedKeys
        .map((key) => {
          const value = row[key] ?? '';
          return `"${value.toString().replace(/"/g, '""')}"`; // Escape quotes
        })
        .join(','),
    ),
  ];

  const csvString = csvRows.join('\n');

  const blob = new Blob([`\uFEFF${csvString}`], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const flattenObject = (obj: any, prefix = ''): Record<string, any> =>
  Object.keys(obj).reduce(
    (acc, k) => {
      const pre = prefix.length ? `${prefix}.${k}` : k;
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        Object.assign(acc, flattenObject(obj[k], pre));
      } else {
        acc[pre] = obj[k];
      }
      return acc;
    },
    {} as Record<string, any>,
  );

// Export JSON to CSV-like Excel (bold header supported)
export const exportJSONToXLS = (
  jsonData: Record<string, any>[],
  filename = 'data.xls',
) => {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    console.warn('No data available to export');
    return;
  }

  const flattenedData = jsonData.map((item) => flattenObject(item));
  const keys = Array.from(
    new Set(flattenedData.flatMap((row) => Object.keys(row))),
  ).sort();

  // Build table rows
  const rows = [
    `<tr>${keys.map((key) => `<th style="font-weight:bold; font-size: 12pt">${key}</th>`).join('')}</tr>`,
    ...flattenedData.map(
      (row) =>
        `<tr>${keys
          .map(
            (key) =>
              `<td style="font-weight:normal; font-size: 12pt">${(row[key] ?? '').toString().replace(/</g, '&lt;')}</td>`,
          )
          .join('')}</tr>`,
    ),
  ];

  const htmlTable = `
    <table border="1">
      ${rows.join('\n')}
    </table>
  `;

  const blob = new Blob([`\uFEFF${htmlTable}`], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    message.success('Copied to clipboard!');
  } catch (err) {
    console.error('Error: ', err);
    message.error('Failed to copy');
  }
};

export const stripProtocol = (url: string) => {
  return url.replace(/^https?:\/\//, '');
};

export const trimIdNumber = (value: string, count?: number) => {
  return (
    <Tooltip title={value}>
      <Flex align="center" justify="space-between">
        {value?.length > count ? (
          <span style={{ marginRight: 8 }}>
            {`${value?.slice(0, count ?? 6)}...${value?.slice(-3)}`}
          </span>
        ) : (
          <span style={{ marginRight: 8 }}>{`${value}`}</span>
        )}
        <Button
          type="link"
          icon={<CopyOutlined />}
          className="p-0 m-0"
          style={{ padding: 0 }}
          onClick={() => copyToClipboard(value)}
        />
      </Flex>
    </Tooltip>
  );
};

export function parseDomainParts(url: string) {
  const { hostname } = new URL(url);
  const parts = hostname.split('.'); // ["publishingsuite","platform","siliconchips-syncapps","com"]

  if (parts.length < 2) {
    return { subSubDomain: null, subDomain: null, domain: hostname };
  }

  const domain = parts.slice(-2).join('.'); // "syncapps.com" or "siliconchips-syncapps.com" depending on rule
  const subDomain = parts.length > 2 ? parts[parts.length - 3] : null;
  const subSubDomain =
    parts.length > 3 ? parts.slice(0, parts.length - 3).join('.') : null;

  return { subSubDomain, subDomain, domain };
}
