import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Dialog from './Dialog';
import WalletVisual from './WalletVisual';
import { money } from '../api';

export default function Cart({ items, onChange, onClose }) {
  return (
    <Dialog
      title="Your bag"
      onClose={onClose}
      drawer
    >
      {!items.length ? (
        <div className="empty-state">
          <ShoppingBag size={36} />
          <h3>A little room for something good.</h3>
          <p>Your bag is empty. Find your everyday companion.</p>
          <button
            className="button primary"
            onClick={onClose}
          >
            Explore the collection
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div
                className="cart-item"
                key={item.id}
              >
                <div className="cart-art">
                  <WalletVisual
                    product={item}
                    carousel={false}
                  />
                </div>
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>{money(item.price)}</p>
                  <div className="quantity">
                    <button
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() => onChange(item.id, item.qty - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button
                      aria-label={`Increase ${item.name} quantity`}
                      disabled={item.qty >= item.stock}
                      onClick={() => onChange(item.id, item.qty + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button
                  className="icon-button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => onChange(item.id, 0)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span>Subtotal</span>
            <strong>
              {money(
                items.reduce((total, item) => total + item.price * item.qty, 0),
              )}
            </strong>
          </div>
          <p className="muted">
            All prices in Nepalese rupees. Online checkout is not available yet;
            your bag is saved on this device.
          </p>
          <button
            className="button primary full-width"
            onClick={onClose}
          >
            Continue exploring
          </button>
        </>
      )}
    </Dialog>
  );
}
