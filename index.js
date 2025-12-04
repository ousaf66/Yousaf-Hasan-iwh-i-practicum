const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Private App Token
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_TOKEN;

// HubSpot Custom Object ID
const CUSTOM_OBJECT_ID = "2-53914689"; // Replace with your custom object ID

// ------------------------------------------------------
// ROUTE 1 – Homepage: List all custom object records
// ------------------------------------------------------
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=pet_name,pet_type`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results || [];

        res.render('homepage', {
            title: "Homepage | Integrating With HubSpot I Practicum",
            data
        });

    } catch (err) {
        console.error("❌ Error fetching records:", err.response?.data || err);
        res.send("Error loading records. Check console for details.");
    }
});

// ------------------------------------------------------
// ROUTE 2 – Form page to create a new record
// ------------------------------------------------------
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
    });
});

// ------------------------------------------------------
// ROUTE 3 – Handle form submission to create a record
// ------------------------------------------------------
app.post('/update-cobj', async (req, res) => {
    const newRecord = {
        properties: {
            pet_name: req.body.pet_name,
            pet_type: req.body.pet_type
        }
    };

    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(url, newRecord, { headers });
        res.redirect('/');
    } catch (err) {
        console.error("❌ Error creating record:", err.response?.data || err);
        res.send("Error creating record. Check console for details.");
    }
});

// ------------------------------------------------------
// ROUTE 4 – Edit form page
// ------------------------------------------------------
app.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}/${id}?properties=pet_name,pet_type`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(url, { headers });
        const record = resp.data;

        res.render('edit', {
            title: "Edit Pet | Integrating With HubSpot I Practicum",
            record
        });
    } catch (err) {
        console.error("❌ Error loading record for edit:", err.response?.data || err);
        res.send("Error loading record for edit. Check console for details.");
    }
});

// ------------------------------------------------------
// ROUTE 5 – Save updates from edit form
// ------------------------------------------------------
app.post('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const updateObject = {
        properties: {
            pet_name: req.body.pet_name,
            pet_type: req.body.pet_type
        }
    };

    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}/${id}`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.patch(url, updateObject, { headers });
        res.redirect('/');
    } catch (err) {
        console.error("❌ Error updating record:", err.response?.data || err);
        res.send("Error updating record. Check console for details.");
    }
});

// ------------------------------------------------------
// ROUTE 6 – Delete record
// ------------------------------------------------------
app.post('/delete/:id', async (req, res) => {
    const id = req.params.id;
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}/${id}`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.delete(url, { headers });
        res.redirect('/');
    } catch (err) {
        console.error("❌ Error deleting record:", err.response?.data || err);
        res.send("Error deleting record. Check console for details.");
    }
});

// ------------------------------------------------------
// Start server
// ------------------------------------------------------
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
