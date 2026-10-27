const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const poolDir = path.join(__dirname, 'plugins', 'pool');
const tempDir = path.join(__dirname, 'temp_build');

if (!fs.existsSync(poolDir)) {
  fs.mkdirSync(poolDir, { recursive: true });
}

// Burimet e sakta të gatshme nga degët 'builds' dhe distribucionet e autorëve
const pluginsList = [
  {
    id: 'bjorn.character-counter',
    name: 'Character Counter',
    desc: 'Displays real-time character count while typing messages.',
    author: 'nexpid',
    icon: 'ChatIcon',
    srcUrls: [
      'https://raw.githubusercontent.com/nexpid/VendettaPlugins/builds/plugins/CharacterCounter/index.js',
      'https://raw.githubusercontent.com/nexpid/VendettaPlugins/main/plugins/CharacterCounter/index.js'
    ]
  },
  {
    id: 'bjorn.copy-bio',
    name: 'Copy Bio',
    desc: 'Allows copying a user\'s bio directly from their profile.',
    author: 'shipwr3ckd',
    icon: 'CopyIcon',
    srcUrls: [
      'https://raw.githubusercontent.com/shipwr3ckd/VendettaPlugins/builds/plugins/CopyBio/index.js',
      'https://raw.githubusercontent.com/shipwr3ckd/VendettaPlugins/main/plugins/CopyBio/index.js'
    ]
  },
  {
    id: 'bjorn.custom-voice-messages',
    name: 'Custom Voice Messages',
    desc: 'Customize and send voice messages with enhanced options.',
    author: 'shipwr3ckd',
    icon: 'MicrophoneIcon',
    srcUrls: [
      'https://raw.githubusercontent.com/shipwr3ckd/VendettaPlugins/builds/plugins/CustomVoiceMessages/index.js',
      'https://raw.githubusercontent.com/shipwr3ckd/VendettaPlugins/main/plugins/CustomVoiceMessages/index.js'
    ]
  },
  {
    id: 'bjorn.favorite-anything',
    name: 'Favorite Anything',
    desc: 'Allows favoriting emojis, stickers, and other media anywhere.',
    author: 'theunrealzaka',
    icon: 'HeartIcon',
    srcUrls: [
      'https://raw.githubusercontent.com/theunrealzaka/vendetta-plugins/builds/plugins/FavoriteAnything/index.js',
      'https://raw.githubusercontent.com/theunrealzaka/vendetta-plugins/main/plugins/FavoriteAnything/index.js'
    ]
  },
  {
    id: 'bjorn.gestures-plus',
    name: 'Gestures+',
    desc: 'Adds customizable navigation and swipe gestures.',
    author: 'rksv',
    icon: 'MobileIcon',
    srcUrls: [
      'https://raw.githubusercontent.com/rksv/vendetta-plugins/builds/plugins/GesturesPlus/index.js',
      'https://raw.githubusercontent.com/rksv/vendetta-plugins/main/plugins/GesturesPlus/index.js'
    ]
  },
  {
    id: 'bjorn.jump-to-top',
    name: 'Jump To Top',
    desc: 'Quickly scroll to the very top of a chat or channel.',
    author: 'tralwdwd',
    icon: 'ArrowUpIcon',
    srcUrls: [
      'https://raw.githubusercontent.com/tralwdwd/vendetta-plugins/builds/plugins/JumpToTop/index.js',
      'https://raw.githubusercontent.com/tralwdwd/vendetta-plugins/main/plugins/JumpToTop/index.js'
    ]
  },
  {
    id: 'bjorn.permission-viewer',
    name: 'Permission Viewer',
    desc: 'Inspect member permissions and role setups inside servers.',
    author: 'lvwmwm',
    icon: 'ShieldIcon',
    srcUrls: [
      'https://raw.githubusercontent.com/lvwmwm/vendetta-plugins/builds/plugins/PermissionViewer/index.js',
      'https://raw.githubusercontent.com/lvwmwm/vendetta-plugins/main/plugins/PermissionViewer/index.js'
    ]
  },
  {
    id: 'bjorn.platform-indicators',
    name: 'Platform Indicators',
    desc: 'Shows icons for Desktop, Mobile, or Web on user avatars.',
    author: 'martinz64',
    icon: 'EyeIcon',
    srcUrls: [
      'https://raw.githubusercontent.com/martinz64/VendettaPlugins/builds/plugins/PlatformIndicators/index.js',
      'https://raw.githubusercontent.com/martinz64/VendettaPlugins/main/plugins/PlatformIndicators/index.js'
    ]
  },
  {
    id: 'bjorn.rich-presence',
    name: 'Rich Presence',
    desc: 'Customizable Discord Rich Presence status manager.',
    author: 'shipwr3ckd',
    icon: 'GameIcon',
    srcUrls: [
      'https://raw.githubusercontent.com/shipwr3ckd/VendettaPlugins/builds/plugins/RichPresence/index.js',
      'https://raw.githubusercontent.com/shipwr3ckd/VendettaPlugins/main/plugins/RichPresence/index.js'
    ]
  },
  {
    id: 'bjorn.show-tags',
    name: 'Show Tags',
    desc: 'Display bot tags, server tags, and discriminators clearly.',
    author: 'cynosphere',
    icon: 'TagIcon',
    srcUrls: [
      'https://raw.githubusercontent.com/cynosphere/vplugins/builds/plugins/ShowTags/index.js',
      'https://raw.githubusercontent.com/cynosphere/vplugins/main/plugins/ShowTags/index.js'
    ]
  },
  {
    id: 'bjorn.silent-leave',
    name: 'Silent Leave',
    desc: 'Leave servers quietly without sending standard leave triggers.',
    author: 'il1ll',
    icon: 'DoorExitIcon',
    srcUrls: [
      'https://raw.githubusercontent.com/il1ll/revenge-plugins/builds/plugins/silent-leave/index.js',
      'https://raw.githubusercontent.com/il1ll/revenge-plugins/main/plugins/silent-leave/index.js'
    ]
  },
  {
    id: 'bjorn.valid-user',
    name: 'Valid User',
    desc: 'Verifies accounts and highlights missing or abnormal profile flags.',
    author: 'fshinz',
    icon: 'CheckmarkIcon',
    srcUrls: [
      'https://raw.githubusercontent.com/fshinz/vendetta-plugins/builds/plugins/ValidUser/index.js',
      'https://raw.githubusercontent.com/fshinz/vendetta-plugins/main/plugins/ValidUser/index.js'
    ]
  }
];

