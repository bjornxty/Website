const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const poolDir = path.join(__dirname, 'plugins', 'pool');
if (!fs.existsSync(poolDir)) {
  fs.mkdirSync(poolDir, { recursive: true });
}

const baseUrl = 'https://raw.githubusercontent.com/bleelblep/bleel-bazinga-repo/gh-pages';

function getPluginDetails(pluginFolder) {
  const infoUrl = `${baseUrl}/plugins/${pluginFolder}/plugin.json`;
  try {
    const raw = execSync(`curl -fsSL "${infoUrl}"`, { encoding: 'utf-8' });
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function fetchZip(pluginFolder, targetName) {
  const zipUrl = `${baseUrl}/plugins/${pluginFolder}/${pluginFolder}.zip`;
  const targetPath = path.join(poolDir, targetName);
  try {
    execSync(`curl -fsSL "${zipUrl}" -o "${targetPath}"`);
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 1000) {
      const fileBuffer = fs.readFileSync(targetPath);
      const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      return { size: fileBuffer.length, sha256 };
    }
  } catch (e) {}
  return null;
}

function main() {
  const manifest = {
    format: 1,
    name: 'BjornPlugs',
    description: "Bjorn's plugins for Valenced.",
    plugins: {}
  };

  const availablePlugins = [
    'CharacterCounter',
    'CopyBio',
    'CustomVoiceMessages',
    'FavoriteAnything',
    'GesturesPlus',
    'JumpToTop',
    'PermissionViewer',
    'PlatformIndicators',
    'RichPresence',
    'ShowTags',
    'SilentLeave',
    'ValidUser'
  ];

  for (const name of availablePlugins) {
    const id = `bjorn.${name.toLowerCase()}`;
    const zipName = `${id}@1.0.0.zip`;
    const res = fetchZip(name, zipName);

    if (res) {
      manifest.plugins[id] = {
        name: name,
        description: `Plugin ${name} for Valenced.`,
        author: 'bleelblep',
        icon: 'ExtensionIcon',
        channels: { latest: '1.0.0' },
        versions: {
          '1.0.0': {
            url: `https://bjornon.top/plugins/pool/${zipName}`,
            sha256: res.sha256,
            size: res.size,
            dependencies: {
              'valenced.api': { version: '>=1 <2' },
              'discord': { version: '*' }
            }
          }
        }
      };
    }
  }

  fs.writeFileSync(path.join(__dirname, 'plugins', 'index.json'), JSON.stringify(manifest, null, 2));
}

main();
