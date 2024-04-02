const parse = require('csv-parser');
const fetch = require('fetch-retry')(global.fetch);
const config = require('./config.json');


function getLastHourEndTimeEpoch() {
    const now = new Date(); // Get the current date and time
    const lastHourStart = new Date(now); // Create a copy of the current date and time
    // Set the minutes, seconds, and milliseconds to 0 to get the start of the current hour
    lastHourStart.setMinutes(0);
    lastHourStart.setSeconds(0);
    lastHourStart.setMilliseconds(0);
    // Subtract 1 hour from the start time to get the start of the last hour
    lastHourStart.setHours(lastHourStart.getHours() - 1);
  
    // Convert the epoch time to the specified format (e.g., 1711947600)
    const epochTime = Math.floor(lastHourStart.getTime() / 1000); // Convert milliseconds to seconds
    return epochTime.toString(); // Return the epoch time as a string
  }
  
  function getLastHourStartTimeEpoch()  {
    const now = new Date(); // Get the current date and time
    const lastHourStart = new Date(now); // Create a copy of the current date and time
    // Set the minutes, seconds, and milliseconds to 0 to get the start of the current hour
    lastHourStart.setMinutes(0);
    lastHourStart.setSeconds(0);
    lastHourStart.setMilliseconds(0);
    // Subtract 1 hour from the start time to get the start of the last hour
    lastHourStart.setHours(lastHourStart.getHours() - 13);
  
    // Convert the epoch time to the specified format (e.g., 1711947600)
    const epochTime = Math.floor(lastHourStart.getTime() / 1000); // Convert milliseconds to seconds
    return epochTime.toString(); // Return the epoch time as a string
  }
  
  function getYesterdayEpochTime() {
    let today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);
    let epochTime = Math.floor(yesterday.getTime() / 1000);
    return epochTime;
  }
  
  function getMinusSevenDaysEpochTime() {
    let today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 8);
    yesterday.setHours(23, 59, 59, 999);
    let epochTime = Math.floor(yesterday.getTime() / 1000);
    return epochTime;
  }

  function parseCSV(csvData) {
    const lines = csvData.split('\n'); // Split the CSV data into lines
    const headers = lines[0].split(','); // Get the headers from the first line
    const jsonData = []; // Array to store JSON objects
  
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(','); // Split each line by commas
        const jsonObject = {}; // Create a JSON object for each line
        for (let j = 0; j < headers.length; j++) {
          jsonObject[headers[j]] = values[j]; // Assign values to keys in the JSON object
        }
        jsonData.push(jsonObject); // Push the JSON object to the array
      }
    }
    console.log('Data',jsonData);
    return jsonData; // Return the array of JSON objects
  }

  // async function fetchDataCSVWithRetry(url, options, retryCount = 3) {
  //   try {
  //     const response = await fetch(url, options);
  //     if (!response.ok) {
  //       throw new Error('Fetch request failed');
  //     }
  //     const csvData = await response.text();
  //     const parsedData = csvData;
  //     return parsedData;
  //   } catch (error) {
  //     console.error('Fetch error:', error.message);
  //     if (retryCount > 0) {
  //       console.log(`Retrying fetch (${retryCount} retries left)...`);
  //       console.log('url:',url);
  //       // Retry after 1 minute (you can adjust the delay as needed)
  //       csvData = [];
  //       parsedData = [];
  //       await new Promise(resolve => setTimeout(resolve, 30000));
  //       return fetchDataCSVWithRetry(url, options, retryCount - 1);
  //     } else {
  //       throw new Error('Max retries exceeded');
  //     }
  //   }
  // }


  async function fetchDataWithRetry(url, options, retryCount = 3) {
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
        // Retry after 1 minute (you can adjust the delay as needed)
        await new Promise(resolve => setTimeout(resolve, 30000));
        return fetchDataWithRetry(url, options, retryCount - 1);
      } else {
        throw new Error('Max retries exceeded');
      }
    }
  }
  

  async function fetchDataCSVWithRetry(url, options, retryCount = 3) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Fetch request failed');
      }
      const csvData = await response.text(); // Get the response as plain text
      return csvData; // Return the CSV data as plain text
    } catch (error) {
      console.error('Fetch error:', error.message);
      if (retryCount > 0) {
        console.log(`Retrying fetch (${retryCount} retries left)...`);
        console.log('url:', url);
        try {
          // Retry after 1 minute (you can adjust the delay as needed)
          await new Promise(resolve => setTimeout(resolve, 30000));
          return fetchDataCSVWithRetry(url, options, retryCount - 1);
        } catch (retryError) {
          console.error('Retry fetch error:', retryError.message);
          throw new Error('Max retries exceeded');
        }
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
    fetchDataWithRetry
  };
  