function downloadPlugin(urls, dest) {
  for (const url of urls) {
    try {
      execSync(`curl -fsSL "${url}" -o "${dest}"`, { stdio: 'ignore' }); if (fs.existsSync(dest) && fs.statSync(dest).size > 300) { return true; } } catch { // vazhdon te url-ja tjetër } } return false; }  function createZip(plugin) { const zipName = `${plugin.id}@1.0.0.zip`;
  const zipPath = path.join(poolDir, zipName);
  const pluginBuildDir = path.join(tempDir, plugin.id);

  if (fs.existsSync(pluginBuildDir)) {
    fs.rmSync(pluginBuildDir, { recursive: true, force: true });
  }
  fs.mkdirSync(pluginBuildDir, { recursive: true });

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

  fs.writeFileSync(path.join(pluginBuildDir, 'manifest.json'), JSON.stringify(innerManifest, null, 2));

  const indexPath = path.join(pluginBuildDir, 'index.js');
  const ok = downloadPlugin(plugin.srcUrls, indexPath);

  if (!ok) {
    console.warn(`Paralajmërim: Nuk u shkarkua dot kodi nga burimet për ${plugin.name}`); const localFallback = path.join(__dirname, 'plugins', 'files', `${plugin.id.split('.')[1].replace(/-/g, '')}.js`);
    if (fs.existsSync(localFallback)) {
      fs.copyFileSync(localFallback, indexPath);
    } else {
      fs.writeFileSync(indexPath, 'export default { onLoad(){}, onUnload(){} };');
    }
  }

  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  execSync(`cd "${pluginBuildDir}" && zip -r -9 "${zipPath}" ./*`);

  const fileBuffer = fs.readFileSync(zipPath);
  const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  return { size: fileBuffer.length, sha256, zipName };
}

function main() {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  const manifest = {
    format: 1,
    name: 'BjornPlugs',
    description: "Bjorn's plugins for Valenced.",
    plugins: {}
  };

  for (const p of pluginsList) {
    const { size, sha256, zipName } = createZip(p);
    manifest.plugins[p.id] = {
      name: p.name,
      description: p.desc,
      author: p.author,
      icon: p.icon,
      channels: { latest: '1.0.0' },
      versions: {
        '1.0.0': {
          url: `
