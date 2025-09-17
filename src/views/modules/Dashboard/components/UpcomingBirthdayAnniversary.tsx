import { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel, Card, Typography } from 'antd';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

interface Employee {
  id: string;
  name: string;
  dob: string; // "DD-MMM"
  doj: string; // "DD-MMM-YYYY"
}

export default function UpcomingBirthdayAnniversary() {
  const [slides, setSlides] = useState<
    { type: 'birthday' | 'anniversary'; employee: Employee; date: string }[]
  >([]);

  const { Title, Text } = Typography;

  useEffect(() => {
    axios.get<Employee[]>('/employees.json').then((res) => {
      const data = res.data;
      const today = dayjs();
      const endOfWeek = today.add(7, 'day');

      // 🎂 Upcoming birthdays
      const bdays = data
        .map((emp) => {
          const dobThisYear = dayjs(
            emp.dob + '-' + today.year(),
            'DD-MMM-YYYY',
          );
          return { emp, dobThisYear };
        })
        .filter(
          ({ dobThisYear }) =>
            dobThisYear.isAfter(today, 'day') &&
            dobThisYear.isSameOrBefore(endOfWeek, 'day'),
        )
        .map(({ emp, dobThisYear }) => ({
          type: 'birthday' as const,
          employee: emp,
          date: dobThisYear.format('DD-MMM'),
        }));

      // 💼 Upcoming anniversaries
      const anns = data
        .map((emp) => {
          const dojDate = dayjs(emp.doj, 'DD-MMM-YYYY');
          const dojThisYear = dayjs(
            dojDate.format('DD-MMM') + '-' + today.year(),
            'DD-MMM-YYYY',
          );
          return { emp, dojThisYear };
        })
        .filter(
          ({ dojThisYear }) =>
            dojThisYear.isAfter(today, 'day') &&
            dojThisYear.isSameOrBefore(endOfWeek, 'day'),
        )
        .map(({ emp, dojThisYear }) => ({
          type: 'anniversary' as const,
          employee: emp,
          date: dojThisYear.format('DD-MMM'),
        }));

      // Merge & sort by date
      const all = [...bdays, ...anns].sort(
        (a, b) =>
          dayjs(a.date, 'DD-MMM').unix() - dayjs(b.date, 'DD-MMM').unix(),
      );

      setSlides(all);
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
      {slides?.length > 0 ? (
        slides?.map((item, idx) => (
          <Card
            className={`box ${item.type === 'birthday' ? 'birthday' : 'anniversary'}`}
            key={idx}
          >
            {item.type === 'birthday' ? (
              <>
                <Title level={4} className="subTitle">
                  🎂 Upcoming Birthday
                </Title>
                <Title level={5} className="title">
                  {item.employee.name}
                </Title>
                <Text type="secondary" className="text">
                  {item.date}
                </Text>
              </>
            ) : (
              <>
                <Title level={4} className="subTitle">
                  💼 Upcoming Work Anniversary
                </Title>
                <Title level={5} className="title">
                  {item.employee.name}
                </Title>
                <Text type="secondary" className="text">
                  {item.date}
                </Text>
              </>
            )}
          </Card>
        ))
      ) : (
        <Card className="box" style={{ textAlign: 'center' }}>
          <Title level={4}>📅 No Upcoming Events</Title>
          <Text type="secondary">No birthdays or anniversaries this week</Text>
        </Card>
      )}
    </Carousel>
  );
}
