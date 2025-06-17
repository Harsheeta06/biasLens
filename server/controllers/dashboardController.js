const Annotation = require('../models/Annotation');
const SocialBias = require('../models/SocialBias');
const GenderBias = require('../models/GenderBias');

// A basic list of English stop words to filter out
const stopWords = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn',
]);

exports.getPoliticalLeaningDistribution = async (req, res) => {
  try {
    const distribution = await Annotation.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);
    res.json(distribution);
  } catch (error) {
    console.error('Error fetching political leaning distribution:', error);
    res.status(500).json({ error: 'Failed to fetch political leaning data' });
  }
};

exports.getOffensivePhrases = async (req, res) => {
  try {
    const phrases = await SocialBias.find({ offensive: { $gt: '0' } })
      .sort({ offensive: -1 })
      .limit(10);
    res.json(phrases.map(p => ({ text: p.text, offensive: parseFloat(p.offensive) })));
  } catch (error) {
    console.error('Error fetching offensive phrases:', error);
    res.status(500).json({ error: 'Failed to fetch offensive phrases' });
  }
};

exports.getGenderBiasWordFrequency = async (req, res) => {
  try {
    // Structured bias terms data
    const biasTerms = [
      // High bias terms (top left)
      { term: "Rockstar engineer", type: "biased", biasScore: 1.0 },
      { term: "Manpower", type: "biased", biasScore: 0.95 },
      { term: "Chairman", type: "biased", biasScore: 0.92 },
      { term: "She's too emotional", type: "biased", biasScore: 0.9 },
      { term: "Working mom", type: "biased", biasScore: 0.88 },
      { term: "Bossy", type: "biased", biasScore: 0.86 },
      { term: "Gentlemen's agreement", type: "biased", biasScore: 0.84 },
      { term: "Man-made", type: "biased", biasScore: 0.82 },
      { term: "Feminine touch", type: "biased", biasScore: 0.8 },
      { term: "Grow a pair", type: "biased", biasScore: 0.78 },
      { term: "Career woman", type: "biased", biasScore: 0.75 },
      { term: "Lady doctor", type: "biased", biasScore: 0.72 },
      { term: "Man the station", type: "biased", biasScore: 0.7 },
      { term: "Girl boss", type: "biased", biasScore: 0.68 },
      { term: "Manning up", type: "biased", biasScore: 0.66 },
      { term: "Master bedroom", type: "biased", biasScore: 0.64 },
      { term: "Forefathers", type: "biased", biasScore: 0.62 },

      // Context-dependent terms (middle)
      { term: "Strong male lead", type: "mid", biasScore: 0.55 },
      { term: "Aggressive negotiator", type: "mid", biasScore: 0.52 },
      { term: "Girl genius", type: "mid", biasScore: 0.5 },
      { term: "Women in tech", type: "mid", biasScore: 0.48 },
      { term: "Male-dominated", type: "mid", biasScore: 0.45 },
      { term: "Motherly instincts", type: "mid", biasScore: 0.42 },
      { term: "Dad bod", type: "mid", biasScore: 0.4 },
      { term: "Tomboy", type: "mid", biasScore: 0.38 },
      { term: "Feminist rant", type: "mid", biasScore: 0.35 },
      { term: "Masculine energy", type: "mid", biasScore: 0.32 },

      // Neutral terms (top right)
      { term: "Team member", type: "neutral", biasScore: 0.1 },
      { term: "Chairperson", type: "neutral", biasScore: 0.1 },
      { term: "They", type: "neutral", biasScore: 0.08 },
      { term: "Human-powered", type: "neutral", biasScore: 0.08 },
      { term: "Leader", type: "neutral", biasScore: 0.07 },
      { term: "Parent", type: "neutral", biasScore: 0.07 },
      { term: "Colleague", type: "neutral", biasScore: 0.06 },
      { term: "Folks", type: "neutral", biasScore: 0.05 },
      { term: "Engineer", type: "neutral", biasScore: 0.04 },
      { term: "Person", type: "neutral", biasScore: 0.04 },
      { term: "Partner", type: "neutral", biasScore: 0.03 },
      { term: "Students", type: "neutral", biasScore: 0.03 },
      { term: "Inclusive", type: "neutral", biasScore: 0.02 },
      { term: "Team lead", type: "neutral", biasScore: 0.01 },
      { term: "Collaborator", type: "neutral", biasScore: 0.01 }
    ];

    res.json(biasTerms);
  } catch (error) {
    console.error('Error fetching gender bias word frequency:', error);
    res.status(500).json({ error: 'Failed to fetch gender bias word frequency' });
  }
};

exports.getBiasDistribution = async (req, res) => {
  try {
    const politicalBiasCount = await Annotation.countDocuments();
    const socialBiasCount = await SocialBias.countDocuments();
    const genderBiasCount = await GenderBias.countDocuments();

    const biasDistribution = [
      { type: 'Political Bias', count: politicalBiasCount },
      { type: 'Social Bias', count: socialBiasCount },
      { type: 'Gender Bias', count: genderBiasCount },
    ];

    res.json(biasDistribution);
  } catch (error) {
    console.error('Error fetching bias distribution:', error);
    res.status(500).json({ error: 'Failed to fetch bias distribution data' });
  }
}; 