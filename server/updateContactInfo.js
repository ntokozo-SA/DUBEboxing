const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

// Import the Settings model
const Settings = require('./models/Settings');

async function updateContactInfo() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find existing settings or create new ones
    let settings = await Settings.findOne();
    
    if (!settings) {
      console.log('No settings found, creating new settings...');
      settings = new Settings();
    }

    // Update contact information
    settings.contactInfo = {
      whatsapp: '+27 76 662 3761',
      email: 'info@dubeboxing.co.za',
      address: 'Mahalefele road, johannesburg, south africa 1801'
    };

    // Save the updated settings
    await settings.save();
    console.log('Contact information updated successfully!');
    console.log('New contact info:', settings.contactInfo);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error updating contact info:', error);
    process.exit(1);
  }
}

// Run the update
updateContactInfo(); 