import { Suspense } from "react";

// Fallback while a code-split page chunk downloads. Kept tiny and static (no
// framer-motion) so it shows instantly; layouts keep the navbar/sidebar visible.
export const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Memuat halaman">
    <div className="w-8 h-8 rounded-full border-2 border-arcane/20 border-t-arcane animate-spin" />
  </div>
);

const PageSuspense = ({ children }) => <Suspense fallback={<PageLoader />}>{children}</Suspense>;

export default PageSuspense;
