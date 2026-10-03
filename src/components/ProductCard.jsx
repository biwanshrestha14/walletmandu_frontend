import { ArrowUpRight, Plus } from 'lucide-react';
import { money } from '../api';
import WalletVisual from './WalletVisual';

export default function ProductCard({
  product,
  category,
  onAdd,
  fromHome = false,
}) {
  const params = new URLSearchParams();
  if (product.preview) params.set('preview', '1');
  if (fromHome) params.set('from', 'home');
  const query = params.toString();
  const productUrl = `/products/${encodeURIComponent(product.id)}${query ? `?${query}` : ''}`;
  return (
    <article className="product-card">
      <a
        className="product-image-button"
        href={productUrl}
        aria-label={`View ${product.name}`}
      >
        <WalletVisual
          product={product}
          carousel={false}
        />
        <span className="view-product">
          <ArrowUpRight size={19} />
        </span>
        {product.stock < 1 && <span className="stock-badge">Sold out</span>}
      </a>
      <div className="product-meta">
        <span>{category || 'Everyday essentials'}</span>
        <span>{product.material || 'WalletMandu'}</span>
      </div>
      <div className="product-title-row">
        <h3>
          <a href={productUrl}>{product.name}</a>
        </h3>
        <button
          className="product-add"
          onClick={() => onAdd(product)}
          disabled={product.stock < 1}
          aria-label={`Add ${product.name} to bag`}
        >
          <Plus size={20} />
        </button>
      </div>
      <p className="product-price">{money(product.price)}</p>
    </article>
  );
}
