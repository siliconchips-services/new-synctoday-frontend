import React, { useCallback } from 'react';
import { DatePicker, Skeleton, Form } from 'antd';
import dayjs from 'dayjs';
import { dateFormatter } from '@/config/global';

interface DateInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  format?: string;
  validationRules?: any[];
  loading?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  pastDaysLimit?: number;
  [key: string]: any;
}

const DateInput: React.FC<DateInputProps> = ({
  name,
  label,
  placeholder,
  format = 'DD/MM/YYYY',
  validationRules,
  loading,
  disableFuture,
  disablePast,
  pastDaysLimit,
  ...rest
}) => {
  const disabledDate = useCallback(
    (current: dayjs.Dayjs | null) => {
      if (!current) return false;

      const today = dayjs().startOf('day');

      // Disable all future dates
      if (disableFuture && current.isAfter(today)) return true;

      // Disable all past dates
      if (disablePast && current.isBefore(today)) return true;

      // Only allow past `pastDaysLimit` days
      if (pastDaysLimit) {
        const pastLimit = today.subtract(pastDaysLimit, 'day');
        return current.isBefore(pastLimit, 'day');
      }

      return false;
    },
    [disableFuture, disablePast, pastDaysLimit],
  );

  return (
    <Form.Item
      name={name}
      label={label}
      rules={validationRules}
      getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
      getValueFromEvent={(date) => (date ? dateFormatter(date) : null)}
    >
      {loading ? (
        <Skeleton.Input active />
      ) : (
        <DatePicker
          placeholder={placeholder}
          disabledDate={disabledDate}
          format={format}
          status={rest[`aria-invalid`] && 'error'}
          variant="underlined"
          {...rest}
        />
      )}
    </Form.Item>
  );
};

export default DateInput;
