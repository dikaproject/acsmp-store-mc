import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, ImageIcon, Palette, CheckCircle2, Copy, ExternalLink,
  RefreshCw, AlertCircle, Shirt, User, Info, Loader2,
} from "lucide-react";
import { skinAPI } from "../lib/api";
import toast from "react-hot-toast";

// ─── 3D Preview component ─────────────────────────────────────────────────────
// skinview3d is loaded via <script> in index.html → window.skinview3d is always available
function SkinPreview3D({ source, model }) {
  const canvasRef = useRef(null);
  const viewerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    if (!source || !canvasRef.current) return;
    setStatus("loading");

    if (!window.skinview3d) {
      console.error("skinview3d not loaded");
      setStatus("error");
      return;
    }

    let objectUrl = null;
    const skinSrc = typeof source === "string"
      ? source
      : (objectUrl = URL.createObjectURL(source));

    try {
      if (viewerRef.current) { viewerRef.current.dispose(); viewerRef.current = null; }
      const viewer = new window.skinview3d.SkinViewer({
        canvas: canvasRef.current,
        width: 220,
        height: 340,
        skin: skinSrc,
        model: model === "slim" ? "slim" : "default",
      });
      // skinview3d v3 API: viewer.animation (singular), not viewer.animations.add()
      viewer.animation = new window.skinview3d.WalkingAnimation();
      viewer.animation.speed = 0.5;
      viewer.autoRotate = true;
      viewer.autoRotateSpeed = 1.2;
      viewerRef.current = viewer;
      setStatus("ready");
    } catch (e) {
      console.error("SkinViewer init error:", e);
      setStatus("error");
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (viewerRef.current) { viewerRef.current.dispose(); viewerRef.current = null; }
    };
  }, [source, model]);

  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: 340 }}>
      <canvas
        ref={canvasRef}
        width={220}
        height={340}
        className={`rounded-xl border border-purple-500/30 bg-black/40 shadow-lg shadow-purple-900/20 transition-opacity duration-300 ${
          status === "ready" ? "opacity-100" : "opacity-0 absolute pointer-events-none"
        }`}
      />
      {status === "loading" && (
        <div className="flex flex-col items-center gap-3 text-gray-500 py-8">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30" />
            <div className="relative w-full h-full rounded-full bg-purple-500/10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-purple-400 animate-spin" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Memuat preview 3D…</p>
        </div>
      )}
      {status === "error" && (
        <div className="flex flex-col items-center gap-2 py-8">
          <AlertCircle className="w-8 h-8 text-red-400/60" />
          <p className="text-xs text-center text-red-400/80">Gagal memuat preview 3D<br />Coba refresh halaman</p>
        </div>
      )}
    </div>
  );
}

// ─── Upload progress overlay ─────────────────────────────────────────────────
const UPLOAD_STEPS = [
  { key: "validation", label: "Memvalidasi file skin" },
  { key: "uploading",  label: "Mengunggah ke MineSkin" },
  { key: "processing", label: "Memproses tekstur" },
  { key: "finalizing", label: "Menyiapkan hasil" },
];

