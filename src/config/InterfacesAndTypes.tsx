import {
  DatePickerProps,
  FormItemProps,
  InputProps,
  RadioGroupProps,
} from 'antd';
import { Rule } from 'antd/lib/form';
import { AxiosRequestConfig } from 'axios';
import { SelectProps } from 'rc-select';

export interface InputTextProps
  extends FormItemProps,
    Omit<InputProps, 'name' | 'children' | 'status' | 'onReset'> {}

export interface InputPasswordProps
  extends FormItemProps,
    Omit<InputProps, 'name' | 'children' | 'status' | 'onReset'> {}

export interface InputSelectProps
  extends FormItemProps,
    Omit<SelectProps, 'name' | 'children' | 'onReset' | 'options'> {
  options: {
    list: { [key: string]: string | number }[];
    valueKey?: string;
    textKey?: string | string[];
    rejectedValues?: (string | number)[];
    requiredValues?: (string | number)[];
    separator?: string;
  };
}

export interface InputDatePickerProps
  extends FormItemProps,
    Omit<DatePickerProps, 'name' | 'children' | 'status' | 'onReset'> {}

export interface InputRadioProps
  extends FormItemProps,
    Omit<RadioGroupProps, 'name' | 'children' | 'onReset' | 'options'> {
  options: {
    type?: 'radio' | 'button';
    list: { [key: string]: string | number }[];
    valueKey?: string;
    textKey?: string | string[];
    rejectedValues?: (string | number)[];
    requiredValues?: (string | number)[];
    separator?: string;
  };
}

export interface RequestProps {
  [key: string]: (args?: string) => Rule[];
}

export type BreadcrumbComponentItemTypes = {
  name: React.ReactNode;
  link?: string;
};

export interface BreadcrumbConfigProps {
  title: string;
  path: BreadcrumbComponentItemTypes[];
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  showToast?: boolean;
  notAddLog?: boolean;
}
