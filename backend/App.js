const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const https = require('https');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let config = {
  withCredentials: true,
  baseURL: "https://test-p3-api-gw-public-113028295.ap-southeast-1.elb.amazonaws.com",
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
}
const axiosInstance = axios.create(config);

app.post('/v1/auth/login', async (req, res) => {
  const { user, password } = req.body;

  try {
    const response = await axiosInstance.post(`/v1/auth/login`, {
      password,
      user,
    });
    const token = response.data.token;
    res.status(201).json({
      status: 'success',
      token: token,
      data: response.data,
    });
  } catch (error) {
    res.status(401).json({ error });
  }
});

app.post('/v1/member/describe', async (req, res) => {
  const token = req.header('X-Auth-Token');
  if (!token) return res.status(401).json({ message: 'Access denied' });
  const { target } = req.body;

  try {
    const response = await axiosInstance.post('/v1/member/describe', {
      target,
    }, {
      headers: {
        'X-Auth-Token': token,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
    res.status(400).json({ message: 'Invalid token' });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
