/**
 * Seed: Panduan AmazingCraft (development only)
 * Run: node prisma/seedGuides.js
 * Akan skip jika slug sudah ada (safe to re-run).
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const guides = [
  // ─────────────────────────────────────────────
  // 1. Cara Bergabung ke Server
  // ─────────────────────────────────────────────
  {
    title: 'Cara Bergabung ke Server AmazingCraft',
    slug: 'cara-bergabung',
    order: 1,
    isActive: true,
    content: `
<h2>Selamat Datang di AmazingCraft!</h2>
<p>Panduan ini akan memandu kamu langkah demi langkah untuk bergabung ke server AmazingCraft untuk pertama kalinya.</p>

<h3>Persyaratan</h3>
<ul>
  <li>Minecraft: Bedrock Edition (PC, Mobile, Console)</li>
  <li>Koneksi internet yang stabil</li>
  <li>Akun Microsoft / Xbox (untuk verifikasi nama)</li>
</ul>

<h3>Langkah 1 — Tambahkan Server</h3>
<ol>
  <li>Buka Minecraft dan masuk ke menu <strong>Play</strong></li>
  <li>Pilih tab <strong>Servers</strong></li>
  <li>Scroll ke bawah dan klik <strong>Add Server</strong></li>
  <li>Isi detail berikut:
    <ul>
      <li><strong>Server Name:</strong> AmazingCraft</li>
      <li><strong>Server Address:</strong> amazingcraft.org</li>
      <li><strong>Port:</strong> 19132</li>
    </ul>
  </li>
  <li>Klik <strong>Save</strong></li>
</ol>

<h3>Langkah 2 — Masuk ke Server</h3>
<p>Klik server AmazingCraft yang sudah ditambahkan, lalu klik <strong>Join Server</strong>. Tunggu loading selesai — kamu akan spawn di lobby utama.</p>

<h3>Langkah 3 — Pilih Server Mode</h3>
<p>Di lobby, kamu bisa memilih mode server yang ingin dimainkan: <strong>RPG</strong>, <strong>MIX</strong>, atau <strong>Skyblock</strong>. Klik portal atau NPC yang sesuai untuk masuk.</p>

<blockquote>
  💡 Jika terjadi masalah koneksi, coba matikan VPN atau ganti DNS ke <code>1.1.1.1</code>
</blockquote>

<h3>Butuh Bantuan?</h3>
<p>Join Discord kami di <strong>discord.gg/amazingcraft</strong> jika kamu mengalami kendala saat masuk server.</p>
    `.trim(),
  },

  // ─────────────────────────────────────────────
  // 2. Cara Beli Rank / Donasi
  // ─────────────────────────────────────────────
  {
    title: 'Cara Membeli Rank & Donasi di Webstore',
    slug: 'cara-beli-rank',
    order: 2,
    isActive: true,
    content: `
<h2>Beli Rank & Donasi di AmazingCraft</h2>
<p>Mendukung server sekaligus mendapat keuntungan eksklusif! Berikut cara melakukan pembelian melalui webstore resmi.</p>

<h3>Langkah 1 — Login ke Webstore</h3>
<ol>
  <li>Buka <strong>store.amazingcraft.org</strong></li>
  <li>Klik tombol <strong>Login</strong> di pojok kanan atas</li>
  <li>Masukkan <strong>username Minecraft</strong> kamu (bukan email)</li>
  <li>Pilih <strong>server</strong> yang kamu mainkan (RPG / MIX / Skyblock)</li>
  <li>Klik <strong>Verifikasi</strong> — sistem akan mengecek apakah kamu pernah join server</li>
</ol>

<blockquote>
  ⚠️ Kamu harus sudah pernah join server minimal 1 kali agar nama bisa diverifikasi.
</blockquote>

<h3>Langkah 2 — Pilih Produk</h3>
<ol>
  <li>Buka menu <strong>Shop</strong></li>
  <li>Pilih produk yang diinginkan (Rank, Coin, Feature, dll)</li>
  <li>Klik <strong>Add to Cart</strong> atau langsung <strong>Buy Now</strong></li>
</ol>

<h3>Langkah 3 — Checkout</h3>
<ol>
  <li>Buka <strong>Cart</strong> dan periksa pesanan</li>
  <li>Masukkan kode voucher jika ada</li>
  <li>Pilih metode pembayaran (Transfer Bank, VA, QRIS, dll)</li>
  <li>Klik <strong>Bayar Sekarang</strong> dan selesaikan pembayaran</li>
</ol>

<h3>Langkah 4 — Konfirmasi Otomatis</h3>
<p>Setelah pembayaran berhasil, rank/item akan otomatis diberikan ke akun Minecraft kamu dalam <strong>1-5 menit</strong>. Kamu juga akan mendapat notifikasi WhatsApp jika nomor diisi saat checkout.</p>

<h3>Cek Status Pesanan</h3>
<p>Buka menu <strong>Track Order</strong> di navbar dan masukkan kode pesanan untuk memantau status real-time.</p>
    `.trim(),
  },

  // ─────────────────────────────────────────────
  // 3. Sistem Rank
  // ─────────────────────────────────────────────
  {
    title: 'Mengenal Sistem Rank di AmazingCraft',
    slug: 'sistem-rank',
    order: 3,
    isActive: true,
    content: `
<h2>Sistem Rank AmazingCraft</h2>
<p>Rank memberikan berbagai keuntungan eksklusif selama kamu bermain di server. Berikut penjelasan lengkapnya.</p>

<h3>Jenis Rank</h3>
<table>
  <thead>
    <tr>
      <th>Rank</th>
      <th>Durasi</th>
      <th>Keuntungan Utama</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>VIP</strong></td>
      <td>30 hari</td>
      <td>Prefix VIP, bonus coin 10%, akses warp VIP</td>
    </tr>
    <tr>
      <td><strong>VIP+</strong></td>
      <td>30 hari</td>
      <td>Semua VIP + fly di survival, kit eksklusif</td>
    </tr>
    <tr>
      <td><strong>MVP</strong></td>
      <td>30 hari</td>
      <td>Semua VIP+ + nick color, particle effects</td>
    </tr>
    <tr>
      <td><strong>MVP+</strong></td>
      <td>30 hari</td>
      <td>Semua MVP + priority join, custom join message</td>
    </tr>
  </tbody>
</table>

<h3>Upgrade Rank</h3>
<p>Jika kamu sudah punya rank aktif, kamu bisa <strong>upgrade</strong> ke rank yang lebih tinggi dengan hanya membayar <strong>selisih harga</strong>. Sistem akan otomatis menghitung harga upgrade saat checkout.</p>

<h3>Perpanjang Rank</h3>
<p>Rank yang sudah habis masa berlakunya bisa dibeli ulang dengan harga normal. Durasi akan dimulai dari tanggal pembelian baru.</p>

<h3>Cek Rank Aktif</h3>
<p>Login ke webstore lalu lihat info rank di <strong>profil kamu</strong> (pojok kanan atas). Rank aktif dan tanggal kadaluarsa akan tampil di sana.</p>

<blockquote>
  ℹ️ Rank bersifat per-server. Rank di server MIX tidak berlaku di RPG atau Skyblock.
</blockquote>
    `.trim(),
  },

  // ─────────────────────────────────────────────
  // 4. Cara Pakai Voucher
  // ─────────────────────────────────────────────
  {
    title: 'Cara Menggunakan Kode Voucher',
    slug: 'cara-pakai-voucher',
    order: 4,
    isActive: true,
    content: `
<h2>Kode Voucher AmazingCraft</h2>
<p>Voucher memberikan diskon langsung untuk pembelian di webstore. Begini cara pakainya.</p>

<h3>Di Mana Mendapatkan Voucher?</h3>
<ul>
  <li>Event dan giveaway di Discord server</li>
  <li>Konten kreator yang bermitra dengan AmazingCraft</li>
  <li>Hadiah dari turnamen atau kompetisi in-game</li>
  <li>Newsletter / pengumuman resmi di Discord</li>
</ul>

<h3>Cara Menggunakan</h3>
<ol>
  <li>Tambahkan produk ke <strong>Cart</strong></li>
  <li>Buka halaman <strong>Checkout</strong></li>
  <li>Temukan kolom <strong>"Kode Voucher"</strong></li>
  <li>Ketik kode voucher (otomatis kapital) lalu klik <strong>Terapkan</strong></li>
  <li>Diskon akan langsung terpotong dari total harga</li>
</ol>

<h3>Syarat & Ketentuan Voucher</h3>
<ul>
  <li>Satu pesanan hanya bisa menggunakan <strong>1 voucher</strong></li>
  <li>Voucher tidak bisa digabung satu sama lain</li>
  <li>Beberapa voucher punya batas penggunaan dan tanggal kadaluarsa</li>
  <li>Voucher yang sudah dipakai <strong>tidak bisa dikembalikan</strong></li>
</ul>

<blockquote>
  💡 Aktifkan notifikasi Discord untuk tidak ketinggalan voucher eksklusif!
</blockquote>
    `.trim(),
  },

  // ─────────────────────────────────────────────
  // 5. FAQ & Troubleshoot
  // ─────────────────────────────────────────────
  {
    title: 'FAQ & Troubleshoot Umum',
    slug: 'faq-troubleshoot',
    order: 5,
    isActive: true,
    content: `
<h2>FAQ & Troubleshoot AmazingCraft</h2>
<p>Kumpulan pertanyaan yang sering ditanyakan beserta solusinya.</p>

<h3>Pertanyaan Umum</h3>

<h4>❓ Rank saya belum masuk setelah bayar</h4>
<p>Tunggu maksimal <strong>10 menit</strong> setelah pembayaran dikonfirmasi. Jika lebih dari itu, coba:</p>
<ol>
  <li>Keluar lalu masuk kembali ke server</li>
  <li>Cek status pesanan di menu <strong>Track Order</strong></li>
  <li>Hubungi admin via Discord dengan menyertakan nomor pesanan</li>
</ol>

<h4>❓ Tidak bisa login ke webstore</h4>
<p>Pastikan kamu sudah pernah join server minimal 1 kali. Nama Minecraft kamu harus sudah terdaftar di database server. Jika belum pernah join, masuk ke server dulu kemudian coba login kembali.</p>

<h4>❓ Pembayaran gagal terus</h4>
<ul>
  <li>Pastikan nominal yang dimasukkan sudah tepat (termasuk kode unik VA)</li>
  <li>Coba metode pembayaran lain (QRIS biasanya paling cepat)</li>
  <li>Pastikan saldo mencukupi termasuk biaya admin</li>
  <li>Jika VA sudah expired, buat pesanan baru</li>
</ul>

<h4>❓ Bisa refund kalau tidak jadi beli?</h4>
<p>Sesuai peraturan server, <strong>semua pembelian rank bersifat final</strong> dan tidak dapat direfund. Pastikan kamu sudah yakin sebelum melakukan pembayaran.</p>

<h4>❓ Server lag / tidak bisa connect</h4>
<ul>
  <li>Cek status server di Discord (#server-status)</li>
  <li>Restart Minecraft dan coba connect ulang</li>
  <li>Ganti DNS ke <code>1.1.1.1</code> atau <code>8.8.8.8</code></li>
  <li>Matikan VPN jika sedang aktif</li>
</ul>

<h4>❓ Cara report pemain yang cheat</h4>
<p>Kumpulkan bukti (screenshot/video), lalu buat laporan di channel <strong>#report</strong> di Discord. Sertakan nama pemain, server, dan bukti yang valid.</p>

<h3>Masih Ada Masalah?</h3>
<p>Hubungi tim support di Discord: <strong>discord.gg/amazingcraft</strong> atau buka tiket di channel #open-ticket.</p>
    `.trim(),
  },

  // ─────────────────────────────────────────────
  // 6. Panduan Server RPG
  // ─────────────────────────────────────────────
  {
    title: 'Panduan Memulai di Server RPG',
    slug: 'panduan-server-rpg',
    order: 6,
    isActive: true,
    content: `
<h2>Mulai Petualangan di Server RPG</h2>
<p>Server RPG AmazingCraft punya sistem leveling, quest, skill tree, dan guild yang lengkap. Ini panduan untuk pemula.</p>

<h3>Spawn Pertama Kali</h3>
<p>Saat pertama masuk, kamu akan berada di <strong>Kota Awal (Starter Town)</strong>. Di sini kamu bisa:</p>
<ul>
  <li>Memilih <strong>class karakter</strong> (Warrior, Archer, Mage, Healer)</li>
  <li>Mengambil <strong>starter quest</strong> dari NPC di dekat spawn</li>
  <li>Membeli equipment dasar di <strong>Toko Starter</strong></li>
</ul>

<h3>Sistem Level & EXP</h3>
<p>Dapatkan EXP dari: membunuh monster, menyelesaikan quest, mining, farming, dan crafting. Setiap level up kamu mendapat <strong>skill point</strong> yang bisa digunakan untuk upgrade skill tree.</p>

<h3>Quest System</h3>
<p>Cari NPC dengan tanda <strong>❕</strong> di atas kepalanya untuk mengambil quest. Quest dibagi menjadi:</p>
<ul>
  <li><strong>Main Quest</strong> — cerita utama server, reward besar</li>
  <li><strong>Side Quest</strong> — quest sampingan, reward item langka</li>
  <li><strong>Daily Quest</strong> — reset setiap hari, reward coin dan EXP</li>
</ul>

<h3>Tips Pemula</h3>
<ul>
  <li>Selesaikan Main Quest dulu untuk unlock fitur-fitur utama</li>
  <li>Join guild untuk bisa ikut <strong>Guild War</strong> dan dapat bonus EXP</li>
  <li>Simpan item penting di <strong>enderchest</strong> agar aman dari death</li>
  <li>Gunakan <code>/warp market</code> untuk membeli/jual item dengan pemain lain</li>
</ul>

<blockquote>
  🗡️ Tips: Class Warrior paling mudah untuk pemula karena HP dan defense tinggi!
</blockquote>
    `.trim(),
  },
];

async function main() {
  console.log('🌱 Seeding guides (development)...');
  let created = 0;
  let skipped = 0;

  for (const guide of guides) {
    const existing = await prisma.guide.findUnique({ where: { slug: guide.slug } });
    if (existing) {
      console.log(`  ⏭  Skip: "${guide.title}" (slug sudah ada)`);
      skipped++;
      continue;
    }
    await prisma.guide.create({ data: guide });
    console.log(`  ✅ Created: "${guide.title}"`);
    created++;
  }

  console.log(`\n📚 Selesai! ${created} panduan dibuat, ${skipped} di-skip.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
