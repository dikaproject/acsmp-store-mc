import { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { digitalProductAPI } from '../../lib/api';
import { getImageUrl } from '../../lib/utils';
import { buildWhatsAppUrl, getWhatsAppNumberFromUrl } from '../../lib/whatsapp';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const BUTTON_FOCUS = 'min-h-[44px] text-white focus-visible:ring-2 focus-visible:ring-white';
const INPUT_STYLES = 'min-h-[44px] border-gray-500 placeholder:text-bone-muted focus-visible:border-gray-400 focus-visible:ring-2 focus-visible:ring-white';

const DigitalProductForm = ({ product, onClose, onSuccess }) => {
  const dialogRef = useRef(null);
  const titleInputRef = useRef(null);
  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [whatsappNumber, setWhatsappNumber] = useState(getWhatsAppNumberFromUrl(product?.redirectUrl));
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(product);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
    titleInputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      requestAnimationFrame(() => {
        if (previousFocus?.isConnected) previousFocus.focus?.();
      });
    };
  }, []);

  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setImageError('Gunakan foto JPG, PNG, WEBP, atau GIF.');
      setImageFile(null);
      setImagePreview('');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Ukuran foto maksimal 5 MB.');
      setImageFile(null);
      setImagePreview('');
      event.target.value = '';
      return;
    }
    setImageError('');
    setImageFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving || imageError) return;
    setError('');

    if (!title.trim() || !description.trim() || !whatsappNumber.trim()) {
      setError('Lengkapi judul, deskripsi, dan nomor WhatsApp.');
      return;
    }
    if (!isEditing && !imageFile) {
      setImageError('Pilih foto untuk produk digital ini.');
      return;
    }
    const redirectUrl = buildWhatsAppUrl(whatsappNumber, product?.redirectUrl);
    if (!redirectUrl) {
      setError('Masukkan nomor WhatsApp yang valid, misalnya 081222828282 atau +6281222828282.');
      return;
    }

    const data = new FormData();
    data.append('title', title.trim());
    data.append('description', description.trim());
    data.append('redirectUrl', redirectUrl);
    if (imageFile) data.append('image', imageFile);

    setSaving(true);
    try {
      const response = isEditing
        ? await digitalProductAPI.update(product.id, data)
        : await digitalProductAPI.create(data);
      toast.success(isEditing ? 'Produk digital berhasil diperbarui' : 'Produk digital berhasil ditambahkan');
      onSuccess(response.data.data);
      onClose();
    } catch (requestError) {
      setError(requestError.response?.data?.errors?.[0]?.msg || requestError.response?.data?.message || 'Produk digital gagal disimpan. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const preview = imagePreview || getImageUrl(product?.imageUrl);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="digital-product-form-title"
      aria-describedby="digital-product-form-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!saving) onClose();
      }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-xl border border-ink-border bg-[#13151a] p-0 text-bone shadow-2xl backdrop:bg-black/70"
    >
      <div className="flex items-start justify-between gap-4 border-b border-ink-border p-5 sm:p-6">
        <div>
          <h2 id="digital-product-form-title" className="text-xl font-bold text-white sm:text-2xl">
            {isEditing ? 'Edit Produk Digital' : 'Tambah Produk Digital'}
          </h2>
          <p id="digital-product-form-description" className="mt-1 text-sm text-gray-400">
            Tampilkan informasi produk dan arahkan pembeli ke WhatsApp.
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon" aria-label="Tutup formulir produk digital" disabled={saving} onClick={onClose} className={`${BUTTON_FOCUS} min-w-[44px] shrink-0`}>
          <X className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6" aria-busy={saving}>
        {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

        <div className="space-y-2">
          <label htmlFor="digital-product-title" className="block text-sm font-medium text-gray-300">Judul produk <span className="text-red-400">*</span></label>
          <Input ref={titleInputRef} id="digital-product-title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={191} required disabled={saving} autoFocus className={INPUT_STYLES} />
        </div>

        <div className="space-y-2">
          <label htmlFor="digital-product-description" className="block text-sm font-medium text-gray-300">Deskripsi <span className="text-red-400">*</span></label>
          <textarea
            id="digital-product-description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={10000}
            rows={5}
            required
            disabled={saving}
            className={`block w-full resize-y rounded-lg border bg-ink-elevated px-3 py-2 text-sm text-bone transition-colors [overflow-wrap:anywhere] focus-visible:outline-none disabled:opacity-50 ${INPUT_STYLES}`}
          />
          <p className="text-xs text-gray-400">Deskripsi berupa teks biasa.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="digital-product-image" className="block text-sm font-medium text-gray-300">
            Foto produk {!isEditing && <span className="text-red-400">*</span>}
          </label>
          <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-ink-border bg-ink">
            {preview ? <img src={preview} alt="Pratinjau foto produk" className="h-full w-full object-contain" /> : <ImageIcon className="h-12 w-12 text-gray-600" aria-hidden="true" />}
          </div>
          <input
            id="digital-product-image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            disabled={saving}
            aria-describedby="digital-product-image-help digital-product-image-error"
            aria-invalid={Boolean(imageError)}
            className={`block w-full rounded-lg border bg-ink-elevated p-2 text-sm text-gray-300 file:mr-3 file:min-h-[44px] file:cursor-pointer file:rounded-md file:border-0 file:bg-arcane file:px-3 file:py-2 file:text-white focus-visible:outline-none disabled:opacity-50 ${INPUT_STYLES}`}
          />
          <p id="digital-product-image-help" className="text-xs text-gray-400">JPG, PNG, WEBP, atau GIF. Maksimal 5 MB.{isEditing && ' Biarkan kosong untuk menggunakan foto saat ini.'}</p>
          <p id="digital-product-image-error" role={imageError ? 'alert' : undefined} className="text-sm text-red-300">{imageError}</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="digital-product-whatsapp" className="block text-sm font-medium text-gray-300">Nomor WhatsApp <span className="text-red-400">*</span></label>
          <Input id="digital-product-whatsapp" name="whatsappNumber" type="tel" inputMode="tel" autoComplete="tel" value={whatsappNumber} onChange={(event) => setWhatsappNumber(event.target.value)} maxLength={32} placeholder="081222828282" required disabled={saving} aria-describedby="digital-product-whatsapp-help" className={INPUT_STYLES} />
          <p id="digital-product-whatsapp-help" className="text-xs text-gray-400">Masukkan nomor dengan awalan 08, 62, atau +62. Link WhatsApp dibuat otomatis.</p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-ink-border pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving} className={`${BUTTON_FOCUS} border-gray-500 hover:text-white`}>Batal</Button>
          <Button type="submit" disabled={saving || Boolean(imageError)} className={`${BUTTON_FOCUS} bg-arcane hover:border-arcane hover:bg-arcane/80`}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {saving ? 'Menyimpan...' : 'Simpan Produk'}
          </Button>
        </div>
      </form>
    </dialog>
  );
};

const DigitalProductModal = ({ isOpen, product, onClose, onSuccess }) => (
  isOpen ? <DigitalProductForm key={product?.id || 'new'} product={product} onClose={onClose} onSuccess={onSuccess} /> : null
);

export default DigitalProductModal;
