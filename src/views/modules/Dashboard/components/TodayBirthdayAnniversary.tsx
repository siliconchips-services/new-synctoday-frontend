import { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel, Card, Typography } from 'antd';
import dayjs from 'dayjs';

interface Employee {
  id: string;
  name: string;
  dob: string; // "DD-MMM"
  doj: string; // "DD-MMM-YYYY"
}

export default function TodayBirthdayAnniversary() {
  const [slides, setSlides] = useState<
    { type: 'birthday' | 'anniversary'; employee: Employee }[]
  >([]);

  const { Title } = Typography;

  useEffect(() => {
    axios.get<Employee[]>('/employees.json').then((res) => {
      const data = res.data;
      const today = dayjs();

      const bdays = data
        .filter((emp) => dayjs(emp.dob, 'DD-MMM').isSame(today, 'day'))
        .map((emp) => ({ type: 'birthday' as const, employee: emp }));

      const anns = data
        .filter((emp) => dayjs(emp.doj, 'DD-MMM-YYYY').isSame(today, 'day'))
        .map((emp) => ({ type: 'anniversary' as const, employee: emp }));

      // Birthdays first, then anniversaries
      setSlides([...bdays, ...anns]);
    });
  }, []);

  if (slides.length === 0) {
    return null; // nothing today
  }

  return (
    <div>
      <Carousel
        effect="fade"
        draggable
        arrows
        dots={false}
        infinite={true}
        speed={1000}
        style={{ marginBottom: 20 }}
      >
        {slides.map((item, idx) => (
          <Card
            className={`box ${item.type === 'birthday' ? 'birthday' : 'anniversary'}`}
            key={idx}
          >
            {item.type === 'birthday' ? (
              <>
                <Title level={4} className="subTitle">
                  🎂 Happy Birthday
                </Title>
                <Title level={5} className="title">
                  {item.employee.name}
                </Title>
              </>
            ) : (
              <>
                <Title level={4} className="subTitle">
                  💼 Happy Work Anniversary
                </Title>
                <Title level={5} className="title">
                  {item.employee.name}
                </Title>
              </>
            )}
          </Card>
        ))}
      </Carousel>
    </div>
  );
}
