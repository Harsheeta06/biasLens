const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MediaBias = require('../models/MediaBias'); // Import the MediaBias model

exports.analyzeMediaBias = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Fetch a few random media bias examples to provide context to Gemini
    let mediaBiasExamples = [];
    try {
      mediaBiasExamples = await MediaBias.aggregate([
        { $match: { bias: { $ne: 'center' } } }, // Exclude center-biased examples for better contrast
        { $sample: { size: 3 } } // Get 3 random examples
      ]);
    } catch (dbError) {
      console.warn('Could not fetch media bias examples from DB:', dbError.message);
      // Continue without examples if DB access fails
    }

    let formattedExamples = '';
    if (mediaBiasExamples.length > 0) {
      formattedExamples = '\n\nHere are some examples of news text with media bias from a dataset:\n';
      mediaBiasExamples.forEach((example, index) => {
        formattedExamples += `\nExample ${index + 1}:\nOriginal Text: "${example.text}"\nPolitical Lean: ${example.bias}\n`;
      });
      formattedExamples += '\nGiven these examples, analyze the following text for media bias.';
    }

    const prompt = `Analyze the following news headline or article for media bias. Focus on political leaning, framing, selection, and omission. ${formattedExamples}

Text: "${text}"

Please provide:
1. Political leaning (left, center, right, or neutral)
2. Types of bias detected (e.g., framing, selection, omission, etc.)
3. Explanation of the bias
4. Suggested neutral rewrite
5. Confidence score (0-100)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = await response.text();

    res.json({
      originalText: text,
      analysis: output,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in media bias analysis:', error);
    res.status(500).json({
      error: 'Failed to analyze text',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 