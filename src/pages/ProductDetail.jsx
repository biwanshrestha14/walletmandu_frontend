import { useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { money } from '../api';
import WalletVisual from '../components/WalletVisual';

export default function ProductDetail({ product, categories, status, onAdd }) {
  const returnUrl =
    new URLSearchParams(window.location.search).get('from') === 'home'
      ? '/#collection'
      : '/collection';
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${product?.name || 'Product details'} — WalletMandu`;
    return () => {
      document.title = previousTitle;
    };
  }, [product?.name]);

  return (
    <section className="product-detail container section-space">
      <a
        className="text-link collection-back"
        href={returnUrl}
      >
        <ArrowLeft size={16} /> Back to collection
      </a>
      {status === 'loading' ? (
        <div
          className="empty-state"
          role="status"
        >
          Loading product…
        </div>
      ) : !product ? (
        <div className="empty-state">
          <h1>
            {status === 'preview'
              ? 'Unable to load this product.'
              : 'Product not found.'}
          </h1>
          <p>
            {status === 'preview'
              ? 'The store is currently unavailable. Please try again shortly.'
              : 'This wallet may no longer be available. Explore the collection for more options.'}
          </p>
          {status === 'preview' && (
            <button
              className="button secondary"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          )}
        </div>
      ) : (
        <div className="product-detail-grid">
          <div className="product-detail-gallery">
            <WalletVisual product={product} />
          </div>
          <div className="product-detail-copy">
            <span className="eyebrow">
              {categories.find((category) => category.id === product.categoryId)
                ?.name || 'THE COLLECTION'}
            </span>
            <h1>{product.name}</h1>
            <p className="product-detail-price">{money(product.price)}</p>
            {product.description && (
              <p className="product-detail-description">
                {product.description}
              </p>
            )}
            {product.material && (
              <p className="muted">Material: {product.material}</p>
            )}
            <p className="product-detail-stock">
              {product.stock > 0 ? 'In stock' : 'Sold out'}
            </p>
            {product.preview && (
              <p className="muted">Preview item · sample price</p>
            )}
            <button
              className="button primary full-width"
              disabled={product.stock < 1}
              onClick={() => onAdd(product)}
            >
              {product.stock > 0 ? 'Add to bag' : 'Sold out'}{' '}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
