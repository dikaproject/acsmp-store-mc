// src/components/RulesServerContent.jsx
// Konten peraturan server yang dirender langsung (bukan dari DB).
// Komponen ini digunakan di GuidesPage (card pinned) dan GuideDetailPage (konten full).

export const RULES_GUIDE = {
  id: '__rules__',
  slug: 'peraturan-server',
  title: 'Peraturan Resmi Server',
  isRules: true,
  order: -1,
  isActive: true,
  imageUrl: null,
  createdAt: new Date('2024-01-01').toISOString(),
};

// Full HTML content untuk rules — diparsing oleh GuideDetailPage via dangerouslySetInnerHTML
export function getRulesHtml() {
  return `
<div class="rules-doc">

  <div class="rules-intro">
    <p>Dengan bermain di server ini, setiap pemain dianggap <strong>telah membaca, memahami, dan menyetujui</strong> seluruh peraturan di bawah ini. Ketidaktahuan terhadap peraturan tidak dapat dijadikan alasan.</p>
  </div>

  <h2 class="rules-section-title danger">⚠️ Pelanggaran Berat</h2>

  <div class="rules-card danger">
    <div class="rules-card-header">
      <span class="rules-num">PASAL 1</span>
      <span class="rules-title">Cheating &amp; Tools Terlarang</span>
      <span class="rules-tag ban">PERMANENT BAN</span>
    </div>
    <ol>
      <li>Dilarang keras menggunakan hack atau modifikasi client yang memberi keuntungan tidak adil.</li>
      <li>Sanksi: <strong class="ban-text">Permanent ban</strong>, tanpa toleransi.</li>
    </ol>
  </div>

  <div class="rules-card danger">
    <div class="rules-card-header">
      <span class="rules-num">PASAL 2</span>
      <span class="rules-title">Real Money Trading (RMT)</span>
      <span class="rules-tag ban">PERMANENT BAN</span>
    </div>
    <ol>
      <li>Pemain <strong>DILARANG</strong> memperjualbelikan item, money, barang, atau aset in-game menggunakan <strong>uang asli</strong> di luar <strong>webstore resmi server</strong>.</li>
      <li>Larangan mencakup: jual-beli money/coin, item, akun, serta joki/jasa berbayar menggunakan uang asli.</li>
      <li>Pihak yang <strong>menawarkan</strong> maupun yang <strong>membeli</strong> sama-sama dikenai sanksi.</li>
      <li>Sanksi: <strong class="ban-text">PERMANENT BAN langsung</strong> + penyitaan seluruh aset hasil transaksi.</li>
    </ol>
    <div class="rules-note danger">⚠️ Admin <strong>tidak bertanggung jawab</strong> dan <strong>tidak memberi refund</strong> atas kerugian dari transaksi RMT ilegal, termasuk jika kamu kena scam. Risiko ditanggung sendiri.</div>
  </div>

  <div class="rules-card danger">
    <div class="rules-card-header">
      <span class="rules-num">PASAL 3</span>
      <span class="rules-title">Bug Abuse</span>
      <span class="rules-tag ban">PUNISH + RESET</span>
    </div>
    <ol>
      <li>Pemain yang menemukan bug <strong>wajib melapor</strong> kepada admin, bukan memanfaatkannya.</li>
      <li>Memanfaatkan bug (duplikasi item, dll) dikenai <strong>punish + reset seluruh aset hasil abuse</strong>.</li>
    </ol>
  </div>

  <div class="rules-card danger">
    <div class="rules-card-header">
      <span class="rules-num">PASAL 4</span>
      <span class="rules-title">Alt Account &amp; Ban Evasion</span>
    </div>
    <ol>
      <li>Dilarang menggunakan akun kedua untuk menghindari ban atau menyalahgunakan event/reward.</li>
      <li>Sanksi: <strong class="ban-text">ban seluruh akun terkait</strong>.</li>
    </ol>
  </div>

  <h2 class="rules-section-title safe">🛡️ Refund &amp; Bantuan</h2>

  <div class="rules-card safe">
    <div class="rules-card-header">
      <span class="rules-num green">PASAL 5</span>
      <span class="rules-title">Refund &amp; Bantuan yang Disetujui</span>
      <span class="rules-tag info">DENGAN BUKTI</span>
    </div>
    <p>Admin <strong>hanya akan memberikan</strong> bantuan/refund dalam kondisi berikut:</p>
    <ul>
      <li><strong>Griefing</strong> — kerusakan area/bangunan oleh pemain lain secara sengaja.</li>
      <li><strong>Pencurian (kemalingan)</strong> — barang diambil pemain lain tanpa izin.</li>
      <li><strong>Kerusuhan berbentuk grief</strong> — perusakan yang merugikan pemain lain.</li>
    </ul>
    <div class="rules-note warn">⚠️ Semua klaim <strong>wajib disertai bukti</strong> (screenshot, video, atau log). Tanpa bukti valid, klaim dapat ditolak.</div>
  </div>

  <div class="rules-card safe">
    <div class="rules-card-header">
      <span class="rules-num green">PASAL 6</span>
      <span class="rules-title">Bantuan Akibat Masalah Teknis</span>
    </div>
    <ol>
      <li>Pemain berhak mendapatkan bantuan/refund apabila kerugian disebabkan oleh <strong>bug server</strong> atau <strong>kesalahan teknis</strong> (crash, rollback, lag parah, kehilangan data sistem, dll).</li>
      <li>Admin akan melakukan <strong>verifikasi</strong> terlebih dahulu sebelum bantuan diberikan.</li>
    </ol>
  </div>

  <div class="rules-card warn">
    <div class="rules-card-header">
      <span class="rules-num warn">PASAL 7</span>
      <span class="rules-title">Tanggung Jawab Pribadi Pemain</span>
      <span class="rules-tag warn">NO REFUND</span>
    </div>
    <ol>
      <li>Setiap pemain bertanggung jawab penuh atas tindakannya sendiri.</li>
      <li><strong>Tidak ada refund/bantuan</strong> untuk kerugian akibat kesalahan sendiri, termasuk:
        <ul>
          <li>Barang hilang karena lupa, salah simpan, atau salah buang.</li>
          <li>Salah menaruh/menghancurkan block atas keputusan sendiri.</li>
          <li>Item jatuh ke lava, void, api, atau hilang karena death.</li>
          <li>Salah trade/transaksi dengan pemain lain.</li>
        </ul>
      </li>
      <li>Pemain wajib <strong>selalu berhati-hati</strong> dan menyimpan barang berharga di tempat aman.</li>
    </ol>
  </div>

  <div class="rules-card safe">
    <div class="rules-card-header">
      <span class="rules-num green">PASAL 8</span>
      <span class="rules-title">Scamming In-Game</span>
    </div>
    <ol>
      <li>Dilarang menipu pemain lain dalam trade/transaksi in-game.</li>
      <li>Sanksi: <strong>punish</strong> + diusahakan <strong>refund korban</strong> apabila ada bukti valid.</li>
    </ol>
  </div>

  <div class="rules-card safe">
    <div class="rules-card-header">
      <span class="rules-num green">PASAL 9</span>
      <span class="rules-title">Perlindungan &amp; Penghapusan Claim Land</span>
    </div>
    <ol>
      <li>Claim land pemain <strong>dilindungi</strong> dan <strong>tidak akan dihapus</strong> hanya karena pemain lain ingin memperluas lahannya.</li>
      <li>Penghapusan claim <strong>hanya</strong> dipertimbangkan jika:
        <ul>
          <li>Pemilik tidak login selama <strong>60 hari</strong>.</li>
          <li>Claim menghalangi fasilitas penting server (spawn, jalan utama, dll).</li>
          <li>Pemilik di-ban permanen karena pelanggaran berat.</li>
        </ul>
      </li>
      <li>Pemain <strong>tidak boleh</strong> menuntut penghapusan claim orang lain untuk kepentingan pribadi.</li>
    </ol>
  </div>

  <h2 class="rules-section-title neutral">📋 Peraturan Umum</h2>

  <div class="rules-card safe">
    <div class="rules-card-header">
      <span class="rules-num green">PASAL 10</span>
      <span class="rules-title">Toxic &amp; Perilaku</span>
    </div>
    <ol>
      <li>Dilarang spam, SARA, ujaran kebencian, pelecehan, dan menyebar info pribadi orang lain (doxxing).</li>
      <li>Sanksi berupa mute, tempban, hingga permanent ban sesuai tingkat pelanggaran.</li>
    </ol>
  </div>

  <div class="rules-card safe">
    <div class="rules-card-header">
      <span class="rules-num green">PASAL 11</span>
      <span class="rules-title">Iklan &amp; Promosi</span>
    </div>
    <ol>
      <li>Dilarang mempromosikan server lain atau menyebar link mencurigakan di chat maupun Discord.</li>
    </ol>
  </div>

  <div class="rules-card warn">
    <div class="rules-card-header">
      <span class="rules-num warn">PASAL 12</span>
      <span class="rules-title">Pembelian Rank</span>
      <span class="rules-tag warn">FINAL</span>
    </div>
    <ol>
      <li><strong>Semua pembelian rank bersifat final</strong> dan <strong>TIDAK DAPAT direfund</strong> dengan alasan apa pun.</li>
      <li>Pastikan kamu sudah yakin sebelum melakukan pembelian.</li>
    </ol>
  </div>

  <div class="rules-card safe">
    <div class="rules-card-header">
      <span class="rules-num green">PASAL 13</span>
      <span class="rules-title">Pemindahan Rank</span>
    </div>
    <ol>
      <li>Pemindahan rank ke akun lain <strong>hanya dapat dilakukan 1 (satu) kali</strong> untuk setiap rank.</li>
      <li>Setelah dipindahkan, rank <strong>tidak dapat dipindahkan kembali</strong>.</li>
      <li>Pemindahan wajib melalui admin resmi server.</li>
    </ol>
  </div>

  <div class="rules-footer">
    <h3>📌 Ketentuan Tambahan</h3>
    <ul>
      <li>Keputusan admin bersifat <strong>final dan tidak dapat diganggu gugat</strong>.</li>
      <li>Peraturan dapat <strong>diperbarui sewaktu-waktu</strong> tanpa pemberitahuan terlebih dahulu.</li>
      <li>Dengan bermain di server ini, kamu dianggap <strong>menyetujui seluruh peraturan</strong> di atas.</li>
    </ul>
    <p class="rules-sign">⛏️ Selamat bermain &amp; jaga sportivitas!</p>
  </div>

</div>
  `.trim();
}
