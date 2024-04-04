// Import necessary modules
const express = require('express');
const cors = require('cors');
const config = require('./config.json');
const { getLastHourStartTimeEpoch, getLastHourEndTimeEpoch, getYesterdayEpochTime, getMinusSevenDaysEpochTime, getMinusThirtyDaysEpochTime, getYesterdayDate, getMinusThirtyDaysDateFromYesterday, getMinusSevenDaysDateFromYesterday, fetchDataWithRetry } = require('./utils');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

const { apiKey, sensorindexupc, sensorindexhsc, upcLatitude, upcLongitude, hscLatitude, hscLongitude } = config;
const headers = {
  'X-API-Key': apiKey
};
let purpleAirDataUPC = null;
let purpleAirDataHSC = null;
let purpleAirData12HrUPC = null;
let purpleAirData12HrHSC = null;
let purpleAirData7DaysUPC = null;
let purpleAirData7DaysHSC = null;
let purpleAirData30DaysUPC = null;
let purpleAirData30DaysHSC = null;
let upcomingWeatherUPC = null;
let upcomingWeatherHSC = null;
let past7dayWeatherUPC = null;
let past7dayWeatherHSC = null;
let past30dayWeatherUPC = null;
let past30dayWeatherHSC = null;

async function fetchDataFromPurpleAirUPC() {
  try {
    const url = `https://api.purpleair.com/v1/sensors/${sensorindexupc}/?fields=pm2.5,pm2.5_10minute,pm2.5_30minute,pm2.5_60minute,pm2.5_6hour,pm2.5_24hour,pm2.5_1week,primary_id_a,primary_key_a,primary_id_b,primary_key_b,secondary_id_a,secondary_key_a,secondary_id_b,secondary_key_b,channel_flags_auto,channel_flags_manual,temperature_a,hardware,firmware_version,rssi,firmware_upgrade,firmware_version,pm2.5_10minute,pm2.5_30minute,pm2.5_60minute,pm2.5_6hour,pm2.5_24hour,pm2.5_1week`;
    const options = { headers };
    purpleAirDataUPC = await fetchDataWithRetry(url, options);
    console.log('PurpleAir 10Minute UPC data fetched successfully');
  } catch (error) {
    console.error('Error fetching data from PurpleAir API for UPC:', error);
  }
}

async function fetchDataFromPurpleAirHSC() {
  try {
    const url = `https://api.purpleair.com/v1/sensors/${sensorindexhsc}/?fields=pm2.5,pm2.5_10minute,pm2.5_30minute,pm2.5_60minute,pm2.5_6hour,pm2.5_24hour,pm2.5_1week,primary_id_a,primary_key_a,primary_id_b,primary_key_b,secondary_id_a,secondary_key_a,secondary_id_b,secondary_key_b,channel_flags_auto,channel_flags_manual,temperature_a,hardware,firmware_version,rssi,firmware_upgrade,firmware_version,pm2.5_10minute,pm2.5_30minute,pm2.5_60minute,pm2.5_6hour,pm2.5_24hour,pm2.5_1week`;
    const options = { headers };
    purpleAirDataHSC = await fetchDataWithRetry(url, options);
    console.log('PurpleAir 10Minute HSC data fetched successfully');
  } catch (error) {
    console.error('Error fetching data from PurpleAir API for HSC:', error);
  }
}

async function fetchDataFromPurpleAir12HrUPC() {
  try {
    const startTimestamp = getLastHourStartTimeEpoch();
    const endTimestamp = getLastHourEndTimeEpoch();
    const url = `https://api.purpleair.com/v1/sensors/${sensorindexupc}/history?start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}&average=60&fields=pm2.5_alt`;
    const options = { headers };
    purpleAirData12HrUPC = await fetchDataWithRetry(url, options);
    console.log('PurpleAir 12Hr UPC data fetched successfully:');
  } catch (error) {
    console.error('Error fetching data from PurpleAir API for UPC (12 hours):', error);
  }
}

async function fetchDataFromPurpleAir12HrHSC() {
  try {
    const startTimestamp = getLastHourStartTimeEpoch();
    const endTimestamp = getLastHourEndTimeEpoch();
    const url = `https://api.purpleair.com/v1/sensors/${sensorindexhsc}/history?start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}&average=60&fields=pm2.5_alt`;
    const options = { headers };
    purpleAirData12HrHSC = await fetchDataWithRetry(url, options);
    console.log('PurpleAir 12Hr HSC data fetched successfully:');
  } catch (error) {
    console.error('Error fetching data from PurpleAir API for HSC (12 hours):', error);
  }
}

async function fetchDataFromPurpleAir7DaysUPC() {
  try {
    const startTimestamp = getMinusSevenDaysEpochTime();
    const endTimestamp = getYesterdayEpochTime();
    const url = `https://api.purpleair.com/v1/sensors/${sensorindexupc}/history?start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}&average=1440&fields=pm2.5_alt`;
    const options = { headers };
    purpleAirData7DaysUPC = await fetchDataWithRetry(url, options);
    console.log('PurpleAir 7 days UPC data fetched successfully:');
  } catch (error) {
    console.error('Error fetching 7 day data from PurpleAir API for UPC:', error);
  }
}

