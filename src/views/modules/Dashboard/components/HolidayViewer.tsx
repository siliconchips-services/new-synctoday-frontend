import React from 'react';
import holidays from '@/assets/holiday.json';
import { Card } from 'antd';

const HolidayViewer: React.FC = () => {
  const today = new Date();
  const currentYear = today.getFullYear();

  return (
    <>
      <Card className="box">
        <h2>Holidays {currentYear}</h2>
        <ol className="holidayList">
          {holidays.length > 0 ? (
            holidays?.map((h) => (
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
