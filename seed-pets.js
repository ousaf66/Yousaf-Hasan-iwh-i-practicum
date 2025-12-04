const axios = require('axios');
require('dotenv').config();

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_TOKEN;
const CUSTOM_OBJECT_ID = "2-53914689"; // your HubSpot custom object ID

// Sample pets
const pets = [
  { pet_name: "Fluffy", pet_type: "Cat" },
  { pet_name: "Buddy", pet_type: "Dog" },
  { pet_name: "Goldie", pet_type: "Fish" }
];

async function createPets() {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json"
  };

  for (const pet of pets) {
    try {
      await axios.post(url, { properties: pet }, { headers });
      console.log(`✅ Created pet: ${pet.pet_name}`);
    } catch (err) {
      console.error("❌ Error creating pet:", err.response?.data || err);
    }
  }
}

createPets();
