const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5309;

const cities = [
  "Green Bay",
  "La Crosse",
  "Madison",
  "Milwaukee",
  "Sheboygan",
  "Wausau"
];

app.use(cors());

app.get("/", async (req, res) => {
  const data = [];
  await Promise.all(
    cities.map(async cityName => {
      const response = await fetch(
        `https://api.airvisual.com/v2/city?city=${cityName}&state=Wisconsin&country=USA&key=Sn7Rx3LEX7Fbu652e`
      );
      const { data: city } = await response.json();
      if (!city || !city.current || !city.current.pollution) {
        console.log("Couldn't parse response:", city);
        return;
      }
      data.push({
        name: city.city,
        forecastDate: city.current.pollution.ts,
        aqi: city.current.pollution.aqius
      });
    })
  );
  return res.json(data);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
