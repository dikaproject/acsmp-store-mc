const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@minecraft.com' },
    update: {},
    create: {
      email: 'admin@minecraft.com',
      password: hashedPassword,
      name: 'Admin Server',
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin user created:', admin.email);

  const serverRPG = await prisma.serverType.upsert({
    where: { name: 'RPG' },
    update: {},
    create: {
      name: 'RPG',
      description: 'Server RPG dengan sistem leveling, quest, dan skill. Petualangan epik menanti!',
      imageUrl: '/uploads/servers/rpg.png',
      isActive: true
    }
  });

  const serverMIX = await prisma.serverType.upsert({
    where: { name: 'MIX' },
    update: {},
    create: {
      name: 'MIX',
      description: 'Server campuran dengan berbagai mode permainan. Survival, Creative, dan lainnya!',
      imageUrl: '/uploads/servers/mix.png',
      isActive: true
    }
  });

  const serverSkyblock = await prisma.serverType.upsert({
    where: { name: 'Skyblock' },
    update: {},
    create: {
      name: 'Skyblock',
      description: 'Bertahan hidup di pulau terapung dengan resource terbatas!',
      imageUrl: '/uploads/servers/skyblock.png',
      isActive: true
    }
  });

  console.log('✅ Server types created:', serverRPG.name, serverMIX.name, serverSkyblock.name);

  const coinProducts = [
    // MIX Server Coins
    { name: '100 Coins', description: '100 Coins untuk berbagai keperluan dalam game. Cocok untuk pemula yang baru mulai!', type: 'COIN', price: 10000, amount: 100, groupName: null, serverTypeId: serverMIX.id, imageUrl: '/uploads/products/coin-100.png' },
    { name: '500 Coins', description: '500 Coins - Paket hemat! Bonus 10% coins. Pilihan terpopuler untuk player aktif.', type: 'COIN', price: 45000, amount: 500, groupName: null, serverTypeId: serverMIX.id, imageUrl: '/uploads/products/coin-500.png' },
    { name: '1000 Coins', description: '1000 Coins - Best deal! Bonus 25% coins. Investasi terbaik untuk progress cepat!', type: 'COIN', price: 80000, amount: 1000, groupName: null, serverTypeId: serverMIX.id, imageUrl: '/uploads/products/coin-1000.png' },
    { name: '2500 Coins', description: '2500 Coins - Mega pack! Bonus 30% coins. Untuk player hardcore yang serius!', type: 'COIN', price: 175000, amount: 2500, groupName: null, serverTypeId: serverMIX.id, imageUrl: '/uploads/products/coin-2500.png' },
    { name: '5000 Coins', description: '5000 Coins - Ultimate pack! Bonus 40% coins + Exclusive title "Whale". Value terbaik!', type: 'COIN', price: 300000, amount: 5000, groupName: null, serverTypeId: serverMIX.id, imageUrl: '/uploads/products/coin-5000.png' },
    
    // RPG Server Coins
    { name: '150 Coins RPG', description: '150 Coins khusus server RPG. Cukup untuk membeli starter equipment!', type: 'COIN', price: 15000, amount: 150, groupName: null, serverTypeId: serverRPG.id, imageUrl: '/uploads/products/coin-rpg-150.png' },
    { name: '350 Coins RPG', description: '350 Coins RPG - Paket populer! Bonus 10%. Cocok untuk upgrade skill tree.', type: 'COIN', price: 30000, amount: 350, groupName: null, serverTypeId: serverRPG.id, imageUrl: '/uploads/products/coin-rpg-350.png' },
    { name: '800 Coins RPG', description: '800 Coins RPG - Best value! Bonus 20%. Untuk grinding upgrade equipment ke +10!', type: 'COIN', price: 65000, amount: 800, groupName: null, serverTypeId: serverRPG.id, imageUrl: '/uploads/products/coin-rpg-800.png' },
    { name: '2000 Coins RPG', description: '2000 Coins RPG - Mega deal! Bonus 35%. Full equipment upgrade + skill book legendary!', type: 'COIN', price: 150000, amount: 2000, groupName: null, serverTypeId: serverRPG.id, imageUrl: '/uploads/products/coin-rpg-2000.png' },
    
    // Skyblock Server Coins
    { name: '200 Coins Skyblock', description: '200 Coins Skyblock untuk mempercepat progress island kamu!', type: 'COIN', price: 18000, amount: 200, groupName: null, serverTypeId: serverSkyblock.id, imageUrl: '/uploads/products/coin-sb-200.png' },
    { name: '500 Coins Skyblock', description: '500 Coins Skyblock - Paket hemat! Bonus 15%. Cocok untuk expand island.', type: 'COIN', price: 40000, amount: 500, groupName: null, serverTypeId: serverSkyblock.id, imageUrl: '/uploads/products/coin-sb-500.png' },
    { name: '1200 Coins Skyblock', description: '1200 Coins Skyblock - Best deal! Bonus 25%. Beli spawner & automation tools!', type: 'COIN', price: 85000, amount: 1200, groupName: null, serverTypeId: serverSkyblock.id, imageUrl: '/uploads/products/coin-sb-1200.png' },
    { name: '3000 Coins Skyblock', description: '3000 Coins Skyblock - Ultimate! Bonus 40%. Island tier MAX + premium decorations!', type: 'COIN', price: 200000, amount: 3000, groupName: null, serverTypeId: serverSkyblock.id, imageUrl: '/uploads/products/coin-sb-3000.png' }
  ];

  for (const coin of coinProducts) {
    await prisma.product.create({ data: coin });
  }
  console.log('✅ Coin products created');

  const rankProducts = [
    // VIP Rank - Server MIX
    { name: 'VIP Rank', description: 'Rank VIP dengan berbagai benefit menarik! Dapatkan prefix [VIP], akses command /fly, /heal, dan 5 homes.', type: 'RANK', price: 50000, amount: 30, groupName: 'vip', serverTypeId: serverMIX.id, imageUrl: '/uploads/products/rank-vip.png' },
    
    // VIP+ Rank - Server MIX
    { name: 'VIP+ Rank', description: 'Rank VIP+ dengan lebih banyak keuntungan! Prefix [VIP+], /fly, /heal, /feed, /speed, 10 homes, dan akses VIP area.', type: 'RANK', price: 85000, amount: 30, groupName: 'vip+', serverTypeId: serverMIX.id, imageUrl: '/uploads/products/rank-vip-plus.png' },
    
    // MVP Rank - Server MIX
    { name: 'MVP Rank', description: 'Rank MVP - The best choice! Prefix [MVP] dengan warna gradasi, semua command VIP+, /back, /tpa, 20 homes, dan kit MVP weekly!', type: 'RANK', price: 125000, amount: 30, groupName: 'mvp', serverTypeId: serverMIX.id, imageUrl: '/uploads/products/rank-mvp.png' },
    
    // MVP+ Rank - Server MIX
    { name: 'MVP+ Rank', description: 'Rank MVP+ - Ultimate power! Prefix [MVP+] animated, semua command, /god mode, 50 homes, custom join message, dan bonus 1000 coins!', type: 'RANK', price: 200000, amount: 30, groupName: 'mvp+', serverTypeId: serverMIX.id, imageUrl: '/uploads/products/rank-mvp-plus.png' },
    
    // Warrior Rank - Server RPG
    { name: 'Warrior Rank', description: 'Rank Warrior khusus RPG! Prefix [⚔️ Warrior], +10% damage boost, +5% drop rate, dan akses dungeon tier 2!', type: 'RANK', price: 60000, amount: 30, groupName: 'warrior', serverTypeId: serverRPG.id, imageUrl: '/uploads/products/rank-warrior.png' },
    
    // Knight Rank - Server RPG
    { name: 'Knight Rank', description: 'Rank Knight - Elite fighter! Prefix [🛡️ Knight], +20% damage, +15% defense, +10% drop rate, free skill reset weekly, dungeon tier 3!', type: 'RANK', price: 100000, amount: 30, groupName: 'knight', serverTypeId: serverRPG.id, imageUrl: '/uploads/products/rank-knight.png' },
    
    // Paladin Rank - Server RPG
    { name: 'Paladin Rank', description: 'Rank Paladin - Legendary hero! Prefix [⭐ Paladin] animated, +35% damage, +25% defense, +20% drop rate, exclusive pet, all dungeons!', type: 'RANK', price: 175000, amount: 30, groupName: 'paladin', serverTypeId: serverRPG.id, imageUrl: '/uploads/products/rank-paladin.png' },
    
    // Builder Rank - Server Skyblock
    { name: 'Builder Rank', description: 'Rank Builder untuk Skyblock! Prefix [🏗️ Builder], +5 island size, 3x spawner slots, dan WorldEdit tools basic!', type: 'RANK', price: 55000, amount: 30, groupName: 'builder', serverTypeId: serverSkyblock.id, imageUrl: '/uploads/products/rank-builder.png' },
    
    // Architect Rank - Server Skyblock
    { name: 'Architect Rank', description: 'Rank Architect - Master builder! Prefix [🏛️ Architect], +10 island size, 6x spawner slots, WorldEdit full, dan custom island biome!', type: 'RANK', price: 95000, amount: 30, groupName: 'architect', serverTypeId: serverSkyblock.id, imageUrl: '/uploads/products/rank-architect.png' },
    
    // Creator Rank - Server Skyblock
    { name: 'Creator Rank', description: 'Rank Creator - God of building! Prefix [✨ Creator] animated, +20 island size, unlimited spawners, WorldEdit + VoxelSniper, exclusive blocks!', type: 'RANK', price: 165000, amount: 30, groupName: 'creator', serverTypeId: serverSkyblock.id, imageUrl: '/uploads/products/rank-creator.png' }
  ];

  for (const rank of rankProducts) {
    await prisma.product.create({ data: rank });
  }
  console.log('✅ Rank products created');

  const galleries = [
    // Spawn Area
    { title: 'Spawn Utama - Hub Area', description: 'Area spawn dengan desain modern dan futuristik. Dilengkapi dengan hologram informasi, NPC helper, dan portal ke berbagai world!', imageUrl: '/uploads/gallery/spawn-hub.png', order: 1, isActive: true },
    { title: 'Lobby Modern 2024', description: 'Lobby dengan arsitektur contemporary design. Menampilkan waterfall, custom lighting, dan server selector yang interaktif!', imageUrl: '/uploads/gallery/lobby-modern.png', order: 2, isActive: true },
    
    // PVP Areas
    { title: 'Arena PVP - Colosseum', description: 'Arena PVP bergaya colosseum romawi dengan berbagai mode pertandingan: 1v1, 2v2, FFA, dan Capture The Flag!', imageUrl: '/uploads/gallery/pvp-arena.png', order: 3, isActive: true },
    { title: 'Warzone - Battlefield', description: 'Area perang dengan bunker, trench warfare, dan berbagai tactical points. Perfect untuk clan wars!', imageUrl: '/uploads/gallery/warzone.png', order: 4, isActive: true },
    
    // RPG Areas
    { title: 'RPG Town - Eldoria City', description: 'Kota utama di server RPG dengan NPCs, quest givers, shops, dan guild headquarters!', imageUrl: '/uploads/gallery/rpg-town.png', order: 5, isActive: true },
    { title: 'Dungeon - Dark Catacombs', description: 'Dungeon tier 3 dengan monster kuat, trap mechanism, dan chest berisi loot legendary!', imageUrl: '/uploads/gallery/dungeon-dark.png', order: 6, isActive: true },
    { title: 'Raid Boss - Dragon Lair', description: 'Arena raid boss melawan Naga Api! Butuh team 10-15 player untuk menang. Drop guaranteed mythic items!', imageUrl: '/uploads/gallery/boss-dragon.png', order: 7, isActive: true },
    
    // Skyblock Areas
    { title: 'Skyblock Island - Beginner', description: 'Contoh island untuk pemula dengan farm automation, mob grinder, dan crop field yang efficient!', imageUrl: '/uploads/gallery/skyblock-starter.png', order: 8, isActive: true },
    { title: 'Skyblock Island - Advanced', description: 'Island tingkat lanjut dengan spawner farm, villager trading hall, dan custom biome decorations!', imageUrl: '/uploads/gallery/skyblock-advanced.png', order: 9, isActive: true },
    { title: 'Skyblock Top Island #1', description: 'Island pemenang kompetisi minggu lalu! Menampilkan mega-mansion, pixel arts, dan automation extreme!', imageUrl: '/uploads/gallery/skyblock-top1.png', order: 10, isActive: true },
    
    // Event Areas
    { title: 'Event Area - Central Plaza', description: 'Area khusus untuk event mingguan: Drop Party, Trivia, Building Contest, dan banyak lagi!', imageUrl: '/uploads/gallery/event-plaza.png', order: 11, isActive: true },
    { title: 'Parkour Challenge - Extreme', description: 'Parkour map dengan 100+ checkpoints! Selesaikan untuk dapatkan exclusive title dan rewards!', imageUrl: '/uploads/gallery/parkour-extreme.png', order: 12, isActive: true },
    
    // Creative Builds
    { title: 'Medieval Castle', description: 'Build player showcase: Medieval castle dengan interior detail, throne room, dan knight barracks!', imageUrl: '/uploads/gallery/build-castle.png', order: 13, isActive: true },
    { title: 'Japanese Temple', description: 'Player build: Japanese temple bergaya traditional dengan zen garden, koi pond, dan cherry blossom!', imageUrl: '/uploads/gallery/build-temple.png', order: 14, isActive: true },
    { title: 'Futuristic City', description: 'Collaboration build: Kota futuristic dengan skyscrapers, flying cars, neon lights, dan monorail system!', imageUrl: '/uploads/gallery/build-future-city.png', order: 15, isActive: true },
    
    // Community Events
    { title: 'Wedding Ceremony 2024', description: 'Event pernikahan in-game pertama di server! Complete dengan kapel, decorasi, dan fireworks!', imageUrl: '/uploads/gallery/wedding-event.png', order: 16, isActive: true },
    { title: 'Halloween Event 2023', description: 'Throwback ke Halloween event kemarin! Haunted mansion, trick or treat, dan costume contest!', imageUrl: '/uploads/gallery/halloween-2023.png', order: 17, isActive: true },
    { title: 'Christmas Event 2023', description: 'Christmas celebration dengan Santa\'s workshop, gift exchange, snowball fight, dan Christmas tree lighting!', imageUrl: '/uploads/gallery/christmas-2023.png', order: 18, isActive: true }
  ];

  for (const gallery of galleries) {
    await prisma.gallery.create({ data: gallery });
  }
  console.log('✅ Gallery created');

  const guides = [
    {
      title: 'Cara Join Server SSSMC',
      slug: 'cara-join-server',
      content: `<h1>Cara Join Server SSSMC</h1>
<p>Selamat datang! Panduan ini akan membantu kamu untuk join ke server SSSMC dengan mudah dan cepat.</p>

<h2>Persyaratan:</h2>
<ul>
  <li>Minecraft Bedrock Edition (Android, iOS, Windows 10/11, Xbox, PlayStation, Nintendo Switch)</li>
  <li>Koneksi internet yang stabil</li>
  <li>Versi Minecraft terbaru (minimal 1.19+)</li>
</ul>

<h2>Langkah-langkah Join Server:</h2>
<ol>
  <li><strong>Buka Minecraft Bedrock Edition</strong> di device kamu</li>
  <li>Klik tombol <strong>"Play"</strong> di menu utama</li>
  <li>Pilih tab <strong>"Servers"</strong></li>
  <li>Scroll ke bawah dan klik <strong>"Add Server"</strong></li>
  <li>Masukkan informasi server:
    <ul>
      <li>Server Name: <code>SSSMC Network</code></li>
      <li>Server Address: <code>play.sssmc.com</code></li>
      <li>Port: <code>19132</code></li>
    </ul>
  </li>
  <li>Klik tombol <strong>"Save"</strong></li>
  <li>Server akan muncul di daftar server kamu</li>
  <li>Klik server SSSMC dan tunggu loading</li>
  <li>Selamat bermain! 🎮</li>
</ol>

<h2>Troubleshooting:</h2>
<h3>❌ "Unable to connect to world"</h3>
<ul>
  <li>Pastikan koneksi internet stabil</li>
  <li>Coba restart Minecraft</li>
  <li>Periksa apakah server sedang maintenance</li>
</ul>

<h3>❌ "Outdated client/server"</h3>
<ul>
  <li>Update Minecraft ke versi terbaru</li>
  <li>Cek di Play Store/App Store untuk update</li>
</ul>

<h3>❌ Lag atau connection timeout</h3>
<ul>
  <li>Tutup aplikasi lain yang menggunakan internet</li>
  <li>Gunakan koneksi WiFi yang stabil</li>
  <li>Restart device kamu</li>
</ul>

<h2>Tips & Trik:</h2>
<div style="background-color: #10b98120; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
  <strong>💡 Pro Tip:</strong> Simpan server ke favorites agar mudah diakses. Klik icon bintang di samping nama server!
</div>

<p>Jika masih mengalami masalah, silakan hubungi support kami di Discord atau WhatsApp.</p>`,
      imageUrl: '/uploads/guides/join-server.png',
      order: 1,
      isActive: true
    },
    {
      title: 'Command Dasar Server',
      slug: 'command-dasar',
      content: `<h1>Command Dasar Server SSSMC</h1>
<p>Pelajari command-command penting yang akan membantu permainan kamu di SSSMC!</p>

<h2>📍 Command Teleportasi</h2>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <thead style="background-color: #10b98120;">
    <tr>
      <th style="padding: 10px; text-align: left; border: 1px solid #374151;">Command</th>
      <th style="padding: 10px; text-align: left; border: 1px solid #374151;">Fungsi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><code>/spawn</code></td>
      <td style="padding: 10px; border: 1px solid #374151;">Teleport ke spawn area</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><code>/home</code></td>
      <td style="padding: 10px; border: 1px solid #374151;">Teleport ke home yang sudah di-set</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><code>/sethome [nama]</code></td>
      <td style="padding: 10px; border: 1px solid #374151;">Set lokasi saat ini sebagai home</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><code>/delhome [nama]</code></td>
      <td style="padding: 10px; border: 1px solid #374151;">Hapus home point</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><code>/tpa [player]</code></td>
      <td style="padding: 10px; border: 1px solid #374151;">Request teleport ke player lain</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><code>/tpaccept</code></td>
      <td style="padding: 10px; border: 1px solid #374151;">Terima request teleport</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><code>/tpdeny</code></td>
      <td style="padding: 10px; border: 1px solid #374151;">Tolak request teleport</td>
    </tr>
  </tbody>
</table>

<h2>💰 Command Economy</h2>
<ul>
  <li><code>/bal</code> - Cek balance coins kamu</li>
  <li><code>/baltop</code> - Lihat top 10 pemain terkaya</li>
  <li><code>/pay [player] [amount]</code> - Transfer coins ke player lain</li>
  <li><code>/shop</code> - Buka server shop (jika tersedia)</li>
</ul>

<h2>⚔️ Command RPG Mode</h2>
<ul>
  <li><code>/stats</code> - Lihat statistik karakter (level, HP, MP, STR, DEX, INT)</li>
  <li><code>/quest</code> - Buka quest log dan lihat quest yang tersedia</li>
  <li><code>/quest accept [id]</code> - Accept quest tertentu</li>
  <li><code>/party create</code> - Buat party baru</li>
  <li><code>/party invite [player]</code> - Invite player ke party</li>
  <li><code>/party leave</code> - Keluar dari party</li>
  <li><code>/skills</code> - Buka skill tree dan upgrade skill</li>
  <li><code>/class info</code> - Lihat info detail class kamu</li>
</ul>

<h2>👥 Command Social</h2>
<ul>
  <li><code>/msg [player] [pesan]</code> - Kirim private message</li>
  <li><code>/r [pesan]</code> - Reply ke pesan terakhir</li>
  <li><code>/ignore [player]</code> - Block player dari chat</li>
  <li><code>/friend add [player]</code> - Tambah friend</li>
  <li><code>/friend list</code> - Lihat daftar friend</li>
</ul>

<h2>👑 Command Rank (Khusus VIP)</h2>
<div style="background-color: #6366f120; padding: 15px; border-radius: 8px; margin: 15px 0;">
  <h3 style="margin-top: 0;">VIP Rank</h3>
  <ul>
    <li><code>/kit vip</code> - Claim VIP kit (cooldown 24 jam)</li>
    <li><code>/nick [name]</code> - Ganti nickname dengan warna</li>
  </ul>
  
  <h3>VIP+ Rank</h3>
  <ul>
    <li><code>/kit vipplus</code> - Claim VIP+ kit (cooldown 24 jam)</li>
    <li><code>/fly</code> - Toggle fly mode di spawn/lobby</li>
    <li><code>/feed</code> - Isi hunger bar (cooldown 5 menit)</li>
  </ul>
  
  <h3>MVP Rank</h3>
  <ul>
    <li><code>/kit mvp</code> - Claim MVP kit (cooldown 24 jam)</li>
    <li><code>/fly</code> - Fly di semua area (kecuali PVP)</li>
    <li><code>/heal</code> - Full heal HP (cooldown 3 menit)</li>
    <li><code>/feed</code> - Isi hunger bar (no cooldown)</li>
    <li><code>/hat</code> - Pakai item di tangan sebagai hat</li>
  </ul>
</div>

<h2>⚙️ Command Lainnya</h2>
<ul>
  <li><code>/help</code> - Lihat daftar command</li>
  <li><code>/rules</code> - Baca aturan server</li>
  <li><code>/discord</code> - Dapatkan link Discord server</li>
  <li><code>/vote</code> - Vote server untuk reward</li>
  <li><code>/report [player] [alasan]</code> - Report player yang melanggar</li>
</ul>

<div style="background-color: #ef444420; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444;">
  <strong>⚠️ Peringatan:</strong> Jangan spam command atau abuse command. Pelanggaran dapat menyebabkan ban!
</div>`,
      imageUrl: '/uploads/guides/commands.png',
      order: 2,
      isActive: true
    },
    {
      title: 'Panduan RPG Mode Lengkap',
      slug: 'panduan-rpg-lengkap',
      content: `<h1>Panduan RPG Mode Lengkap</h1>
<p>Server RPG adalah mode permainan dengan sistem leveling, skill, quest, dan dungeon. Ikuti panduan ini untuk menjadi hero terkuat!</p>

<h2>🎮 Getting Started</h2>
<ol>
  <li><strong>Pilih Class</strong> - Saat pertama join, kamu akan diminta memilih class:
    <ul>
      <li><strong>Warrior:</strong> High HP, strong melee damage, tank role</li>
      <li><strong>Mage:</strong> High magic damage, AoE spells, support role</li>
      <li><strong>Archer:</strong> High critical rate, ranged damage, DPS role</li>
      <li><strong>Assassin:</strong> Stealth ability, burst damage, critical hits</li>
    </ul>
  </li>
  <li><strong>Complete Tutorial Quest</strong> - Ikuti quest tutorial untuk mendapat starter pack</li>
  <li><strong>Start Leveling</strong> - Hunting monster untuk gain XP dan level up</li>
</ol>

<h2>📊 Sistem Leveling</h2>
<ul>
  <li><strong>Max Level:</strong> 100</li>
  <li><strong>XP Sources:</strong> Monster hunting, quest completion, dungeon, PvP</li>
  <li><strong>Stat Points:</strong> +5 stat points setiap level up</li>
  <li><strong>Skill Points:</strong> +1 skill point setiap level up</li>
  <li><strong>Skill Unlock:</strong> Skill baru unlock setiap 5/10/15 level</li>
</ul>

<h3>📈 Stat Attributes</h3>
<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
  <thead style="background-color: #10b98120;">
    <tr>
      <th style="padding: 10px; border: 1px solid #374151;">Stat</th>
      <th style="padding: 10px; border: 1px solid #374151;">Effect</th>
      <th style="padding: 10px; border: 1px solid #374151;">Recommended For</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><strong>STR (Strength)</strong></td>
      <td style="padding: 10px; border: 1px solid #374151;">+Physical damage, +HP</td>
      <td style="padding: 10px; border: 1px solid #374151;">Warrior, Assassin</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><strong>DEX (Dexterity)</strong></td>
      <td style="padding: 10px; border: 1px solid #374151;">+Critical rate, +Attack speed</td>
      <td style="padding: 10px; border: 1px solid #374151;">Archer, Assassin</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><strong>INT (Intelligence)</strong></td>
      <td style="padding: 10px; border: 1px solid #374151;">+Magic damage, +MP</td>
      <td style="padding: 10px; border: 1px solid #374151;">Mage</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><strong>VIT (Vitality)</strong></td>
      <td style="padding: 10px; border: 1px solid #374151;">+Max HP, +HP regen</td>
      <td style="padding: 10px; border: 1px solid #374151;">Warrior</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><strong>LUK (Luck)</strong></td>
      <td style="padding: 10px; border: 1px solid #374151;">+Drop rate, +Critical damage</td>
      <td style="padding: 10px; border: 1px solid #374151;">All classes</td>
    </tr>
  </tbody>
</table>

<h2>⚔️ Combat System</h2>
<h3>Skill Tree</h3>
<p>Setiap class memiliki 3 skill tree path:</p>
<ul>
  <li><strong>Path 1:</strong> Offensive - Fokus damage output</li>
  <li><strong>Path 2:</strong> Defensive - Fokus survivability</li>
  <li><strong>Path 3:</strong> Utility - Fokus support & buff</li>
</ul>

<h3>Combo System</h3>
<p>Gunakan skill secara berurutan untuk trigger combo bonus:</p>
<ul>
  <li>3 Hit Combo: +10% damage</li>
  <li>5 Hit Combo: +20% damage + stun chance</li>
  <li>7 Hit Combo: +35% damage + critical boost</li>
</ul>

<h2>🏰 Dungeon System</h2>
<h3>Dungeon Types:</h3>
<ol>
  <li><strong>Solo Dungeon</strong> - Level 10+, masuk sendiri</li>
  <li><strong>Party Dungeon</strong> - Level 20+, butuh 3-5 player</li>
  <li><strong>Raid Dungeon</strong> - Level 40+, butuh 10+ player</li>
  <li><strong>Hell Dungeon</strong> - Level 70+, extreme difficulty</li>
</ol>

<h3>Dungeon Rewards:</h3>
<ul>
  <li>Rare Equipment (Purple/Orange tier)</li>
  <li>Skill Books</li>
  <li>Crafting Materials</li>
  <li>Dungeon Coins (exchange di NPC)</li>
  <li>Achievement points</li>
</ul>

<div style="background-color: #f59e0b20; padding: 15px; border-radius: 8px; margin: 15px 0;">
  <strong>💡 Pro Tips:</strong>
  <ul>
    <li>Join party untuk <strong>+50% XP bonus</strong></li>
    <li>Complete daily quest untuk <strong>guaranteed rare items</strong></li>
    <li>Upgrade equipment di <strong>Blacksmith NPC</strong> di spawn</li>
    <li>Save coins untuk membeli <strong>skill books</strong> (sangat penting!)</li>
    <li>Farm di <strong>grinding spots</strong> yang sesuai level</li>
  </ul>
</div>

<h2>🛡️ Equipment System</h2>
<h3>Equipment Rarity:</h3>
<ul>
  <li><span style="color: #9ca3af;">⚪ Common</span> - Drop dari monster biasa</li>
  <li><span style="color: #10b981;">🟢 Uncommon</span> - Drop dari elite monster</li>
  <li><span style="color: #3b82f6;">🔵 Rare</span> - Drop dari boss/dungeon</li>
  <li><span style="color: #a855f7;">🟣 Epic</span> - Drop dari raid boss</li>
  <li><span style="color: #f59e0b;">🟠 Legendary</span> - Craft/event reward</li>
</ul>

<h3>Upgrade & Enchant:</h3>
<ul>
  <li><strong>Upgrade:</strong> +1 sampai +15, setiap level tambah stats</li>
  <li><strong>Enchant:</strong> Tambah bonus attribute (crit, speed, dll)</li>
  <li><strong>Socket:</strong> Insert gems untuk bonus stats</li>
</ul>

<h2>📋 Quest System</h2>
<h3>Quest Types:</h3>
<ul>
  <li><strong>Main Quest:</strong> Story quest, unlock new areas</li>
  <li><strong>Side Quest:</strong> Optional quest, bonus rewards</li>
  <li><strong>Daily Quest:</strong> Reset setiap hari, guaranteed rewards</li>
  <li><strong>Weekly Quest:</strong> Harder quest, better rewards</li>
  <li><strong>Achievement Quest:</strong> Long-term goals, titles & cosmetics</li>
</ul>

<div style="background-color: #ef444420; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444;">
  <strong>⚠️ Important:</strong> Jangan lupa claim quest rewards! Check <code>/quest</code> regularly.
</div>`,
      imageUrl: '/uploads/guides/rpg.png',
      order: 3,
      isActive: true
    },
    {
      title: 'Cara Membeli Rank & Coins',
      slug: 'cara-membeli-rank-coins',
      content: `<h1>Cara Membeli Rank & Coins</h1>
<p>Panduan lengkap untuk membeli rank dan coins di SSSMC dengan mudah dan aman.</p>

<h2>🛒 Langkah-langkah Pembelian</h2>

<h3>1. Akses Website Shop</h3>
<p>Kunjungi website resmi SSSMC: <strong>shop.sssmc.com</strong></p>

<h3>2. Pilih Server Type</h3>
<p>Pilih server yang ingin kamu beli (RPG / MIX / Skyblock)</p>
<img src="/uploads/guides/shop-server-select.png" alt="Select Server" style="max-width: 100%; border-radius: 8px; margin: 15px 0;">

<h3>3. Browse Produk</h3>
<ul>
  <li>Lihat kategori <strong>Coins</strong> atau <strong>Ranks</strong></li>
  <li>Baca deskripsi setiap produk</li>
  <li>Bandingkan harga dan benefit</li>
  <li>Klik tombol <strong>"Tambah ke Keranjang"</strong></li>
</ul>

<h3>4. Checkout</h3>
<ol>
  <li>Klik icon keranjang di navbar</li>
  <li>Review items yang akan dibeli</li>
  <li>Klik <strong>"Checkout"</strong></li>
</ol>

<h3>5. Isi Data Pembelian</h3>
<p>Lengkapi form berikut:</p>
<ul>
  <li><strong>Minecraft Name:</strong> Nametag/username Minecraft kamu (CASE SENSITIVE!)</li>
  <li><strong>Email:</strong> Email valid untuk konfirmasi order</li>
  <li><strong>WhatsApp:</strong> Nomor WA untuk notifikasi (format: 08xxx)</li>
  <li><strong>Server Type:</strong> Otomatis terisi</li>
</ul>

<div style="background-color: #ef444420; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 15px 0;">
  <strong>⚠️ PENTING:</strong> Pastikan nametag Minecraft yang diisi <strong>benar dan CASE SENSITIVE</strong>. Salah tulis = item tidak masuk!
</div>

<h3>6. Pilih Metode Pembayaran</h3>
<p>Pilih salah satu metode pembayaran yang tersedia:</p>

<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
  <thead style="background-color: #10b98120;">
    <tr>
      <th style="padding: 10px; border: 1px solid #374151;">Metode</th>
      <th style="padding: 10px; border: 1px solid #374151;">Deskripsi</th>
      <th style="padding: 10px; border: 1px solid #374151;">Proses</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><strong>QRIS</strong></td>
      <td style="padding: 10px; border: 1px solid #374151;">Semua e-wallet (GoPay, OVO, Dana, ShopeePay, LinkAja)</td>
      <td style="padding: 10px; border: 1px solid #374151;">Instant</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><strong>Virtual Account</strong></td>
      <td style="padding: 10px; border: 1px solid #374151;">BCA, Mandiri, BNI, BRI, Permata, CIMB</td>
      <td style="padding: 10px; border: 1px solid #374151;">1-5 menit</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;"><strong>Convenience Store</strong></td>
      <td style="padding: 10px; border: 1px solid #374151;">Alfamart, Indomaret</td>
      <td style="padding: 10px; border: 1px solid #374151;">5-10 menit</td>
    </tr>
  </tbody>
</table>

<h3>7. Lakukan Pembayaran</h3>

<h4>Untuk QRIS:</h4>
<ol>
  <li>Scan QR Code yang muncul</li>
  <li>Buka aplikasi e-wallet kamu</li>
  <li>Confirm pembayaran</li>
  <li>Screenshot bukti pembayaran (opsional)</li>
</ol>

<h4>Untuk Virtual Account:</h4>
<ol>
  <li>Copy nomor Virtual Account</li>
  <li>Buka mobile banking</li>
  <li>Pilih Transfer > Virtual Account/Biller</li>
  <li>Input nomor VA</li>
  <li>Confirm & input PIN</li>
</ol>

<h4>Untuk Convenience Store:</h4>
<ol>
  <li>Tunjukkan kode payment ke kasir</li>
  <li>Kasir akan scan barcode</li>
  <li>Bayar sejumlah yang tertera</li>
  <li>Simpan struk sebagai bukti</li>
</ol>

<h3>8. Konfirmasi Otomatis</h3>
<p>Setelah pembayaran berhasil:</p>
<ul>
  <li>✅ Sistem akan otomatis detect dalam <strong>1-5 menit</strong></li>
  <li>📧 Kamu akan dapat <strong>email konfirmasi</strong></li>
  <li>📱 Notifikasi WhatsApp (jika nomor valid)</li>
  <li>🎮 Item otomatis masuk ke akun Minecraft</li>
</ul>

<h3>9. Cek Item Masuk</h3>
<p>Login ke server dan cek:</p>
<ul>
  <li>Untuk <strong>Coins:</strong> Ketik <code>/bal</code> atau <code>/money</code></li>
  <li>Untuk <strong>Rank:</strong> Prefix akan otomatis muncul di chat</li>
  <li>Untuk <strong>Items:</strong> Cek inventory atau mailbox</li>
</ul>

<h2>💳 Info Pembayaran</h2>

<h3>Biaya Admin:</h3>
<ul>
  <li>QRIS: <strong>Rp 0</strong> (gratis!)</li>
  <li>Virtual Account: <strong>Rp 3.000 - 5.000</strong></li>
  <li>Convenience Store: <strong>Rp 2.500</strong></li>
</ul>

<h3>Batas Waktu Pembayaran:</h3>
<ul>
  <li>QRIS: <strong>1 jam</strong></li>
  <li>Virtual Account: <strong>24 jam</strong></li>
  <li>Convenience Store: <strong>24 jam</strong></li>
</ul>

<div style="background-color: #10b98120; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 15px 0;">
  <strong>💡 Tips Hemat:</strong>
  <ul>
    <li>Beli paket bundle untuk dapat <strong>bonus coins</strong></li>
    <li>Follow Instagram & Discord untuk <strong>promo code</strong></li>
    <li>Rank permanent lebih hemat daripada beli berkali-kali</li>
    <li>Gunakan QRIS untuk <strong>no admin fee</strong></li>
  </ul>
</div>

<h2>🔍 Tracking Pesanan</h2>
<p>Kamu bisa track status pesanan di halaman <strong>"Lacak Pesanan"</strong>:</p>
<ol>
  <li>Klik menu <strong>"Lacak Pesanan"</strong></li>
  <li>Input <strong>Order Code</strong> yang dikirim via email</li>
  <li>Klik <strong>"Lacak"</strong></li>
  <li>Lihat status real-time pesanan kamu</li>
</ol>

<h3>Status Pesanan:</h3>
<ul>
  <li>🟡 <strong>PENDING:</strong> Menunggu pembayaran</li>
  <li>🔵 <strong>PAID:</strong> Pembayaran berhasil, sedang diproses</li>
  <li>🟣 <strong>PROCESSING:</strong> Item sedang dikirim ke server</li>
  <li>🟢 <strong>COMPLETED:</strong> Selesai, item sudah masuk</li>
  <li>🔴 <strong>FAILED:</strong> Pembayaran gagal</li>
  <li>⚫ <strong>EXPIRED:</strong> Waktu pembayaran habis</li>
</ul>

<h2>❓ FAQ</h2>

<h3>Q: Berapa lama proses setelah bayar?</h3>
<p><strong>A:</strong> Otomatis 1-5 menit. Jika lebih dari 10 menit, hubungi support.</p>

<h3>Q: Bisa refund jika salah beli?</h3>
<p><strong>A:</strong> Tidak bisa refund. Pastikan pilih produk dengan benar!</p>

<h3>Q: Rank permanent atau sementara?</h3>
<p><strong>A:</strong> Permanent! Selamanya selama server aktif.</p>

<h3>Q: Bisa transfer coins ke player lain?</h3>
<p><strong>A:</strong> Bisa! Gunakan command <code>/pay [player] [amount]</code></p>

<h3>Q: Item tidak masuk, kenapa?</h3>
<p><strong>A:</strong> Kemungkinan:</p>
<ul>
  <li>Nametag salah/typo (cek email konfirmasi)</li>
  <li>Belum login ke server yang benar</li>
  <li>Server sedang lag/restart</li>
  <li>Hubungi support dengan bukti pembayaran</li>
</ul>

<h2>📞 Kontak Support</h2>
<p>Jika ada kendala atau pertanyaan:</p>
<ul>
  <li><strong>WhatsApp Admin:</strong> +62 812-3456-7890</li>
  <li><strong>Discord:</strong> discord.gg/sssmc</li>
  <li><strong>Email:</strong> support@sssmc.com</li>
</ul>

<div style="background-color: #6366f120; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
  <h3 style="margin-top: 0;">🎉 Selamat Berbelanja!</h3>
  <p>Terima kasih sudah support SSSMC. Happy gaming! 🎮</p>
</div>`,
      imageUrl: '/uploads/guides/shop.png',
      order: 4,
      isActive: true
    },
    {
      title: 'Peraturan & Aturan Server',
      slug: 'rules-server',
      content: `<h1>Peraturan & Aturan Server SSSMC</h1>
<p>Harap baca dan pahami peraturan berikut. Pelanggaran dapat mengakibatkan <strong>mute, kick, atau ban permanent</strong>.</p>

<h2>⚖️ Aturan Umum</h2>
<ol>
  <li><strong>Dilarang Cheat/Hack</strong>
    <ul>
      <li>Fly hack, kill aura, x-ray, speed hack</li>
      <li>Auto clicker (lebih dari 20 CPS)</li>
      <li>Exploit bug untuk keuntungan</li>
      <li><em>Sanksi: Permanent ban + IP ban</em></li>
    </ul>
  </li>
  
  <li><strong>Dilarang Toxic/Spam</strong>
    <ul>
      <li>Chat spam, caps lock berlebihan</li>
      <li>Toxic, hinaan, SARA, pornografi</li>
      <li>Advertising server lain</li>
      <li><em>Sanksi: Mute 1 jam - 1 minggu, bisa permanent</em></li>
    </ul>
  </li>
  
  <li><strong>Dilarang Scam</strong>
    <ul>
      <li>Menipu player lain (jual-beli, trade)</li>
      <li>Fake giveaway/lottery</li>
      <li>Impersonate staff/admin</li>
      <li><em>Sanksi: Ban 7-30 hari atau permanent</em></li>
    </ul>
  </li>
  
  <li><strong>Respect Staff & Player</strong>
    <ul>
      <li>Hormati keputusan staff</li>
      <li>Jangan spam mention staff</li>
      <li>Jangan berantem di public chat</li>
      <li><em>Sanksi: Warning - mute - ban</em></li>
    </ul>
  </li>
  
  <li><strong>Dilarang Griefing</strong>
    <ul>
      <li>Rusak bangunan player lain (kecuali di area PVP)</li>
      <li>Steal dari chest yang tidak diklaim</li>
      <li>Trap player ke void/lava</li>
      <li><em>Sanksi: Ban 3-14 hari</em></li>
    </ul>
  </li>
</ol>

<div style="background-color: #ef444420; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
  <strong>⚠️ Penting:</strong> "Tidak tahu aturan" bukan alasan untuk lepas dari sanksi. Ignorance is not an excuse!
</div>

<h2>🛡️ Aturan PVP</h2>
<ul>
  <li>PVP hanya diperbolehkan di <strong>PVP Arena</strong> dan <strong>Warzone</strong></li>
  <li>Dilarang kill player di safe zone / spawn area</li>
  <li>Dilarang TP trap (ajak TP lalu kill)</li>
  <li>Dilarang camp spawn point di dungeon</li>
  <li>Combat log (logout saat PVP) = kehilangan item</li>
</ul>

<h2>💼 Aturan Economy & Trading</h2>
<ul>
  <li>Harga jual-beli bebas (kesepakatan antar player)</li>
  <li>Gunakan <code>/trade</code> untuk trade aman</li>
  <li>Dilarang RMT (real money trading) di luar website resmi</li>
  <li>Report jika ada player scam</li>
</ul>

<h2>🏠 Aturan Land Claim</h2>
<ul>
  <li>Claim land kamu dengan <code>/claim</code></li>
  <li>Maksimal claim sesuai rank (Regular: 3, VIP: 10, VIP+: 20, MVP: unlimited)</li>
  <li>Bangunan yang tidak diklaim bukan tanggung jawab server</li>
  <li>Inactive claim (30+ hari) akan di-reset</li>
</ul>

<h2>📢 Aturan Chat</h2>
<ul>
  <li>Gunakan bahasa Indonesia atau English</li>
  <li>Dilarang spam emoji/sticker berlebihan</li>
  <li>Trade/jual-beli gunakan <code>/ch trade</code></li>
  <li>Help/pertanyaan gunakan <code>/ch help</code></li>
  <li>Global chat untuk obrolan umum</li>
</ul>

<h2>🎁 Aturan Event</h2>
<ul>
  <li>Dilarang sabotase event player lain</li>
  <li>Keputusan host event adalah final</li>
  <li>Fake event (event palsu) akan di-ban</li>
  <li>Event resmi akan ada announcement dari staff</li>
</ul>

<div style="background-color: #10b98120; padding: 15px; border-radius: 8px; margin: 20px 0;">
  <h3>✅ Tips Bermain Aman</h3>
  <ul>
    <li>Selalu claim land kamu</li>
    <li>Gunakan password untuk chest penting</li>
    <li>Trade hanya dengan player trusted</li>
    <li>Screenshot evidence jika ada masalah</li>
    <li>Report player bermasalah ke staff</li>
  </ul>
</div>

<h2>📞 Cara Report Pelanggaran</h2>
<ol>
  <li>In-game: <code>/report [player] [alasan]</code></li>
  <li>Discord: Buat ticket di #support</li>
  <li>Screenshot/video evidence (sangat membantu)</li>
  <li>Jangan main hakim sendiri (jangan balas toxic dengan toxic)</li>
</ol>

<p style="text-align: center; margin-top: 30px;">
  <strong>Terima kasih telah mematuhi peraturan. Let's keep SSSMC fun and fair for everyone! 🎮</strong>
</p>`,
      imageUrl: '/uploads/guides/rules.png',
      order: 5,
      isActive: true
    },
    {
      title: 'Tips & Trik Pro Player',
      slug: 'tips-pro-player',
      content: `<h1>Tips & Trik Pro Player SSSMC</h1>
<p>Kumpulan tips dari pro player untuk level up dengan cepat dan efisien!</p>

<h2>⚡ Leveling Tips</h2>
<h3>Level 1-20: Newbie Phase</h3>
<ul>
  <li>✅ Complete semua tutorial quest</li>
  <li>✅ Farm di <strong>Beginner Forest</strong> (spawn rate tinggi)</li>
  <li>✅ Join party untuk <strong>+50% XP bonus</strong></li>
  <li>✅ Collect daily login reward</li>
  <li>✅ Jangan skip NPC dialog (ada hidden tips!)</li>
</ul>

<h3>Level 20-50: Intermediate Phase</h3>
<ul>
  <li>✅ Unlock <strong>Mount</strong> untuk movement speed</li>
  <li>✅ Farm di <strong>Desert Temple</strong> atau <strong>Dark Cave</strong></li>
  <li>✅ Start doing <strong>Party Dungeon</strong> (better XP/loot)</li>
  <li>✅ Invest stat points dengan bijak</li>
  <li>✅ Join guild untuk guild buffs</li>
</ul>

<h3>Level 50-80: Advanced Phase</h3>
<ul>
  <li>✅ Farm di <strong>Ancient Ruins</strong> (high XP mobs)</li>
  <li>✅ Complete <strong>Weekly Quest</strong> untuk rare items</li>
  <li>✅ Start raiding for <strong>Legendary equipment</strong></li>
  <li>✅ Participate dalam <strong>World Boss</strong> events</li>
  <li>✅ Max out 1-2 skill trees sebelum branch out</li>
</ul>

<h3>Level 80-100: End Game</h3>
<ul>
  <li>✅ Farm <strong>Hell Dungeon</strong> untuk BiS (Best in Slot) items</li>
  <li>✅ Participate dalam <strong>Guild War</strong></li>
  <li>✅ Complete <strong>Achievement</strong> untuk titles</li>
  <li>✅ Help newbies untuk <strong>mentor rewards</strong></li>
</ul>

<h2>💰 Money Making Guide</h2>
<h3>🥉 Budget Methods (0-50k coins/day)</h3>
<ul>
  <li><strong>Farming mobs:</strong> Collect drops & sell ke NPC</li>
  <li><strong>Mining:</strong> Mine ores & sell ke players</li>
  <li><strong>Fishing:</strong> AFK-friendly, sell rare fish</li>
  <li><strong>Daily quest:</strong> Guaranteed coins reward</li>
</ul>

<h3>🥈 Medium Methods (50k-200k coins/day)</h3>
<ul>
  <li><strong>Dungeon farming:</strong> Rare drops sell untuk high price</li>
  <li><strong>Crafting:</strong> Beli materials, craft, sell dengan profit</li>
  <li><strong>Flipping:</strong> Beli murah, jual mahal</li>
  <li><strong>Boss hunting:</strong> Group boss untuk split loot</li>
</ul>

<h3>🥇 Pro Methods (200k+ coins/day)</h3>
<ul>
  <li><strong>Raid farming:</strong> Legendary drops worth millions</li>
  <li><strong>Market manipulation:</strong> Buy low sell high (risky!)</li>
  <li><strong>Carry service:</strong> Carry low level players di dungeon</li>
  <li><strong>Event participation:</strong> Win prizes dari PVP events</li>
</ul>

<div style="background-color: #f59e0b20; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
  <strong>💡 Golden Rule:</strong> Jangan ALL-IN ke satu method. Diversify income sources!
</div>

<h2>⚔️ Combat Tips</h2>
<h3>PVE (Player vs Environment)</h3>
<ul>
  <li><strong>Kite mobs:</strong> Hit & run, jangan tank semua damage</li>
  <li><strong>Use terrain:</strong> Gunakan obstacle untuk block mob</li>
  <li><strong>Cooldown management:</strong> Jangan spam skill, timing is key</li>
  <li><strong>Potion rotation:</strong> Selalu stock HP/MP potion</li>
  <li><strong>Group composition:</strong> 1 tank + 1 healer + 3 DPS (ideal)</li>
</ul>

<h3>PVP (Player vs Player)</h3>
<ul>
  <li><strong>Bait skills:</strong> Force enemy waste cooldowns</li>
  <li><strong>Positioning:</strong> High ground advantage</li>
  <li><strong>Combo execution:</strong> Practice di training dummy</li>
  <li><strong>Counter builds:</strong> Adapt build vs different classes</li>
  <li><strong>Mind games:</strong> Predict enemy movement</li>
</ul>

<h2>🛡️ Equipment Optimization</h2>
<h3>Stat Priority by Class:</h3>
<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
  <thead style="background-color: #10b98120;">
    <tr>
      <th style="padding: 10px; border: 1px solid #374151;">Class</th>
      <th style="padding: 10px; border: 1px solid #374151;">Primary Stat</th>
      <th style="padding: 10px; border: 1px solid #374151;">Secondary Stat</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;">Warrior</td>
      <td style="padding: 10px; border: 1px solid #374151;">STR → VIT</td>
      <td style="padding: 10px; border: 1px solid #374151;">DEX (crit chance)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;">Mage</td>
      <td style="padding: 10px; border: 1px solid #374151;">INT → VIT</td>
      <td style="padding: 10px; border: 1px solid #374151;">LUK (crit damage)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;">Archer</td>
      <td style="padding: 10px; border: 1px solid #374151;">DEX → STR</td>
      <td style="padding: 10px; border: 1px solid #374151;">LUK (drop rate)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #374151;">Assassin</td>
      <td style="padding: 10px; border: 1px solid #374151;">DEX → STR</td>
      <td style="padding: 10px; border: 1px solid #374151;">LUK (critical)</td>
    </tr>
  </tbody>
</table>

<h3>Upgrade Strategy:</h3>
<ul>
  <li><strong>+0 to +5:</strong> 100% success rate, no risk</li>
  <li><strong>+5 to +10:</strong> 70% success, use normal stone</li>
  <li><strong>+10 to +15:</strong> 40% success, use blessed stone (don't break on fail)</li>
  <li><strong>Focus weapon first:</strong> Damage > defense untuk efficiency</li>
</ul>

<h2>🤝 Social & Guild Tips</h2>
<ul>
  <li><strong>Join active guild:</strong> Guild buffs sangat helpful</li>
  <li><strong>Network:</strong> Add top players, learn from them</li>
  <li><strong>Mentor newbies:</strong> Karma = good luck di drop rates 😉</li>
  <li><strong>Guild contribution:</strong> Daily donation untuk guild skills</li>
  <li><strong>Voice chat:</strong> Join Discord untuk better coordination</li>
</ul>

<h2>📊 Resource Management</h2>
<h3>What to Save:</h3>
<ul>
  <li>✅ Rare crafting materials</li>
  <li>✅ Event tokens</li>
  <li>✅ Skill books (learn or sell at high price)</li>
  <li>✅ Potions (always stock 50+ each)</li>
</ul>

<h3>What to Sell:</h3>
<ul>
  <li>❌ Common equipment (vendor trash)</li>
  <li>❌ Duplicate materials</li>
  <li>❌ Low tier gems</li>
  <li>❌ Quest items setelah complete</li>
</ul>

<h2>⏰ Time Management</h2>
<h3>Daily Routine (30 min):</h3>
<ol>
  <li>Login reward (1 min)</li>
  <li>Daily quest (10 min)</li>
  <li>Guild donation (1 min)</li>
  <li>Check market for deals (5 min)</li>
  <li>Quick dungeon run (13 min)</li>
</ol>

<h3>Weekly Goals:</h3>
<ul>
  <li>Complete all weekly quests</li>
  <li>Participate minimal 3x raid</li>
  <li>Attend 1x guild war</li>
  <li>Farm untuk 1 BiS equipment piece</li>
</ul>

<div style="background-color: #10b98120; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>🏆 Pro Player Mindset</h3>
  <ul>
    <li><strong>Patience:</strong> Progress takes time</li>
    <li><strong>Consistency:</strong> Login daily lebih baik dari binge weekend</li>
    <li><strong>Adaptability:</strong> Meta berubah, adapt or die</li>
    <li><strong>Community:</strong> Solo play OK, but team play = faster progress</li>
    <li><strong>Have fun:</strong> It's a game! Don't stress too much</li>
  </ul>
</div>

<h2>🚫 Common Mistakes to Avoid</h2>
<ul>
  <li>❌ Upgrading all equipment equally (focus weapon first!)</li>
  <li>❌ Spending all coins impulsively</li>
  <li>❌ Skipping daily quests</li>
  <li>❌ Solo farming when party is better</li>
  <li>❌ Ignoring guild activities</li>
  <li>❌ Not using buffs/potions untuk save money</li>
  <li>❌ AFKing di mob spawn (get kicked!)</li>
</ul>

<p style="text-align: center; margin-top: 30px; font-size: 18px;">
  <strong>Remember: Every pro was once a noob. Keep grinding! 💪</strong>
</p>`,
      imageUrl: '/uploads/guides/tips.png',
      order: 6,
      isActive: true
    }
  ];

  for (const guide of guides) {
    await prisma.guide.create({ data: guide });
  }
  console.log('✅ Guides created');

  const settings = [
    { key: 'site_name', value: 'SSSMC - Minecraft Server' },
    { key: 'site_description', value: 'Server Minecraft terbaik dengan berbagai mode permainan. Join sekarang dan rasakan pengalaman bermain yang berbeda!' },
    { key: 'discord_url', value: 'https://discord.gg/sssmc' },
    { key: 'whatsapp_admin', value: '6281234567890' },
    { key: 'server_ip', value: 'play.sssmc.com' },
    { key: 'server_port', value: '19132' },
    { key: 'banner_title', value: 'Selamat Datang di SSSMC' },
    { key: 'banner_subtitle', value: 'Server Minecraft Bedrock Edition Terbaik di Indonesia' },
    { key: 'online_players', value: '127' },
    { key: 'max_players', value: '500' }
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    });
  }
  console.log('✅ Settings created');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Summary:');
  console.log('- Admin email: admin@minecraft.com');
  console.log('- Admin password: admin123');
  console.log('- Server types: 3 (MIX, RPG, Skyblock)');
  console.log('- Products: 23 total');
  console.log('  • Coins: 13 products (MIX: 5, RPG: 4, Skyblock: 4)');
  console.log('  • Ranks: 10 products (MIX: 4, RPG: 3, Skyblock: 3)');
  console.log('- Gallery items: 18 beautiful screenshots');
  console.log('- Guides: 6 comprehensive tutorials (TinyMCE formatted)');
  console.log('- Settings: Server configuration loaded');
  console.log('- Sample Order: 1 completed order (ORD-1234567890-ABCDE)');
  console.log('\n✨ Database ready for use!');
  console.log('\n🔍 Test order tracking dengan code: ORD-1234567890-ABCDE');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });