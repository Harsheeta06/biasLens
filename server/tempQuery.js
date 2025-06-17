const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const GenderBias = require('./models/GenderBias');
const SocialBias = require('./models/SocialBias');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to MongoDB for data check.');
    try {
      const genderBiasedTexts = await GenderBias.find({ biasType: { $in: ['stereotypical', 'anti-stereotypical'] } }).select('text biasType').limit(10);
      console.log('Found gender bias texts:', JSON.stringify(genderBiasedTexts, null, 2));

      const offensiveSocialBiasTexts = await SocialBias.find({ offensiveYN: { $exists: true, $ne: null } }).select('text offensiveYN').limit(10);
      console.log('Found offensive social bias texts:', JSON.stringify(offensiveSocialBiasTexts, null, 2));

    } catch (error) {
      console.error('Error querying data:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error for data check:', err);
  }); 