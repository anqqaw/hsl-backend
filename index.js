
import express from 'express';
import axios from 'axios';

const app = express();
const api = process.env.APIKEY;

app.use(express.json());

app.post('/route', async (req, res) => {
  const { from, to } = req.body;
  const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'digitransit-subscription-key': api
    },
    data: JSON.stringify({
      query: `
        {
          plan(
            from: {lat: ${from.lat}, lon: ${from.lon}}
            to: {lat: ${to.lat}, lon: ${to.lon}}
            numItineraries: 3
          ) {
            itineraries {
              legs {
                startTime
                endTime
                mode
                duration
              }
            }
          }
        }
      `
    })
  };

  try {
    const response = await axios(url, options);
    res.json(response.data);
  } catch (e) {
    console.error('Error:', e);
    res.status(500).send('Server error');
  }
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
