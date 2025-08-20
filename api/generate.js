const cors = require('cors');

// Simple provider switch with a safe default (mock)
const SHOULD_USE_MOCK = process.env.USE_MOCK_AI === 'true' || !process.env.REPLICATE_API_TOKEN;

async function generateWithMock({ styles }) {
  const placeholders = [
    {
      id: 'design-1',
      style: styles[0] || 'Modern Minimalist',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      confidence: 95,
      description: 'Clean lines, neutral palette, functional furniture'
    },
    {
      id: 'design-2',
      style: styles[1] || 'Luxury Contemporary',
      image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
      confidence: 92,
      description: 'Rich textures, premium materials, elegant finishes'
    },
    {
      id: 'design-3',
      style: styles[2] || 'Boho Chic',
      image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      confidence: 88,
      description: 'Eclectic patterns, warm colors, natural textures'
    },
    {
      id: 'design-4',
      style: styles[3] || 'Scandinavian',
      image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
      confidence: 90,
      description: 'Light woods, cozy textiles, functional design'
    }
  ];
  return placeholders;
}

async function generateWithReplicate({ roomType, styles, image }) {
  // Lazy import to avoid requiring the package without a key
  const Replicate = require('replicate');
  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

  const promptBase = `High-quality interior render of a ${roomType || 'room'}. Styles: ${styles && styles.length ? styles.join(', ') : 'modern, minimalist'}. DSLR, global illumination, volumetric lighting, highly detailed, 8k.`;

  const model = process.env.REPLICATE_MODEL || 'black-forest-labs/flux-schnell';

  const numImages = 4;
  const designs = [];
  for (let i = 0; i < numImages; i += 1) {
    const output = await replicate.run(model, { input: { prompt: promptBase } });
    const imageUrl = Array.isArray(output) ? output[0] : output;
    designs.push({
      id: `design-${i + 1}`,
      style: styles[i] || styles[0] || 'AI Design',
      image: imageUrl,
      confidence: 85 + Math.floor(Math.random() * 10),
      description: 'AI generated concept based on your selections'
    });
  }
  return designs;
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, styles, roomType } = req.body || {};

    // Basic validation
    if (!styles || !Array.isArray(styles)) {
      return res.status(400).json({ error: 'styles must be an array' });
    }

    let designs;
    if (SHOULD_USE_MOCK) {
      designs = await generateWithMock({ roomType, styles, image });
    } else {
      designs = await generateWithReplicate({ roomType, styles, image });
    }

    res.json({ designs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Generation failed' });
  }
};