async function fetchDataFromPurpleAir7DaysHSC() {
  try {
    const startTimestamp = getMinusSevenDaysEpochTime();
    const endTimestamp = getYesterdayEpochTime();
    const url = `https://api.purpleair.com/v1/sensors/${sensorindexhsc}/history?start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}&average=1440&fields=pm2.5_alt`;
    const options = { headers };
    purpleAirData7DaysHSC = await fetchDataWithRetry(url, options);
    console.log('PurpleAir 7 days HSC data fetched successfully');
  } catch (error) {
    console.error('Error fetching 7 day data from PurpleAir API for HSC:', error);
  }
}

async function fetchDataFromPurpleAir30DaysUPC() {
  try {
    const startTimestamp = getMinusThirtyDaysEpochTime();
    const endTimestamp = getYesterdayEpochTime();
    const url = `https://api.purpleair.com/v1/sensors/${sensorindexupc}/history?start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}&average=1440&fields=pm2.5_alt`;
    const options = { headers };
    purpleAirData30DaysUPC = await fetchDataWithRetry(url, options);
    console.log('PurpleAir 30 dayUPC data fetched successfully');
  } catch (error) {
    console.error('Error fetching 30 data from PurpleAir API for UPC:', error);
  }
}

async function fetchDataFromPurpleAir30DaysHSC() {
  try {
    const startTimestamp = getMinusThirtyDaysEpochTime();
    const endTimestamp = getYesterdayEpochTime();
    const url = `https://api.purpleair.com/v1/sensors/${sensorindexhsc}/history?start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}&average=1440&fields=pm2.5_alt`;
    const options = { headers };
    purpleAirData30DaysHSC = await fetchDataWithRetry(url, options);
    console.log('PurpleAir 30 HSC data fetched successfully');
  } catch (error) {
    console.error('Error fetching 30 data from PurpleAir API for HSC:', error);
  }
}

async function fetchUpcomingWeatherUPC() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${upcLatitude}&longitude=${upcLongitude}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=ms&timeformat=unixtime&timezone=America%2FLos_Angeles`;
    upcomingWeatherUPC = await fetchDataWithRetry(url);
    console.log('upcoming weather data for UPC fetched successfully ');
  } catch (error) {
    console.error('Error fetching upcoming weather data from openmeteo API for UPC:', error);
  }
}

async function fetchUpcomingWeatherHSC() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${hscLatitude}&longitude=${hscLongitude}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=ms&timeformat=unixtime&timezone=America%2FLos_Angeles`;
    upcomingWeatherHSC = await fetchDataWithRetry(url);
    console.log('upcoming weather data for UPC fetched successfully ');
  } catch (error) {
    console.error('Error fetching upcoming weather data from openmeteo API for HSC:', error);
  }
}

async function fetchPastsevenDayWeatherUPC() {
  try {
    const fromDate = getMinusSevenDaysDateFromYesterday();
    const toDate = getYesterdayDate();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${upcLatitude}&longitude=${upcLongitude}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=ms&timeformat=unixtime&timezone=America%2FLos_Angeles&start_date=${fromDate}&end_date=${toDate}`;
    past7dayWeatherUPC = await fetchDataWithRetry(url);
    console.log('weather data for 7 days UPC fetched successfully ');
  } catch (error) {
    console.error('Error fetching 7 data from openmeteo API for UPC:', error);
  }
}


async function fetchPastsevenDayWeatherHSC() {
  try {
    const fromDate = getMinusSevenDaysDateFromYesterday();
    const toDate = getYesterdayDate();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${hscLatitude}&longitude=${hscLongitude}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=ms&timeformat=unixtime&timezone=America%2FLos_Angeles&start_date=${fromDate}&end_date=${toDate}`;
    past7dayWeatherHSC = await fetchDataWithRetry(url);
    console.log('weather data for 7 days UPC fetched successfully ');
  } catch (error) {
    console.error('Error fetching 7 data from openmeteo API for HSC:', error);
  }
}

async function fetchPastthirtyDayWeatherUPC() {
  try {
    const fromDate = getMinusThirtyDaysDateFromYesterday();
    const toDate = getYesterdayDate();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${upcLatitude}&longitude=${upcLongitude}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=ms&timeformat=unixtime&timezone=America%2FLos_Angeles&start_date=${fromDate}&end_date=${toDate}`;
    past30dayWeatherUPC = await fetchDataWithRetry(url);
    console.log('weather data for 30 days UPC fetched successfully ');
  } catch (error) {
    console.error('Error fetching 30 data from openmeteo API for UPC:', error);
  }
}


async function fetchPastthirtyDayWeatherHSC() {
  try {
    const fromDate = getMinusThirtyDaysDateFromYesterday();
    const toDate = getYesterdayDate();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${hscLatitude}&longitude=${hscLongitude}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=ms&timeformat=unixtime&timezone=America%2FLos_Angeles&start_date=${fromDate}&end_date=${toDate}`;
    past30dayWeatherHSC = await fetchDataWithRetry(url);
    console.log('weather data for 30 days UPC fetched successfully ');
  } catch (error) {
    console.error('Error fetching 30 data from openmeteo API for HSC:', error);
  }
}


