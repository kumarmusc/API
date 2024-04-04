
function getLastHourEndTimeEpoch() {
  const now = new Date();
  const lastHourEnd = new Date(now);
  lastHourEnd.setMinutes(0);
  lastHourEnd.setSeconds(0);
  lastHourEnd.setMilliseconds(0);
  lastHourEnd.setHours(lastHourEnd.getHours() - 1);
  return Math.floor(lastHourEnd.getTime() / 1000).toString();
}

function getLastHourStartTimeEpoch() {
  const now = new Date();
  const lastHourStart = new Date(now);
  lastHourStart.setMinutes(0);
  lastHourStart.setSeconds(0);
  lastHourStart.setMilliseconds(0);
  lastHourStart.setHours(lastHourStart.getHours() - 13);
  return Math.floor(lastHourStart.getTime() / 1000).toString();
}

function getYesterdayEpochTime() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 59, 999);
  return Math.floor(yesterday.getTime() / 1000);
}

function getMinusSevenDaysEpochTime() {
  const today = new Date();
  const minusSevenDays = new Date(today);
  minusSevenDays.setDate(today.getDate() - 8);
  minusSevenDays.setHours(0, 0, 0, 0);
  return Math.floor(minusSevenDays.getTime() / 1000);
}

function getMinusThirtyDaysEpochTime() {
  const today = new Date();
  const minusThirtyDays = new Date(today);
  minusThirtyDays.setDate(today.getDate() - 31);
  minusThirtyDays.setHours(0, 0, 0, 0);
  return Math.floor(minusThirtyDays.getTime() / 1000);
}

function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10);
}

function getMinusSevenDaysDateFromYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const minusSevenDays = new Date(yesterday);
  minusSevenDays.setDate(yesterday.getDate() - 7);
  return minusSevenDays.toISOString().slice(0, 10);
}

function getMinusThirtyDaysDateFromYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const minusThirtyDays = new Date(yesterday);
  minusThirtyDays.setDate(yesterday.getDate() - 30);
  return minusThirtyDays.toISOString().slice(0, 10);
}

async function fetchDataWithRetry(url, options = {}, retryCount = 3) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Fetch request failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error.message);
    if (retryCount > 0) {
      console.log(`Retrying fetch (${retryCount} retries left)...`);
      // Retry after 10 seconds
      await new Promise(resolve => setTimeout(resolve, 10000));
      return fetchDataWithRetry(url, options, retryCount - 1);
    } else {
      throw new Error('Max retries exceeded');
    }
  }
}

module.exports = {
  getLastHourStartTimeEpoch,
  getLastHourEndTimeEpoch,
  getYesterdayEpochTime,
  getMinusSevenDaysEpochTime,
  getMinusThirtyDaysEpochTime,
  getYesterdayDate,
  getMinusThirtyDaysDateFromYesterday,
  getMinusSevenDaysDateFromYesterday,
  fetchDataWithRetry
};
