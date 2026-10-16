import { useCallback, useEffect, useRef, useState } from 'react';
import { Edit2, ExternalLink, Image as ImageIcon, Loader2, Package, Plus, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import DigitalProductModal from '../../components/admin/DigitalProductModal';
import { digitalProductAPI } from '../../lib/api';
import { getImageUrl } from '../../lib/utils';

const BUTTON_FOCUS = 'min-h-[44px] text-white focus-visible:ring-2 focus-visible:ring-white';
const PRIMARY_BUTTON = `${BUTTON_FOCUS} bg-arcane hover:border-arcane hover:bg-arcane/80`;
const OUTLINE_BUTTON = `${BUTTON_FOCUS} border-gray-500 hover:text-white`;
const DELETE_BUTTON = 'min-h-[44px] border-red-400/60 text-red-300 hover:text-red-200 focus-visible:ring-2 focus-visible:ring-white';

const DeleteProductDialog = ({ product, onClose, onDeleted }) => {
  const dialogRef = useRef(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
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

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    setError('');
    try {
      await digitalProductAPI.delete(product.id);
      toast.success('Produk digital berhasil dihapus');
      onDeleted(product.id);
    } catch (requestError) {
      setError(requestError.response?.data?.errors?.[0]?.msg || requestError.response?.data?.message || 'Produk digital gagal dihapus. Silakan coba lagi.');
      setDeleting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-digital-product-title"
      aria-describedby="delete-digital-product-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!deleting) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-ink-border bg-[#13151a] p-6 text-bone shadow-2xl backdrop:bg-black/70"
    >
      <h2 id="delete-digital-product-title" className="text-xl font-bold text-white">Hapus Produk Digital</h2>
      <p id="delete-digital-product-description" className="mt-3 text-sm leading-relaxed text-gray-400 [overflow-wrap:anywhere]">Hapus produk &quot;{product.title}&quot;? Produk akan dihapus dari katalog.</p>
      {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-3" aria-busy={deleting}>
        <Button type="button" variant="outline" onClick={onClose} disabled={deleting} autoFocus className={OUTLINE_BUTTON}>Batal</Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting} className={DELETE_BUTTON}>
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
          {deleting ? 'Menghapus...' : 'Hapus Produk'}
        </Button>
      </div>
    </dialog>
  );
};

const DigitalProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const requestRef = useRef(0);
  const createButtonRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError('');
    try {
      const response = await digitalProductAPI.getAll();
      if (requestId === requestRef.current) setProducts(response.data.data || []);
    } catch (requestError) {
      if (requestId === requestRef.current) setError(requestError.response?.data?.errors?.[0]?.msg || requestError.response?.data?.message || 'Produk digital gagal dimuat. Silakan coba lagi.');
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    return () => { requestRef.current += 1; };
  }, [fetchProducts]);

  const handleCreate = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleSaved = (product) => {
    if (!product?.id) {
      fetchProducts();
      return;
    }
    setProducts((current) => current.some((item) => item.id === product.id)
      ? current.map((item) => item.id === product.id ? product : item)
      : [product, ...current]);
  };

  const handleDeleted = (id) => {
    setDeletingProduct(null);
    setProducts((current) => current.filter((product) => product.id !== id));
    requestAnimationFrame(() => createButtonRef.current?.focus());
  };

  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = products.filter((product) => `${product.title} ${product.description}`.toLowerCase().includes(query));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-arcane/30 bg-arcane/10 text-arcane"><Package className="h-5 w-5" aria-hidden="true" /></div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Produk Digital</h1>
          </div>
          <p className="text-sm text-gray-400">Kelola judul, deskripsi, foto, dan nomor WhatsApp produk digital.</p>
        </div>
        <Button ref={createButtonRef} type="button" onClick={handleCreate} disabled={loading} className={PRIMARY_BUTTON}><Plus className="h-4 w-4" aria-hidden="true" />Tambah Produk</Button>
      </div>

      <Card className="border-white/[0.06] bg-[#111318]">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="relative w-full sm:max-w-md">
            <label htmlFor="digital-product-search" className="sr-only">Cari produk digital</label>
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" aria-hidden="true" />
            <Input id="digital-product-search" type="search" placeholder="Cari judul atau deskripsi..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="min-h-[44px] border-gray-500 pl-10 placeholder:text-bone-muted focus-visible:border-gray-400 focus-visible:ring-2 focus-visible:ring-white" />
          </div>
          {!loading && !error && <p className="shrink-0 text-sm text-gray-400" aria-live="polite">{query ? `${filteredProducts.length} dari ${products.length}` : products.length} produk</p>}
        </CardContent>
      </Card>

      {loading ? (
        <div role="status" className="flex min-h-64 flex-col items-center justify-center gap-3 text-gray-400"><Loader2 className="h-8 w-8 animate-spin text-arcane" aria-hidden="true" /><p>Memuat produk digital...</p></div>
      ) : error ? (
        <Card className="border-red-500/20 bg-[#111318]"><CardContent className="space-y-4 p-6 text-center"><p role="alert" className="text-sm text-red-300">{error}</p><Button type="button" variant="outline" onClick={fetchProducts} className={OUTLINE_BUTTON}>Coba Lagi</Button></CardContent></Card>
      ) : filteredProducts.length === 0 ? (
        <div className="py-14 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-600" aria-hidden="true" />
          <h2 className="text-lg font-medium text-gray-300">{query ? 'Produk tidak ditemukan' : 'Belum ada produk digital'}</h2>
          <p className="mb-6 mt-2 text-sm text-gray-400">{query ? 'Coba kata kunci lain atau hapus pencarian.' : 'Tambahkan produk pertama untuk ditampilkan di katalog.'}</p>
          <Button type="button" variant={query ? 'outline' : 'default'} onClick={query ? () => setSearchQuery('') : handleCreate} className={query ? OUTLINE_BUTTON : PRIMARY_BUTTON}>{query ? 'Hapus Pencarian' : 'Tambah Produk'}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex min-w-0 flex-col overflow-hidden border-white/[0.06] bg-[#111318]">
              <div className="aspect-video overflow-hidden bg-white/[0.03]">
                {product.imageUrl ? <img src={getImageUrl(product.imageUrl)} alt={product.title} className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center"><ImageIcon className="h-10 w-10 text-gray-600" aria-hidden="true" /></div>}
              </div>
              <CardContent className="flex flex-1 flex-col p-5">
                <h2 className="text-lg font-bold text-white [overflow-wrap:anywhere]">{product.title}</h2>
                <p className="mb-4 mt-2 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-gray-400 [overflow-wrap:anywhere]">{product.description}</p>
                <a href={product.redirectUrl} target="_blank" rel="noopener noreferrer" className="mb-5 inline-flex min-h-[44px] w-fit max-w-full items-center gap-2 rounded text-sm text-arcane hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label={`Buka link tujuan ${product.title}`}><ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="truncate">Buka link tujuan</span></a>
                <div className="mt-auto flex gap-2 border-t border-ink-border pt-4">
                  <Button type="button" variant="outline" size="sm" className={`flex-1 ${OUTLINE_BUTTON}`} onClick={() => { setSelectedProduct(product); setShowModal(true); }} aria-label={`Edit produk ${product.title}`}><Edit2 className="h-4 w-4" aria-hidden="true" />Edit</Button>
                  <Button type="button" variant="destructive" size="sm" onClick={() => setDeletingProduct(product)} aria-label={`Hapus produk ${product.title}`} className={DELETE_BUTTON}><Trash2 className="h-4 w-4" aria-hidden="true" />Hapus</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DigitalProductModal isOpen={showModal} product={selectedProduct} onClose={() => setShowModal(false)} onSuccess={handleSaved} />
      {deletingProduct && <DeleteProductDialog product={deletingProduct} onClose={() => setDeletingProduct(null)} onDeleted={handleDeleted} />}
    </div>
  );
};

export default DigitalProductsPage;
