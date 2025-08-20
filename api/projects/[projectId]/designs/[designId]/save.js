// This would need a shared data store in production
// For now, this is a placeholder that returns success
module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // Mock toggle - in production you'd update the database
    const saved = Math.random() > 0.5;
    return res.json({ saved });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
