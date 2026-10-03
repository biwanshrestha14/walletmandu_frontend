import { ArrowUpRight } from 'lucide-react';
import { previewProducts } from '../../data';
import WalletVisual from '../WalletVisual';

export default function HeroSection({ products, status }) {
  const featuredProducts = products.filter(
    (product) => product.featuredimage === true && product.coverImageUrl,
  );
  const featuredProduct = featuredProducts[0] || previewProducts[0];
  return (
    <section className="hero container">
      <div className="hero-copy">
        <div className="eyebrow">
          <span /> SMALL ESSENTIALS. EVERYDAY STORIES.
        </div>
        <h1>
          Carry a little
          <br />
          <em>better.</em>
        </h1>
        <p>
          For the morning chiya, the ride across town, and everything in
          between. Find a wallet that feels like you.
        </p>
        <a
          className="button primary"
          href="#collection"
        >
          Shop Now <ArrowUpRight size={19} />
        </a>
        <div className="hero-footnote">
          <span className="nepali">सानो साथी, हरेक दिन।</span>
          <span>A little companion, every day.</span>
        </div>
      </div>
      <div className="hero-visual">
        {featuredProducts.length > 0 || status === 'preview' ? (
          <WalletVisual
            product={featuredProduct}
            hero
            featuredProducts={featuredProducts}
          />
        ) : (
          <div className="empty-state">Featured collection coming soon.</div>
        )}
        <div className="hero-product-label">
          <div>
            <span>MEET YOUR EVERYDAY</span>
            <h2>
              {featuredProducts.length > 0
                ? 'Featured collection'
                : status === 'preview'
                  ? featuredProduct.name
                  : 'Our collection'}
            </h2>
          </div>
          <a
            href="#collection"
            className="round-link"
            aria-label="Explore wallets"
          >
            <ArrowUpRight size={23} />
          </a>
        </div>
      </div>
    </section>
  );
}
