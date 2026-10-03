import { useEffect, useState } from 'react';
import { api } from '../api';
import { previewCategories, previewProducts } from '../data';
import Header from '../components/Header';
import Cart from '../components/Cart';
import HeroSection from '../components/storefront/HeroSection';
import ValuesStrip from '../components/storefront/ValuesStrip';
import CollectionSection from '../components/storefront/CollectionSection';
import MaterialsSection from '../components/storefront/MaterialsSection';
import StorySection from '../components/storefront/StorySection';
import FaqSection from '../components/storefront/FaqSection';
import Footer from '../components/storefront/Footer';
import ProductDetail from './ProductDetail';
import StoreNotice from '../components/storefront/StoreNotice';

const productRoute = window.location.pathname.match(/^\/products\/([^/]+)\/?$/);
const isPreviewRequest =
  new URLSearchParams(window.location.search).get('preview') === '1';
const productId = productRoute
  ? (() => {
      try {
        return decodeURIComponent(productRoute[1]);
      } catch {
        return null;
      }
    })()
  : null;

const isCollectionPage = /^\/collection\/?$/.test(window.location.pathname);

function readBag() {
  try {
    const value = JSON.parse(localStorage.getItem('walletmandu-bag') || '[]');
    return Array.isArray(value)
      ? value.filter(
          (product) =>
            product &&
            typeof product.id === 'string' &&
            typeof product.name === 'string' &&
            Number.isFinite(product.price) &&
            Number.isInteger(product.qty) &&
            product.qty > 0 &&
            product.qty <= product.stock,
        )
      : [];
  } catch {
    return [];
  }
}
export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [bag, setBag] = useState(readBag);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([api('/products'), api('/category')])
      .then(([loadedProducts, loadedCategories]) => {
        if (!Array.isArray(loadedProducts) || !Array.isArray(loadedCategories))
          throw new Error('Invalid catalog');
        if (active) {
          setProducts(
            loadedProducts
              .filter((item) => item.isActive)
              .map((item) => ({ ...item, price: Number(item.price) })),
          );
          setCategories(loadedCategories);
          setStatus('live');
        }
      })
      .catch(() => {
        if (active) {
          setProducts(previewProducts);
          setCategories(previewCategories);
          setStatus('preview');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('walletmandu-bag', JSON.stringify(bag));
    } catch {
      setNotice(
        'Your browser could not save this bag. It will last for this visit only.',
      );
    }
  }, [bag]);

  const addToBag = (product) => {
    if (product.stock < 1) return;

    setBag((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...product, qty: Math.min(item.qty + 1, product.stock) }
            : item,
        );
      }

      return [...currentItems, { ...product, qty: 1 }];
    });

    setIsCartOpen(true);
  };

  const updateBagQuantity = (productId, quantity) => {
    setBag((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, qty: Math.min(quantity, item.stock) }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  return (
    <>
      <a
        className="skip-link"
        href="#main"
      >
        Skip to content
      </a>
      <Header
        count={bag.reduce((sum, product) => sum + product.qty, 0)}
        onCart={() => setIsCartOpen(true)}
      />
      <main id="main">
        {productRoute ? (
          <ProductDetail
            product={
              status === 'preview' && !isPreviewRequest
                ? undefined
                : products.find((product) => String(product.id) === productId)
            }
            categories={categories}
            status={status}
            onAdd={addToBag}
          />
        ) : (
          <>
            {!isCollectionPage && (
              <>
                <HeroSection
                  products={products}
                  status={status}
                />
                <ValuesStrip />
              </>
            )}
            <CollectionSection
              products={products}
              categories={categories}
              status={status}
              isCollectionPage={isCollectionPage}
              onAdd={addToBag}
            />
            {!isCollectionPage && (
              <>
                <MaterialsSection />
                <StorySection />
                <FaqSection />
              </>
            )}
          </>
        )}
      </main>
      <Footer />
      {notice && (
        <StoreNotice
          message={notice}
          onDismiss={() => setNotice('')}
        />
      )}
      {isCartOpen && (
        <Cart
          items={bag}
          onClose={() => setIsCartOpen(false)}
          onChange={updateBagQuantity}
        />
      )}
    </>
  );
}