// Fetch data initially when the server starts
async function initialDataFetch() {
  try {
    await fetchDataFromPurpleAirUPC();
    await fetchDataFromPurpleAirHSC();
    await fetchDataFromPurpleAir12HrUPC();
    await fetchDataFromPurpleAir12HrHSC();
    await fetchDataFromPurpleAir7DaysUPC();
    await fetchDataFromPurpleAir7DaysHSC();
    await fetchDataFromPurpleAir30DaysUPC();
    await fetchDataFromPurpleAir30DaysHSC();
    await fetchUpcomingWeatherUPC();
    await fetchUpcomingWeatherHSC();
    await fetchPastsevenDayWeatherUPC();
    await fetchPastsevenDayWeatherHSC();
    await fetchPastthirtyDayWeatherUPC();
    await fetchPastthirtyDayWeatherHSC();
  } catch (error) {
    console.error('Error fetching initial data:', error);
    process.exit(1); 
  }
}

// Chain the initial data fetch
initialDataFetch().then(() => {
  // Define routes to send PurpleAir data to the client
  app.get('/api/aqi/upc/currentaverage', async (req, res) => {
    try {
      res.json(purpleAirDataUPC);
    } catch (error) {
      console.error('Error sending data for UPC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/aqi/hsc/currentaverage', async (req, res) => {
    try {
      res.json(purpleAirDataHSC);
    } catch (error) {
      console.error('Error sending data for HSC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/aqi/hsc/twelvehraverage', async (req, res) => {
    try {
      res.json(purpleAirData12HrHSC);
    } catch (error) {
      console.error('Error sending 12 hour data for HSC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/aqi/upc/twelvehraverage', async (req, res) => {
    try {
      res.json(purpleAirData12HrUPC);
    } catch (error) {
      console.error('Error sending 12 hour data for UPC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/aqi/upc/sevendayaverage', async (req, res) => {
    try {
      res.json(purpleAirData7DaysUPC);
    } catch (error) {
      console.error('Error sending 7 Days data for UPC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/aqi/hsc/sevendayaverage', async (req, res) => {
    try {
      res.json(purpleAirData7DaysHSC);
    } catch (error) {
      console.error('Error sending 7 Days data for HSC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/aqi/upc/thirtydayaverage', async (req, res) => {
    try {
      res.json(purpleAirData30DaysUPC);
    } catch (error) {
      console.error('Error sending 30 Days data for UPC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/aqi/hsc/thirtydayaverage', async (req, res) => {
    try {
      res.json(purpleAirData30DaysHSC);
    } catch (error) {
      console.error('Error sending 30 Days data for HSC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/weather/upc/upcomingweather', async (req, res) => {
    try {
      res.json(upcomingWeatherUPC);
    } catch (error) {
      console.error('Error sending upcoming weather for UPC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/weather/hsc/upcomingweather', async (req, res) => {
    try {
      res.json(upcomingWeatherHSC);
    } catch (error) {
      console.error('Error sending upcoming weather for HSC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/weather/upc/pastsevendays', async (req, res) => {
    try {
      res.json(past7dayWeatherUPC);
    } catch (error) {
      console.error('Error sending past 7 day weather for UPC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/weather/hsc/pastsevendays', async (req, res) => {
    try {
      res.json(past7dayWeatherHSC);
    } catch (error) {
      console.error('Error sending past 7 day weather for UPC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/weather/upc/pastthirtydays', async (req, res) => {
    try {
      res.json(past30dayWeatherUPC);
    } catch (error) {
      console.error('Error sending past 30 day weather for UPC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.get('/api/weather/hsc/pastthirtydays', async (req, res) => {
    try {
      res.json(past30dayWeatherHSC);
    } catch (error) {
      console.error('Error sending past 30 day weather for HSC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  setInterval(fetchDataFromPurpleAirUPC, 10 * 60 * 1000); // 10 minutes in milliseconds
  setInterval(fetchDataFromPurpleAirHSC, 10 * 60 * 1000); // 10 minutes in milliseconds
  setInterval(fetchDataFromPurpleAir12HrUPC, 30 * 60 * 1000); // 20 minutes in milliseconds
  setInterval(fetchDataFromPurpleAir12HrHSC, 31 * 60 * 1000); // 21 minutes in milliseconds
  setInterval(fetchDataFromPurpleAir7DaysUPC, 60 * 60 * 1000); // 20 minutes in milliseconds
  setInterval(fetchDataFromPurpleAir7DaysHSC, 60 * 60 * 1000); // 21 minutes in milliseconds
  setInterval(fetchDataFromPurpleAir30DaysUPC, 30 * 60 * 1000); // 21 minutes in milliseconds
  setInterval(fetchDataFromPurpleAir30DaysHSC, 30 * 60 * 1000); // 21 minutes in milliseconds

}).catch(err => {
  console.error('Error in initial data fetch:', err);
  process.exit(1);
});
