import { useState } from "react";
import { ImageIcon, MessageCircle, ExternalLink } from "lucide-react";
import { Card } from "./ui/Card";
import { getImageUrl } from "../lib/utils";

const DigitalProductCard = ({ product }) => {
  const [imageFailed, setImageFailed] = useState(false);
  let contactUrl = null;
  try {
    const url = new URL(product.redirectUrl);
    if (["http:", "https:"].includes(url.protocol)) contactUrl = url;
  } catch {
    // Invalid links are not rendered as interactive controls.
  }
  const isWhatsApp = contactUrl && (
    contactUrl.hostname === "wa.me" ||
    contactUrl.hostname === "whatsapp.com" ||
    contactUrl.hostname.endsWith(".whatsapp.com")
  );
  const ContactIcon = isWhatsApp ? MessageCircle : ExternalLink;

  return (
    <Card className="flex min-w-0 flex-col overflow-hidden border-ink-border bg-ink-elevated">
      <div className="flex aspect-[16/10] items-center justify-center bg-ink">
        {product.imageUrl && !imageFailed ? (
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm text-bone-muted">
            <ImageIcon className="h-8 w-8" aria-hidden="true" />
            Foto tidak tersedia
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="break-words text-xl font-semibold text-white [overflow-wrap:anywhere]">
          {product.title}
        </h3>
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-bone-muted [overflow-wrap:anywhere]">
          {product.description}
        </p>
        <div className="mt-auto pt-6">
          {contactUrl ? (
            <a
              href={contactUrl.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${isWhatsApp ? "Pesan via WhatsApp" : "Hubungi penjual"}: ${product.title} (tab baru)`}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-arcane bg-arcane px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-arcane/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <ContactIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {isWhatsApp ? "Pesan via WhatsApp" : "Hubungi penjual"}
            </a>
          ) : (
            <p className="text-sm text-bone-muted">Tautan pemesanan belum tersedia.</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DigitalProductCard;
