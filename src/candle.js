export function mergeCandle(data, trade, resolution) {
    // utc to timestamp
    const timestamp = new Date(trade.time).getTime();
    if (timestamp >= data.timestamp + resolution * 1000) {
      return {
        open: trade.price,
        close: trade.price,
        high: trade.price,
        low: trade.price,
        volume: trade.size,
        timestamp: data.timestamp + resolution * 1000,
      }
    }
    
    if (data.high < trade.price) {
      data.high = trade.price;
    }
  
    if (data.low > trade.price) {
      data.low = trade.price;
    }
  
    data.close = trade.price;
    data.volume = data.volume + trade.size;
  
    return data
}