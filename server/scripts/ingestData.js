require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse');

const MediaBias = require('../models/MediaBias');
const SocialBias = require('../models/SocialBias');
const GenderBias = require('../models/GenderBias');

// Connect to MongoDB
mongoose.connect('mongodb+srv://harsheetamorey:2qqxOY7v2OOhWyIp@cluster0.8cs4pif.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function ingestMediaBiasData(filePath) {
  const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  await MediaBias.insertMany(records);
  console.log(`Ingested ${records.length} media bias records`);
}

async function ingestSocialBiasData(filePath) {
  const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  await SocialBias.insertMany(records);
  console.log(`Ingested ${records.length} social bias records`);
}

async function ingestGenderBiasData(filePath) {
  const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  await GenderBias.insertMany(records);
  console.log(`Ingested ${records.length} gender bias records`);
}

async function main() {
  try {
    // Clear existing data
    await Promise.all([
      MediaBias.deleteMany({}),
      SocialBias.deleteMany({}),
      GenderBias.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Ingest new data
    const dataDir = path.join(__dirname, '../../data');
    
    await ingestMediaBiasData(path.join(dataDir, 'annotation.json'));
    await ingestSocialBiasData(path.join(dataDir, 'social_bias.json'));
    await ingestGenderBiasData(path.join(dataDir, 'md_gender_bias.json'));

    console.log('Data ingestion completed');
    process.exit(0);
  } catch (error) {
    console.error('Error ingesting data:', error);
    process.exit(1);
  }
}

main(); 