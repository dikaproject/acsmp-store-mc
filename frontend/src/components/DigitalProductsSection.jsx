import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Package, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import DigitalProductCard from "./DigitalProductCard";
import { digitalProductAPI } from "../lib/api";

const DigitalProductsSection = ({ compact = false }) => {
  const headingId = useId();
  const searchId = useId();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    digitalProductAPI.getAll({ signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) setProducts(data.data || []);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [requestVersion]);

  const retry = () => {
    setError(false);
    setLoading(true);
    setRequestVersion((version) => version + 1);
  };
  const search = query.trim().toLocaleLowerCase("id");
  const filteredProducts = products.filter((product) =>
    `${product.title} ${product.description}`.toLocaleLowerCase("id").includes(search)
  );
  const visibleProducts = compact ? filteredProducts.slice(0, 3) : filteredProducts;
  const Heading = compact ? "h2" : "h1";

  return (
    <section
      id="digital-products"
      aria-labelledby={headingId}
      className={`bg-ink ${compact ? "border-y border-ink-border py-16 md:py-24" : "min-h-[60vh] py-12 md:py-20"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mb-8 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Heading id={headingId} className={`font-display font-bold leading-tight text-white ${compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"}`}>
              Produk <span className="text-arcane-glow">Digital</span>
            </Heading>
            <p className="mt-4 text-base leading-relaxed text-bone-muted">
              Lihat produk digital AmazingCraft dan hubungi kami untuk pemesanan.
            </p>
          </div>
          {compact && (
            <Link
              to="/digital-products"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-gray-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:border-arcane-glow hover:text-arcane-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Lihat semua produk
            </Link>
          )}
        </div>

        {!compact && (
          <div className="mb-8 max-w-xl">
            <label htmlFor={searchId} className="mb-2 block text-sm font-medium text-bone">Cari produk digital</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-bone-muted" aria-hidden="true" />
              <Input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari berdasarkan judul atau deskripsi..."
                className="min-h-12 border-gray-500 pl-11 placeholder:text-bone-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              />
            </div>
          </div>
        )}

        {loading ? (
          <div role="status" className="flex min-h-48 items-center justify-center gap-3 text-bone-muted">
            <Loader2 className="h-6 w-6 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Memuat produk digital...
          </div>
        ) : error ? (
          <div role="alert" className="rounded-xl border border-ink-border bg-ink-elevated px-6 py-12 text-center">
            <p className="mb-4 text-bone">Produk digital gagal dimuat. Silakan coba lagi.</p>
            <Button onClick={retry} className="min-h-11 text-white hover:bg-arcane/80 focus-visible:ring-white">Coba lagi</Button>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div role="status" className="rounded-xl border border-ink-border bg-ink-elevated px-6 py-12 text-center">
            <Package className="mx-auto mb-4 h-9 w-9 text-bone-muted" aria-hidden="true" />
            <p className="font-medium text-bone">
              {search ? "Produk tidak ditemukan" : "Belum ada produk digital"}
            </p>
            <p className="mt-2 text-sm text-bone-muted">
              {search ? "Coba kata kunci lain untuk menemukan produk." : "Produk digital akan tampil di sini setelah ditambahkan."}
            </p>
            {search && (
              <Button onClick={() => setQuery("")} variant="outline" className="mt-5 min-h-11 border-gray-500 focus-visible:ring-white">Hapus pencarian</Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => <DigitalProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default DigitalProductsSection;
