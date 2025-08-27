import React, { useCallback } from 'react';
import { DatePicker, Skeleton, Form } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface DateRangeInputProps {
  name: string;
  label?: string;
  placeholder?: [string, string];
  format?: string;
  validationRules?: any[];
  loading?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  pastDaysLimit?: number;
  [key: string]: any;
}

const DateRangeInput: React.FC<DateRangeInputProps> = ({
  name,
  label,
  placeholder = ['Start date', 'End date'],
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

      if (disableFuture && current.isAfter(today)) return true;
      if (disablePast && current.isBefore(today)) return true;

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
      getValueProps={(value) => ({
        value: value
          ? [dayjs(value[0], format), dayjs(value[1], format)]
          : null,
      })}
      getValueFromEvent={(dates) =>
        dates ? [dates[0].format(format), dates[1].format(format)] : null
      }
    >
      {loading ? (
        <Skeleton.Input active style={{ width: '100%' }} />
      ) : (
        <RangePicker
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

export default DateRangeInput;
