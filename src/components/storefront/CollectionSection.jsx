import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { money } from '../../api';
import ProductCard from '../ProductCard';

export default function CollectionSection({
  products,
  categories,
  status,
  isCollectionPage,
  onAdd,
}) {
  const [collectionParams] = useState(
    () => new URLSearchParams(window.location.search),
  );
  const [filter, setFilter] = useState(
    collectionParams.get('category') || 'all',
  );
  const [search, setSearch] = useState(collectionParams.get('search') || '');
  const [sort, setSort] = useState(collectionParams.get('sort') || 'featured');
  const [priceRange, setPriceRange] = useState([0, null]);
  const priceCeiling = Math.max(0, ...products.map((product) => product.price));
  const minimumPrice = Math.min(priceRange[0], priceCeiling);
  const maximumPrice = Math.max(
    minimumPrice,
    Math.min(priceRange[1] ?? priceCeiling, priceCeiling),
  );
  function resetFilters() {
    setFilter('all');
    setSearch('');
    setSort('featured');
    setPriceRange([0, null]);
  }
  const collectionUrl = `/collection?${new URLSearchParams({ category: filter, search, sort })}`;
  const filteredProducts = products
    .filter(
      (product) =>
        (filter === 'all' || product.categoryId === filter) &&
        (!isCollectionPage ||
          (product.price >= minimumPrice && product.price <= maximumPrice)) &&
        `${product.name} ${product.description || ''}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((firstProduct, secondProduct) => {
      if (sort === 'low') return firstProduct.price - secondProduct.price;
      if (sort === 'high') return secondProduct.price - firstProduct.price;
      return 0;
    });
  const visibleProducts = isCollectionPage
    ? filteredProducts
    : filteredProducts.slice(0, 6);
  const CollectionHeading = isCollectionPage ? 'h1' : 'h2';
  return (
    <section
      id="collection"
      className="collection container section-space"
    >
      {isCollectionPage && (
        <a
          className="text-link collection-back"
          href="/"
        >
          ← Back to home
        </a>
      )}
      <div className="section-top">
        <div>
          <span className="eyebrow">THE COLLECTION</span>
          <CollectionHeading>
            {isCollectionPage
              ? 'Find your everyday.'
              : 'A place for your essentials.'}
          </CollectionHeading>
        </div>
        <p>
          Different days. Different pockets.
          <br />
          One less thing to think about.
        </p>
      </div>
      <div className="collection-toolbar">
        <div
          className="category-tabs"
          aria-label="Filter by category"
        >
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
          >
            All wallets <span>{products.length}</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={filter === category.id ? 'active' : ''}
              aria-pressed={filter === category.id}
              onClick={() => setFilter(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <label className="sort-control">
          <SlidersHorizontal size={16} />
          <span className="sr-only">Sort products</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>
      {isCollectionPage && (
        <fieldset className="price-filter">
          <legend>Shop by budget</legend>
          <div className="price-filter-heading">
            <output aria-live="polite">
              {money(minimumPrice)} – {money(maximumPrice)}
            </output>
            <button
              className="text-link"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          </div>
          <div className="price-sliders">
            <label>
              <span>
                Minimum price <strong>{money(minimumPrice)}</strong>
              </span>
              <input
                type="range"
                aria-label="Minimum price"
                aria-valuetext={money(minimumPrice)}
                min="0"
                max={priceCeiling || 1}
                step="100"
                value={minimumPrice}
                disabled={!priceCeiling}
                onChange={(event) =>
                  setPriceRange([
                    Math.min(Number(event.target.value), maximumPrice),
                    priceRange[1],
                  ])
                }
              />
            </label>
            <label>
              <span>
                Maximum price <strong>{money(maximumPrice)}</strong>
              </span>
              <input
                type="range"
                aria-label="Maximum price"
                aria-valuetext={money(maximumPrice)}
                min="0"
                max={priceCeiling || 1}
                step="100"
                value={maximumPrice}
                disabled={!priceCeiling}
                onChange={(event) =>
                  setPriceRange([
                    minimumPrice,
                    Math.max(Number(event.target.value), minimumPrice),
                  ])
                }
              />
            </label>
          </div>
        </fieldset>
      )}
      <div className="catalog-meta">
        <span>
          {status === 'preview'
            ? 'Preview collection · Sample NPR prices. Live store is currently unavailable.'
            : status === 'loading'
              ? 'Gathering the collection…'
              : `${visibleProducts.length} of ${filteredProducts.length} wallets`}
        </span>
        <label className="search-field">
          <Search size={16} />
          <span className="sr-only">Search wallets</span>
          <input
            placeholder="Find a wallet"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      {status === 'loading' ? (
        <div
          className="empty-state"
          role="status"
        >
          Loading wallets…
        </div>
      ) : filteredProducts.length ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              fromHome={!isCollectionPage}
              category={
                categories.find(
                  (category) => category.id === product.categoryId,
                )?.name
              }
              onAdd={onAdd}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>
            {products.length
              ? 'Nothing here just yet.'
              : 'The collection is on its way.'}
          </h3>
          <p>
            {products.length
              ? 'Try another category, search, or price range.'
              : 'Check back soon for our latest wallets.'}
          </p>
          {products.length > 0 && (
            <button
              className="text-link"
              onClick={resetFilters}
            >
              See all wallets <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
      {!isCollectionPage && products.length > 6 && (
        <div className="collection-view-all">
          <a
            className="button primary"
            href={collectionUrl}
          >
            View all wallets <ArrowUpRight size={18} />
          </a>
        </div>
      )}
    </section>
  );
}
