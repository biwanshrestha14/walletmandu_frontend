import { ArrowUpRight, MoveUpRight, Store } from 'lucide-react';
import Brand from '../Brand';

export default function Footer() {
  return (
    <footer>
      <div className="container footer-top">
        <div>
          <Brand light />
          <p>
            A little companion, every day.
            <br />
            Kathmandu spirit. Everyday simplicity.
          </p>
        </div>
        <div>
          <span className="eyebrow">TAKE A LOOK AROUND</span>
          <a href="/collection">
            The collection <MoveUpRight size={14} />
          </a>
          <a href="/#materials">
            Materials & details <MoveUpRight size={14} />
          </a>
          <a href="/#our-story">
            Our story <MoveUpRight size={14} />
          </a>
        </div>
        <div className="footer-note">
          <span lang="ne">नमस्ते।</span>
          <p>Glad you stopped by.</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} WALLETMANDU</span>
        <span>Nepal</span>
        <a
          className="store-location-link"
          href="https://maps.app.goo.gl/CeuouBRPsK2BU7rWA"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our store on Google Maps (opens in a new tab)"
        >
          <Store
            size={16}
            aria-hidden="true"
          />
          Visit our store
          <ArrowUpRight
            size={12}
            aria-hidden="true"
          />
        </a>
      </div>
    </footer>
  );
}
