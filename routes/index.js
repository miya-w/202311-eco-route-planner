var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
require('dotenv').config();
//const API_KEY = process.env.API_KEY;



const ROOT_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
// const TRANSIT_URL = 'https://maps.googleapis.com/maps/api/directions/json?'





router.get('/', function(req, res, next) {
    const start = req.query.start;
    const destination = req.query.destination;

    const fetchUrl = `${ROOT_URL}destinations=${destination}&origins=${start}?&units=metric&key=${API_KEY}`;
    const walkingFetchUrl = `${ROOT_URL}destinations=${destination}&origins=${start}?&units=metric&mode=walking&key=${API_KEY}`;
    const bikingFetchUrl = `${ROOT_URL}destinations=${destination}&origins=${start}?&units=metric&mode=bicycling&key=${API_KEY}`;
    const transitFetchUrl = `${ROOT_URL}destinations=${destination}&origins=${start}?&units=metric&mode=transit&key=${API_KEY}`;

    if (!start) return res.render('index', { mapData: null, walkingData: null, bikingData: null, transitData: null });

    Promise.all([fetch(fetchUrl), fetch(walkingFetchUrl), fetch(bikingFetchUrl), fetch(transitFetchUrl)])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(([mapData, walkingData, bikingData, transitData]) => {
            res.render('index', { mapData, walkingData, bikingData, transitData });
            console.log('Map Data:', mapData);
            console.log('Walking Data:', walkingData);
            console.log('Biking Data:', bikingData);
            console.log('Transit Data:', transitData);
            console.log('Distance Text:', mapData.rows[0].elements[0].distance.text);
            console.log('Duration Text:', mapData.rows[0].elements[0].duration.text);
            console.log('Distance Walking:', walkingData.rows[0].elements[0].distance.text);
            console.log('Duration Walking:', walkingData.rows[0].elements[0].duration.text);
            console.log('Distance Biking:', bikingData.rows[0].elements[0].distance.text);
            console.log('Duration Biking:', bikingData.rows[0].elements[0].duration.text);
            console.log('Distance Transit:', transitData.rows[0].elements[0].distance.text);
            console.log('Duration Transit:', transitData.rows[0].elements[0].duration.text);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.render('index', { mapData: null, walkingData: null, bikingData: null, transitData: null });
        });
});

module.exports = router;