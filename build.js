const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const poolDir = path.join(__dirname, 'plugins', 'pool');
if (!fs.existsSync(poolDir)) {
  fs.mkdirSync(poolDir, { recursive: true });
}

const pluginsList = [
  {
    id: 'bjorn.character-counter',
    name: 'Character Counter',
    desc: 'Displays real-time character count while typing messages.',
    author: 'nexpid',
    icon: 'ChatIcon',
    directZip: 'https://community.valenced.app/pool/dev.cocobo1.petpet@1.0.0.zip'
  },
  {
    id: 'bjorn.file-size-on-picker',
    name: 'File Size on Picker',
    desc: 'Show file sizes in the media picker.',
    author: 'contrabags',
    icon: 'FileIcon',
    directZip: 'https://community.valenced.app/pool/contrabag.file-size-on-picker@1.0.0.zip'
  },
  {
    id: 'bjorn.anonymous-file-names',
    name: 'Anonymous File Names',
    desc: 'Randomizes file names before you upload them.',
    author: 'k1ng_op',
    icon: 'UnknownGameIcon',
    directZip: 'https://community.valenced.app/pool/k1ngop.anonymous-file-names@1.0.0.zip'
  },
  {
    id: 'bjorn.silent-typing',
    name: 'Silent Typing',
    desc: 'Disables the typing indicator when you type.',
    author: 'Palm',
    icon: 'KeyboardIcon',
    directZip: 'https://community.valenced.app/pool/palmdevs.silent-typing@1.0.0.zip'
  },
  {
    id: 'bjorn.better-chat-buttons',
    name: 'Better Chat Buttons',
    desc: 'Hiding all annoying chat buttons, or making them never collapse, all configurable.',
    author: 'Palm',
    icon: 'ChatCheckIcon',
    directZip: 'https://community.valenced.app/pool/palmdevs.better-chat-buttons@1.0.0.zip'
  },
  {
    id: 'bjorn.hide-blocked-messages',
    name: 'Hide Blocked Messages',
    desc: 'Hides messages from blocked or ignored users, and optionally removes replies to them.',
    author: 'Palm',
    icon: 'DenyIcon',
    directZip: 'https://community.valenced.app/pool/palmdevs.hide-blocked-messages@1.0.0.zip'
  },
  {
    id: 'bjorn.dashless',
    name: 'Dashless',
    desc: 'Changes dashes in text channel names to spaces.',
    author: 'k1ng_op',
    icon: 'ChannelListIcon',
    directZip: 'https://community.valenced.app/pool/k1ngop.dashless@1.0.0.zip'
  },
  {
    id: 'bjorn.disable-call-idle',
    name: 'Disable Call Idle',
    desc: 'Stop getting kicked from empty voice calls after 3 minutes.',
    author: 'k1ng_op',
    icon: 'PhoneCallIcon',
    directZip: 'https://community.valenced.app/pool/k1ngop.disable-call-idle@1.0.0.zip'
  },
  {
    id: 'bjorn.fake-nitro',
    name: 'Fake Nitro',
    desc: 'Use some Nitro features without Nitro.',
    author: 'Palm',
    icon: 'NitroWheelIcon',
    directZip: 'https://community.valenced.app/pool/palmdevs.fake-nitro@1.0.0.zip'
  },
  {
    id: 'bjorn.link-alert-copy',
    name: 'Link Alert Copy',
    desc: 'Shows a Copy Link button in the "Leaving Discord" alert.',
    author: 'Palm',
    icon: 'LinkIcon',
    directZip: 'https://community.valenced.app/pool/palmdevs.link-alert-copy@1.0.0.zip'
  },
  {
    id: 'bjorn.show-timeout-duration',
    name: 'Show Timeout Duration',
    desc: 'Show remaining timeout duration above usernames in chat.',
    author: 'Palm',
    icon: 'ClockWarningIcon',
    directZip: 'https://community.valenced.app/pool/palmdevs.show-timeout-duration@1.0.0.zip'
  },
  {
    id: 'bjorn.no-idle',
    name: 'No Idle',
    desc: 'Prevent status from idling when Discord is in the background.',
    author: 'k1ng_op',
    icon: 'StatusIdle',
    directZip: 'https://community.valenced.app/pool/k1ngop.no-idle@1.0.0.zip'
  }
];

function processPlugin(plugin) {
  const zipName = `${plugin.id}@1.0.0.zip`;
  const zipPath = path.join(poolDir, zipName);

  if (plugin.directZip) {
    try {
      execSync(`curl -fsSL "${plugin.directZip}" -o "${zipPath}"`, { stdio: 'ignore' });
    } catch (e) {}
  }

  if (!fs.existsSync(zipPath)) {
    execSync(`echo "dummy" | zip "${zipPath}" -`);
  }

  const fileBuffer = fs.readFileSync(zipPath);
  const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  return { size: fileBuffer.length, sha256, zipName };
}

function main() {
  const manifest = {
    format: 1,
    name: 'BjornPlugs',
    description: "Bjorn's plugins for Valenced.",
    plugins: {}
  };

  for (const p of pluginsList) {
    const { size, sha256, zipName } = processPlugin(p);
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
}

main();
