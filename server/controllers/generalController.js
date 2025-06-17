const { GoogleGenerativeAI } = require('@google/generative-ai');
const GenderBias = require('../models/GenderBias');
const Annotation = require('../models/Annotation');
const SocialBias = require('../models/SocialBias');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeGeneralBias = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    let genderBiasExamples = [];
    try {
      genderBiasExamples = await GenderBias.aggregate([
        { $match: { biasType: 'stereotypical' } },
        { $sample: { size: 3 } }
      ]);
    } catch (dbError) {
      console.warn('Could not fetch gender bias examples from DB:', dbError.message);
    }

    let formattedExamples = '';
    if (genderBiasExamples.length > 0) {
      formattedExamples = '\n\nHere are some examples of gender-biased sentences from a dataset:\n';
      genderBiasExamples.forEach((example, index) => {
        formattedExamples += `\nExample ${index + 1}:\nOriginal Text: "${example.text}"\nBias Type: ${example.biasType}\n`;
      });
      formattedExamples += '\nGiven these examples, analyze the following text for gender bias and rewrite it to be inclusive.';
    }

    const prompt = `Analyze the following text for potential bias and suggest an inclusive rewrite. Focus on gender bias. ${formattedExamples}\n\nText: "${text}"\n\n**Please provide:**
1. Types of bias detected (e.g., gender)
2. Explanation of the bias (provide in bullet points, using hyphens)
3. A more inclusive rewrite (provide multiple options, if possible)
4. Confidence score (0-100, numerical value)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = await response.text();

    res.json({
      originalText: text,
      analysis: output,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in general bias analysis:', error);
    res.status(500).json({
      error: 'Failed to analyze text',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getPoliticalLeaningDistribution = async (req, res) => {
  try {
    const politicalBiasCount = await Annotation.countDocuments();
    res.json({ count: politicalBiasCount });
  } catch (error) {
    console.error('Error fetching political leaning distribution:', error);
    res.status(500).json({ error: 'Failed to fetch political leaning distribution data' });
  }
};

exports.analyzeDocument = async (req, res) => {
  try {
    const { documentText } = req.body;

    if (!documentText) {
      return res.status(400).json({ error: 'No document text provided' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let genderBiasExamples = [];
    try {
      genderBiasExamples = await GenderBias.aggregate([
        { $match: { biasType: 'stereotypical' } },
        { $sample: { size: 2 } } // Reduced size for document analysis to keep prompt concise
      ]);
    } catch (dbError) {
      console.warn('Could not fetch gender bias examples from DB:', dbError.message);
    }

    let socialBiasExamples = [];
    try {
      socialBiasExamples = await SocialBias.aggregate([
        { $match: { biasType: 'stereotypical' } },
        { $sample: { size: 2 } } // Reduced size for document analysis
      ]);
    } catch (dbError) {
      console.warn('Could not fetch social bias examples from DB:', dbError.message);
    }

    let annotationExamples = [];
    try {
      annotationExamples = await Annotation.aggregate([
        { $sample: { size: 2 } } // Sample annotations for political/general bias
      ]);
    } catch (dbError) {
      console.warn('Could not fetch annotation examples from DB:', dbError.message);
    }

    let formattedExamples = '';
    if (genderBiasExamples.length > 0) {
      formattedExamples += '\n\nHere are some examples of gender-biased sentences from a dataset:\n';
      genderBiasExamples.forEach((example, index) => {
        formattedExamples += `\nExample ${index + 1}:\nOriginal Text: "${example.text}"\nBias Type: ${example.biasType}\n`;
      });
    }

    if (socialBiasExamples.length > 0) {
      formattedExamples += '\n\nHere are some examples of social biases:\n';
      socialBiasExamples.forEach((example, index) => {
        formattedExamples += `\nExample ${index + 1}:\nOriginal Text: "${example.text}"\nBias Type: ${example.biasType}\n`;
      });
    }

    if (annotationExamples.length > 0) {
      formattedExamples += '\n\nHere are some examples of general text and their annotations:\n';
      annotationExamples.forEach((example, index) => {
        formattedExamples += `\nExample ${index + 1}:\nText: "${example.text}"\nAnnotation: ${example.annotation}\n`;
      });
    }

    const prompt = `Analyze the following document for potential biases (gender, social, political) and provide a comprehensive analysis. ${formattedExamples}\n\nDocument:\n${documentText}\n\n**Please provide:**
1. Types of bias detected (e.g., gender, racial, age, etc.)
2. Explanation of the bias (provide in bullet points, using hyphens)
3. Suggested neutral rewrite (if applicable, provide multiple options)
4. Confidence score (0-100, numerical value)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ analysis: text });
  } catch (error) {
    console.error('Error analyzing document with Gemini API:', error);
    res.status(500).json({ error: 'Failed to analyze document' });
  }
};