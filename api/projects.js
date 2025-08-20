// In-memory store for projects and design states
/** @type {Array<{id:string,name:string,roomType:string|null,styles:string[],createdAt:string,designs:Array<{id:string,style:string,image:string,confidence:number,description:string,liked?:boolean,saved?:boolean}>}>} */
const projects = [];

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.json({ projects });
  }

  if (req.method === 'POST') {
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
    return res.json({ project });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
