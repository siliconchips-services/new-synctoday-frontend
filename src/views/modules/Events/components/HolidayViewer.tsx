import React, { useEffect, useState } from 'react';
// import holidays from '@/assets/holiday.json';
import { Card } from 'antd';
import axios from 'axios';

interface MyData {
  sr: number;
  date: string;
  day: string;
  occasion: string;
  location: string;
}

const HolidayViewer: React.FC = () => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const [holidaysList, setHolidaysList] = useState<MyData[]>([]);

  useEffect(() => {
    axios.get<MyData[]>('/holiday.json').then((res) => {
      if (res?.data?.length > 0) {
        setHolidaysList(res.data);
      } else {
        setHolidaysList([]);
      }
    });
  }, []);

  return (
    <>
      <Card className="box">
        <h2>Holidays {currentYear}</h2>
        <ol className="holidayList">
          {holidaysList?.length > 0 ? (
            holidaysList?.map((h) => (
              <li key={h.sr}>
                <h4>{h.occasion}</h4>
                <strong>
                  {h.date} - {h.day}
                </strong>
                <small>{h.location}</small>
              </li>
            ))
          ) : (
            <li>No holidays available</li>
          )}
        </ol>
      </Card>
    </>
  );
};

export default HolidayViewer;
