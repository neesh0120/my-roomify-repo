/* eslint-disable */
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS allowlist
const allowedOrigins = [
  'http://localhost:3000',
  process.env.NEXT_PUBLIC_API_URL,
  process.env.FRONTEND_ORIGIN,
].filter(Boolean);
app.use(cors({ origin: (origin, cb) => {
  if (!origin) return cb(null, true);
  if (allowedOrigins.some((o) => origin.startsWith(o))) return cb(null, true);
  return cb(null, false);
} }));

// Basic rate limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use(limiter);
app.use(express.json({ limit: '20mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

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

  // Use a text-to-image model as a starter so it runs without needing an initial image
  // You can swap to an img2img model that accepts an input image once you have a suitable one.
  const model = process.env.REPLICATE_MODEL || 'black-forest-labs/flux-schnell';

  const numImages = 4;
  const designs = [];
  for (let i = 0; i < numImages; i += 1) {
    // Note: replicate.run returns an array of image URLs for most txt2img models
    // We keep this simple and assume the first output is the URL
    // For production, handle arrays/objects per model docs.
    // eslint-disable-next-line no-await-in-loop
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

app.post('/api/generate', async (req, res) => {
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
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Generation failed' });
  }
});

// In-memory store for projects and design states
/** @type {Array<{id:string,name:string,roomType:string|null,styles:string[],createdAt:string,designs:Array<{id:string,style:string,image:string,confidence:number,description:string,liked?:boolean,saved?:boolean}>}>} */
const projects = [];

app.get('/api/projects', (_req, res) => {
  res.json({ projects });
});

app.post('/api/projects', (req, res) => {
  const { name, roomType, styles, designs } = req.body || {};
  if (!Array.isArray(styles) || !Array.isArray(designs)) {
    return res.status(400).json({ error: 'styles and designs are required arrays' });
  }
  const id = `project-${Date.now()}`;
  const project = {
    id,
    name: name || 'AI Design Project',
    roomType: roomType || null,
    styles,
    createdAt: new Date().toISOString(),
    designs: designs.map((d) => ({ ...d, liked: false, saved: false })),
  };
  projects.unshift(project);
  res.json({ project });
});

app.post('/api/projects/:projectId/designs/:designId/like', (req, res) => {
  const { projectId, designId } = req.params;
  const project = projects.find((p) => p.id === projectId);
  if (!project) return res.status(404).json({ error: 'project not found' });
  const design = project.designs.find((d) => d.id === designId);
  if (!design) return res.status(404).json({ error: 'design not found' });
  design.liked = !design.liked;
  res.json({ liked: !!design.liked });
});

app.post('/api/projects/:projectId/designs/:designId/save', (req, res) => {
  const { projectId, designId } = req.params;
  const project = projects.find((p) => p.id === projectId);
  if (!project) return res.status(404).json({ error: 'project not found' });
  const design = project.designs.find((d) => d.id === designId);
  if (!design) return res.status(404).json({ error: 'design not found' });
  design.saved = !design.saved;
  res.json({ saved: !!design.saved });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`AI backend listening on http://localhost:${PORT}`);
});



