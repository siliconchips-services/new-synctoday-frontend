import { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel, Card, Typography } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface Holiday {
  id: string;
  date: string; // "DD-MMM-YYYY"
  day: string;
  occasion: string;
  location: string;
}

export default function HolidaySlider() {
  const [holidays, setHolidays] = useState<
    { holiday: Holiday; dateObj: dayjs.Dayjs }[]
  >([]);

  useEffect(() => {
    axios.get<Holiday[]>('/holiday.json').then((res) => {
      const data = res.data;
      const today = dayjs();
      const endOfYear = dayjs(`${today.year()}-12-31`, 'YYYY-MM-DD');

      const parsed = data
        .map((h) => {
          const holidayDate = dayjs(h.date, 'DD-MMM-YYYY');
          return { holiday: h, dateObj: holidayDate };
        })
        .filter(
          ({ dateObj }) =>
            dateObj.isAfter(today, 'day') &&
            dateObj.isSameOrBefore(endOfYear, 'day'),
        )
        .sort((a, b) => a.dateObj.valueOf() - b.dateObj.valueOf());

      setHolidays(parsed);
    });
  }, []);

  return (
    <Carousel
      effect="fade"
      draggable
      arrows
      dots={false}
      infinite={true}
      speed={1000}
      style={{ marginBottom: 20 }}
    >
      {holidays?.length > 0 ? (
        holidays?.map(({ holiday, dateObj }) => (
          <Card
            className="box holiday"
            key={holiday.id}
            style={{ textAlign: 'center' }}
          >
            <Title level={4} className="title">
              {holiday.occasion}
            </Title>
            <Title level={5} className="subTitle">
              {dateObj.format('DD-MMM-YYYY')}
            </Title>
            <Text type="secondary" className="text">
              {holiday.location} - {dateObj.format('dddd')}
            </Text>
          </Card>
        ))
      ) : (
        <Card className="box holiday" style={{ textAlign: 'center' }}>
          <Title level={4} className="title">
            No Upcoming Holidays
          </Title>
          <Text type="secondary">All holidays are done for this year</Text>
        </Card>
      )}
    </Carousel>
  );
}
