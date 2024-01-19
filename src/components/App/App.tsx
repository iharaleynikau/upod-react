import React, { useState, useEffect } from 'react';
import { Image, Carousel, DatePicker, Space, Skeleton } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import { RangePickerProps } from 'antd/es/date-picker';
import type { Dayjs } from 'dayjs';
import './App.css';

const { RangePicker } = DatePicker;

function App() {
  const API_KEY = process.env.REACT_APP_API_KEY;

  const currentDate = dayjs().format('YYYY-MM-DD');

  const proportions = {
    width: '350px',
    height: '250px'
  };

  const [data, setData] = useState([]);
  const [dates, setDates] = useState({
    startDate: currentDate,
    endDate: currentDate
  });
  const [isLoading, setIsLoading] = useState(false);

  const disabledDate: RangePickerProps['disabledDate'] = current => {
    return current && current > dayjs().endOf('day');
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${dates.startDate}&end_date=${dates.endDate}`
      )
      .then(res => {
        setData(res.data);
        setIsLoading(false);
      });
  }, [API_KEY, dates]);

  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      setDates({
        startDate: dateStrings[0],
        endDate: dateStrings[1]
      });
    }
  };

  return (
    <div className="main">
      <Space direction="vertical">
        <RangePicker
          disabledDate={disabledDate}
          disabled={[false, false]}
          defaultValue={[dayjs(dayjs(), 'YYYY-MM-DD'), dayjs(dayjs(), 'YYYY-MM-DD')]}
          allowClear={false}
          style={{ width: proportions.width, marginBottom: '20px' }}
          onChange={onRangeChange}
        />
        {isLoading ? (
          <Skeleton.Image style={{ width: proportions.width, height: proportions.height }} active={true} />
        ) : (
          <Carousel autoplay={true} autoplaySpeed={1500} style={{ width: '350px' }}>
            {data.map((data: { url: string | undefined }, index) => {
              return (
                <div key={index}>
                  <Image
                    style={{
                      width: proportions.width,
                      height: proportions.height,
                      objectFit: 'cover',
                      textAlign: 'center'
                    }}
                    src={data.url}
                  />
                </div>
              );
            })}
          </Carousel>
        )}
      </Space>
    </div>
  );
}

export default App;
