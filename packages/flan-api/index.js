const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
let port = process.env.PORT || 5000;

//MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());

//IMPORT ROUTES
const golemRoute = require('./routes/golem');
app.use('/golem', golemRoute);

//ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to Flan API');
});

app.listen(port, () => {
    console.log(`Flan API is listening on port ${port}`);
});