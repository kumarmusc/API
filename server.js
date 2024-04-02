// Import necessary modules
const express = require('express');
const cors = require('cors');
const config = require('./config.json');
const { getLastHourStartTimeEpoch, getLastHourEndTimeEpoch, getYesterdayEpochTime, getMinusSevenDaysEpochTime, fetchDataWithRetry } = require('./timeUtils');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

const { apiKey, sensorindexupc, sensorindexhsc } = config;
const headers = {
  'X-API-Key': apiKey
};
let purpleAirDataUPC = null;
let purpleAirDataHSC = null;
let purpleAirData12HrUPC = null;
let purpleAirData12HrHSC = null;
let purpleAirData7DaysUPC = null;
let purpleAirData7DaysHSC = null;

async function fetchDataFromPurpleAirUPC() {
  try {
    const url = `https://map.purpleair.com/v1/sensors/${sensorindexupc}/?fields=pm2.5,pm2.5_10minute,pm2.5_30minute,pm2.5_60minute,pm2.5_6hour,pm2.5_24hour,pm2.5_1week,primary_id_a,primary_key_a,primary_id_b,primary_key_b,secondary_id_a,secondary_key_a,secondary_id_b,secondary_key_b,channel_flags_auto,channel_flags_manual,temperature_a,hardware,firmware_version,rssi,firmware_upgrade,firmware_version,pm2.5_10minute,pm2.5_30minute,pm2.5_60minute,pm2.5_6hour,pm2.5_24hour,pm2.5_1week`;
    const options = { headers };
    purpleAirDataUPC = await fetchDataWithRetry(url, options);
    console.log('PurpleAir 10Minute UPC data fetched successfully');
  } catch (error) {
    console.error('Error fetching data from PurpleAir API for UPC:', error);
  }
}

async function fetchDataFromPurpleAirHSC() {
  try {
    const url = `https://map.purpleair.com/v1/sensors/${sensorindexhsc}/?fields=pm2.5,pm2.5_10minute,pm2.5_30minute,pm2.5_60minute,pm2.5_6hour,pm2.5_24hour,pm2.5_1week,primary_id_a,primary_key_a,primary_id_b,primary_key_b,secondary_id_a,secondary_key_a,secondary_id_b,secondary_key_b,channel_flags_auto,channel_flags_manual,temperature_a,hardware,firmware_version,rssi,firmware_upgrade,firmware_version,pm2.5_10minute,pm2.5_30minute,pm2.5_60minute,pm2.5_6hour,pm2.5_24hour,pm2.5_1week`;
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
    const url = `https://map.purpleair.com/v1/sensors/${sensorindexupc}/history?start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}&average=60&fields=pm2.5_alt`;
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
    const url = `https://map.purpleair.com/v1/sensors/${sensorindexhsc}/history?start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}&average=60&fields=pm2.5_alt`;
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
    const url = `https://map.purpleair.com/v1/sensors/${sensorindexupc}/history?start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}&average=1440&fields=pm2.5_alt`;
    const options = { headers };
    purpleAirData7DaysUPC = await fetchDataWithRetry(url, options);
    console.log('PurpleAir 7days UPC data fetched successfully:');
  } catch (error) {
    console.error('Error fetching 7-day data from PurpleAir API for UPC:', error);
  }
}

async function fetchDataFromPurpleAir7DaysHSC() {
  try {
    const startTimestamp = getMinusSevenDaysEpochTime();
    const endTimestamp = getYesterdayEpochTime();
    const url = `https://map.purpleair.com/v1/sensors/${sensorindexhsc}/history?start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}&average=1440&fields=pm2.5_alt`;
    const options = { headers };
    purpleAirData7DaysHSC = await fetchDataWithRetry(url, options);
    console.log('PurpleAir 7-day HSC data fetched successfully');
  } catch (error) {
    console.error('Error fetching 7-day data from PurpleAir API for HSC:', error);
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
  } catch (error) {
    console.error('Error fetching initial data:', error);
    process.exit(1); // Exit the process with an error code
  }
}

// Chain the initial data fetch
initialDataFetch().then(() => {
  // Define routes to send PurpleAir data to the client
  app.get('/aqidata/upc', async (req, res) => {
    try {
      res.json(purpleAirDataUPC);
    } catch (error) {
      console.error('Error sending data for UPC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/aqidata/hsc', async (req, res) => {
    try {
      res.json(purpleAirDataHSC);
    } catch (error) {
      console.error('Error sending data for HSC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/aqidata/hsc12hr', async (req, res) => {
    try {
      res.json(purpleAirData12HrHSC);
    } catch (error) {
      console.error('Error sending 12-hour data for HSC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/aqidata/upc12hr', async (req, res) => {
    try {
      res.json(purpleAirData12HrUPC);
    } catch (error) {
      console.error('Error sending 12-hour data for UPC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/aqidata/upc7days', async (req, res) => {
    try {
      res.json(purpleAirData7DaysUPC);
    } catch (error) {
      console.error('Error sending 7-day data for UPC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/aqidata/hsc7days', async (req, res) => {
    try {
      res.json(purpleAirData7DaysHSC);
    } catch (error) {
      console.error('Error sending 7-day data for HSC:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Fetch data from PurpleAir every 10 minutes
  setInterval(fetchDataFromPurpleAirUPC, 1 * 60 * 1000); // 10 minutes in milliseconds
  setInterval(fetchDataFromPurpleAirHSC, 2 * 60 * 1000); // 10 minutes in milliseconds
  setInterval(fetchDataFromPurpleAir12HrUPC, 3 * 60 * 1000); // 20 minutes in milliseconds
  setInterval(fetchDataFromPurpleAir12HrHSC, 4 * 60 * 1000); // 21 minutes in milliseconds
}).catch(err => {
  console.error('Error in initial data fetch:', err);
  process.exit(1); // Exit the process with an error code
});