function UploadProgress({ step }) {
  const currentIdx = UPLOAD_STEPS.findIndex(s => s.key === step);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        className="bg-[#0d0d12] border border-purple-500/30 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl shadow-purple-900/40"
      >
        <div className="flex flex-col items-center gap-6">
          {/* Spinner */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/40" />
            <div className="relative w-full h-full rounded-full bg-purple-500/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-1">Memproses Skin</h3>
            <p className="text-sm text-gray-400">Mohon tunggu beberapa saat…</p>
          </div>
          {/* Steps */}
          <div className="w-full space-y-2">
            {UPLOAD_STEPS.map((s, i) => {
              const done    = i < currentIdx;
              const current = i === currentIdx;
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: i <= currentIdx ? 1 : 0.25, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    current ? "bg-purple-500/10 border border-purple-500/20" : ""
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    done    ? "bg-emerald-500/20" :
                    current ? "bg-purple-500/20" : "bg-white/5"
                  }`}>
                    {done
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      : current
                        ? <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
                        : <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                    }
                  </div>
                  <span className={`text-sm ${
                    current ? "text-white font-medium" :
                    done    ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {s.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SkinPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [model, setModel] = useState("classic");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const stepTimers = useRef([]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const clearTimers = () => { stepTimers.current.forEach(clearTimeout); stepTimers.current = []; };

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (f.type !== "image/png") { toast.error("Hanya file PNG yang didukung"); return; }
    if (f.size > 1024 * 1024) { toast.error("Ukuran file maksimal 1 MB"); return; }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  }, [preview]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleInput = (e) => handleFile(e.target.files?.[0]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setUploadStep("validation");
    clearTimers();
    stepTimers.current = [
      setTimeout(() => setUploadStep("uploading"),  600),
      setTimeout(() => setUploadStep("processing"), 3000),
    ];
    try {
      const fd = new FormData();
      fd.append("skin", file);
      fd.append("model", model);
      const res = await skinAPI.upload(fd);
      clearTimers();
      setUploadStep("finalizing");
      await new Promise(r => setTimeout(r, 700));
      setResult(res.data);
      setUploadStep(null);
      toast.success("Skin berhasil diupload!");
    } catch (err) {
      clearTimers();
      setUploadStep(null);
      const msg = err.response?.data?.message || err.message || "Upload gagal";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success("Disalin!"),
      () => toast.error("Gagal menyalin")
    );
  };

  const reset = () => {
    clearTimers();
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
    setError(null);
    setUploadStep(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // After upload succeed use the remote URL as 3D source for the real texture;
  // otherwise fall back to local File for instant live preview.
  const previewSource = result?.skinUrl || file;
  // Prefer short URL (/s/8hexchars), fall back to full texture hash proxy
  const _apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const textureHash = result?.skinUrl?.split('/texture/')?.[1] ?? null;
  const commandUrl = result?.shortCode
    ? `${_apiBase}/skin/s/${result.shortCode}`
    : textureHash
      ? `${_apiBase}/skin/texture/${textureHash}`
      : result?.skinUrl;
  const modelFlag = model === "slim" ? " slim" : " classic";
  const skinCommand = commandUrl ? `/skin url "${commandUrl}"${modelFlag}` : null;

  return (
    <>
    <AnimatePresence>
      {uploadStep && <UploadProgress step={uploadStep} />}
    </AnimatePresence>
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-violet-900/10 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-4"
          >
            <Palette className="w-4 h-4" />
            Skin Uploader
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 mb-3"
          >
            Upload Custom Skin
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base"
          >
            Upload skin PNG kamu dan dapatkan URL untuk dipakai di server dengan command in-game.
          </motion.p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* ─── Left: Upload card ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col gap-6"
          >
            <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-400" /> Upload Skin
            </h2>

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              className={`
                relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 select-none
                flex flex-col items-center justify-center gap-3 py-10 px-6 text-center
                ${dragging
                  ? "border-purple-400 bg-purple-500/10"
                  : file
                    ? "border-purple-500/40 bg-purple-500/5"
                    : "border-white/10 hover:border-purple-500/40 hover:bg-white/[0.03]"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                className="hidden"
                onChange={handleInput}
              />

              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 object-contain rounded-lg border border-purple-500/20 bg-black/40"
                  />
                  <p className="text-sm text-purple-300 font-medium">{file?.name}</p>
                  <p className="text-xs text-gray-500">Klik untuk ganti file</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <ImageIcon className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Drag & drop skin PNG</p>
                    <p className="text-xs text-gray-500 mt-1">atau klik untuk pilih file · maks 1 MB</p>
                  </div>
                </>
              )}
            </div>

            {/* Model selector */}
            <div>
              <p className="text-sm text-gray-400 mb-2 flex items-center gap-1.5">
                <Shirt className="w-4 h-4" /> Tipe Model
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "classic", label: "Classic", desc: "Lengan tebal (4px)" },
                  { value: "slim", label: "Slim / Alex", desc: "Lengan tipis (3px)" },
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setModel(value)}
                    className={`
                      relative flex flex-col items-start gap-0.5 p-3 rounded-xl border text-left transition-all
                      ${model === value
                        ? "border-purple-500 bg-purple-500/10 text-white"
                        : "border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/[0.03]"
                      }
                    `}
                  >
                    <span className="font-medium text-sm">{label}</span>
                    <span className="text-xs opacity-70">{desc}</span>
                    {model === value && (
                      <CheckCircle2 className="absolute top-2.5 right-2.5 w-4 h-4 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload button */}
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all
                bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500
                disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
                shadow-lg shadow-purple-900/30"
            >
              <Upload className="w-4 h-4" />
              Upload Skin
            </button>

            {/* Info note */}
            <div className="flex gap-2 bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 text-xs text-blue-300">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
              <span>
                Upload memerlukan beberapa detik karena diproses oleh server MineSkin.
                Pastikan file berukuran 64×64 atau 64×32 piksel.
              </span>
            </div>
          </motion.div>

          {/* ─── Right: Preview + Result ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            {/* 3D Preview */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4">
              <div className="self-stretch flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" /> Preview 3D
                </h2>
                {result?.skinUrl && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tekstur terupload
                  </span>
                )}
              </div>

              {previewSource ? (
                <SkinPreview3D source={previewSource} model={model} />
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-16 text-gray-600">
                  <div className="w-20 h-28 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center mb-3">
                    <User className="w-10 h-10 opacity-30" />
                  </div>
                  <p className="text-sm">Pilih file skin untuk melihat preview 3D</p>
                </div>
              )}

              {/* Quick model toggle below viewer */}
              {previewSource && (
                <div className="flex gap-2 mt-1">
                  {[
                    { value: "classic", label: "Classic" },
                    { value: "slim",    label: "Slim / Alex" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setModel(value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                        model === value
                          ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                          : "border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    Skin Berhasil Diupload!
                  </div>

                  {/* In-game command */}
                  {skinCommand && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">Command in-game:</p>
                      <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 group">
                        <code className="flex-1 text-sm text-purple-300 font-mono break-all">
                          {skinCommand}
                        </code>
                        <button
                          onClick={() => copyToClipboard(skinCommand)}
                          className="shrink-0 p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Skin URL */}
                  {result.skinUrl && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">URL Tekstur:</p>
                      <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                        <span className="flex-1 text-xs text-gray-300 font-mono truncate">
                          {result.skinUrl}
                        </span>
                        <button
                          onClick={() => copyToClipboard(result.skinUrl)}
                          className="shrink-0 p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={result.skinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={reset}
                    className="self-start flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Upload skin lain
                  </button>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex gap-3 items-start text-sm text-red-300"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 bg-white/[0.02] border border-white/10 rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-400" /> Cara Menggunakan Skin
          </h3>
          <ol className="text-sm text-gray-400 space-y-1.5 list-decimal list-inside">
            <li>Upload file PNG skin kamu di form di atas.</li>
            <li>Pilih tipe model yang sesuai (Classic untuk Steve, Slim untuk Alex).</li>
            <li>Klik <span className="text-purple-300 font-medium">Upload Skin</span> dan tunggu prosesnya selesai.</li>
            <li>Salin command yang muncul lalu jalankan di dalam game.</li>
          </ol>
        </motion.div>
      </div>
    </div>
    </>
  );
}
