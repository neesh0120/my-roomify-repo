const fs = require('fs');
const path = require('path');
const https = require('https');

const models = [
  {
    name: 'sofa.glb',
    url: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/sofa-02/model.gltf'
  },
  {
    name: 'table.glb',
    url: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/table-01/model.gltf'
  },
  {
    name: 'bed.glb',
    url: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/bed-01/model.gltf'
  },
  {
    name: 'desk.glb',
    url: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/desk-01/model.gltf'
  }
];

const downloadModel = (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close(() => {
        fs.unlink(filename, () => {
          reject(err.message);
        });
      });
    });
  });
};

async function downloadModels() {
  const modelsDir = path.join(__dirname, 'public', 'models');

  // Create models directory if it doesn't exist
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  for (const model of models) {
    const filename = path.join(modelsDir, model.name);
    console.log(`Downloading ${model.name}...`);
    try {
      await downloadModel(model.url, filename);
      console.log(`Downloaded ${model.name}`);
    } catch (error) {
      console.error(`Error downloading ${model.name}:`, error);
    }
  }
}

downloadModels().then(() => {
  console.log('All models downloaded successfully');
}).catch((error) => {
  console.error('Error downloading models:', error);
});
