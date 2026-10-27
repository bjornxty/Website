const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const archiver = require('archiver');

const poolDir = path.join(__dirname, 'plugins', 'pool');
if (!fs.existsSync(poolDir)) {
  fs.mkdirSync(poolDir, { recursive: true });
}

const pluginsList = [
  { id: 'bjorn.character-counter', name: 'Character Counter', desc: 'Displays real-time character count while typing messages.', author: 'nexpid', icon: 'ChatIcon', file: 'charactercounter.js' },
  { id: 'bjorn.copy-bio', name: 'Copy Bio', desc: 'Allows copying a user\'s bio directly from their profile.', author: 'shipwr3ckd', icon: 'CopyIcon', file: 'copybio.js' },
  { id: 'bjorn.custom-voice-messages', name: 'Custom Voice Messages', desc: 'Customize and send voice messages with enhanced options.', author: 'shipwr3ckd', icon: 'MicrophoneIcon', file: 'customvoicemessages.js' },
  { id: 'bjorn.favorite-anything', name: 'Favorite Anything', desc: 'Allows favoriting emojis, stickers, and other media anywhere.', author: 'theunrealzaka', icon: 'HeartIcon', file: 'favoriteanything.js' },
  { id: 'bjorn.gestures-plus', name: 'Gestures+', desc: 'Adds customizable navigation and swipe gestures.', author: 'rksv', icon: 'MobileIcon', file: 'gesturesplus.js' },
  { id: 'bjorn.jump-to-top', name: 'Jump To Top', desc: 'Quickly scroll to the very top of a chat or channel.', author: 'tralwdwd', icon: 'ArrowUpIcon', file: 'jumptotop.js' },
  { id: 'bjorn.permission-viewer', name: 'Permission Viewer', desc: 'Inspect member permissions and role setups inside servers.', author: 'lvwmwm', icon: 'ShieldIcon', file: 'permissionviewer.js' },
  { id: 'bjorn.platform-indicators', name: 'Platform Indicators', desc: 'Shows icons for Desktop, Mobile, or Web on user avatars.', author: 'martinz64', icon: 'EyeIcon', file: 'platformindicators.js' },
  { id: 'bjorn.rich-presence', name: 'Rich Presence', desc: 'Customizable Discord Rich Presence status manager.', author: 'shipwr3ckd', icon: 'GameIcon', file: 'richpresence.js' },
  { id: 'bjorn.show-tags', name: 'Show Tags', desc: 'Display bot tags, server tags, and discriminators clearly.', author: 'cynosphere', icon: 'TagIcon', file: 'showtags.js' },
  { id: 'bjorn.silent-leave', name: 'Silent Leave', desc: 'Leave servers quietly without sending standard leave triggers.', author: 'il1ll', icon: 'DoorExitIcon', file: 'silentleave.js' },
  { id: 'bjorn.valid-user', name: 'Valid User', desc: 'Verifies accounts and highlights missing or abnormal profile flags.', author: 'fshinz', icon: 'CheckmarkIcon', file: 'validuser.js' }
];

function createZip(plugin) {
  return new Promise((resolve, reject) => {
    const zipName = `${plugin.id}@1.0.0.zip`;
    const zipPath = path.join(poolDir, zipName);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const data = fs.readFileSync(zipPath);
      const sha256 = crypto.createHash('sha256').update(data).digest('hex');
      resolve({ size: data.length, sha256, zipName });
    });

    archive.on('error', err => reject(err));
    archive.pipe(output);

    const innerManifest = {
      format: 1,
      id: plugin.id,
      name: plugin.name,
      description: plugin.desc,
      author: plugin.author,
      version: '1.0.0',
      main: 'index.js',
      dependencies: {
        'valenced.api': { version: '>=1 <2' },
        'discord': { version: '*' }
      }
    };

    archive.append(JSON.stringify(innerManifest, null, 2), { name: 'manifest.json' });

    const srcFile = path.join(__dirname, 'plugins', 'files', plugin.file);
    if (fs.existsSync(srcFile)) {
      archive.file(srcFile, { name: 'index.js' });
    } else {
      archive.append('export default { onLoad(){}, onUnload(){} };', { name: 'index.js' });
    }

    archive.finalize();
  });
}

async function main() {
  const manifest = {
    format: 1,
    name: 'BjornPlugs',
    description: "Bjorn's plugins for Valenced.",
    plugins: {}
  };

  for (const p of pluginsList) {
    const { size, sha256, zipName } = await createZip(p);
    manifest.plugins[p.id] = {
      name: p.name,
      description: p.desc,
      author: p.author,
      icon: p.icon,
      channels: { latest: '1.0.0' },
      versions: {
        '1.0.0': {
          url: `https://bjornon.top/plugins/pool/${zipName}`,
          sha256: sha256,
          size: size,
          dependencies: {
            'valenced.api': { version: '>=1 <2' },
            'discord': { version: '*' }
          }
        }
      }
    };
  }

  fs.writeFileSync(path.join(__dirname, 'plugins', 'index.json'), JSON.stringify(manifest, null, 2));
  console.log('Successfully generated all 12 plugin zips and updated index.json');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
