import { useEffect, useState, useRef } from 'react';
import { init, dispose } from 'klinecharts';
import classNames from 'classnames';
import { fetchData, subscribeTrade } from './api';
import { mergeCandle } from './candle';
import './App.css';

const fiveMinutes = 300;
const fifteenMinutes = 900;
const oneHour = 3600;
const fourHours = oneHour * 4;
const oneDay = oneHour * 24;
const oneWeek = oneDay * 7;

function App() {
  const [resolution, setResolution] = useState(oneHour);
  const [market] = useState('LUNA/USD');
  const [latestData, setLatestData] = useState({});
  const chart = useRef(null);
  const ws = useRef(null);

  useEffect(() => {
    document.title = market;
  });

  useEffect(() => {
    chart.current = init("klineChart", {
      candle: {
        tooltip: {
          labels: ["time: ", "open: ", "high: ", "low: ", "close: ", "volume: "],
        }
      }
    });

    fetchData(market, resolution).then(data => {
      setLatestData(data[data.length - 1]);
      chart.current.applyNewData(data);
    });

    return () => {
      dispose(chart.current);
    };
  }, [market, resolution]);

  useEffect(() => {
    ws.current = subscribeTrade(market);
    return () => {
      ws.current.close();
    };
  }, [market]);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = function (event) {
      const trade = JSON.parse(event.data);
      const data = trade.data;
      if (!data) return;
      const newData = mergeCandle(latestData, data[data.length-1], resolution);
      setLatestData(newData);
      chart.current.updateData(newData);
    };
  }, [resolution, latestData]);

  return (
    <div className="App">
      <header className="header">
        <div className="market">{market}</div>
        <div className={classNames('resolution', {selected: resolution === fiveMinutes })} onClick={() => setResolution(fiveMinutes)}>5m</div>
        <div className={classNames('resolution', {selected: resolution === fifteenMinutes })} onClick={() => setResolution(fifteenMinutes)}>15m</div>
        <div className={classNames('resolution', {selected: resolution === oneHour })} onClick={() => setResolution(oneHour)}>1h</div>
        <div className={classNames('resolution', {selected: resolution === fourHours })} onClick={() => setResolution(fourHours)}>4h</div>
        <div className={classNames('resolution', {selected: resolution === oneDay })} onClick={() => setResolution(oneDay)}>D</div>
        <div className={classNames('resolution', {selected: resolution === oneWeek })} onClick={() => setResolution(oneWeek)}>W</div>
      </header>
      <div id="klineChart"></div>
    </div>
  );
}

export default App;
