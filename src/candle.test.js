import { mergeCandle } from "./candle";

describe("mergeCandle", () => {
    test("in same period", () => {
        const data = {
            open: 1,
            close: 2,
            high: 3,
            low: 4,
            volume: 5,
            timestamp: 1546300800000,
        };
        const trade = {
            price: 7,
            size: 8,
            time: "2019-01-01T00:00:00.000Z",
        };
        const resolution = 900;
        const newData = mergeCandle(data, trade, resolution);
        expect(newData).toEqual({
            open: 1,
            close: 7,
            high: 7,
            low: 4,
            volume: 5 + 8,
            timestamp: 1546300800000,
        });
    });

    test("not in same period", () => {
        const data = {
            open: 1,
            close: 2,
            high: 3,
            low: 4,
            volume: 5,
            timestamp: 1546300800000,
        };
        const trade = {
            price: 7,
            size: 8,
            time: "2019-01-01T00:15:01.000Z",
        };
        const resolution = 900;
        const newData = mergeCandle(data, trade, resolution);
        expect(newData).toEqual({
            open: 7,
            close: 7,
            high: 7,
            low: 7,
            volume: 8,
            timestamp: 1546301700000,
        });
    });
})