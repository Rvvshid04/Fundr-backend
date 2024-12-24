const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_ANON_KEY
);

app.use(cors()); //figure this out
app.use(bodyParser.json()); //and this

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ message: 'Something went wrong!' });
});

app.get('/', (req, res) => { //for testing
    res.send('Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});