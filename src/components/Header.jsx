import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Menu,
  Moon,
  Pause,
  Play,
  ShoppingBag,
  Sun,
  X,
} from 'lucide-react';

import Brand from './Brand';

const announcements = [
  'Based in Nepal. Made for your everyday.',
  'नमस्ते, welcome to WalletMandu',
  'Small essentials. Everyday stories.',
  'Free shipping on orders over NPR 3777.77',
];

export default function Header({ count, onCart }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [announcementsPaused, setAnnouncementsPaused] = useState(false);
  const [announcementHovered, setAnnouncementHovered] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'light',
  );

  useEffect(() => {
    const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
    let timer;
    function updateRotation() {
      clearInterval(timer);
      if (
        !motionPreference.matches &&
        !announcementsPaused &&
        !announcementHovered
      ) {
        timer = setInterval(() => {
          setAnnouncementIndex((index) => (index + 1) % announcements.length);
        }, 4000);
      }
    }
    updateRotation();
    motionPreference.addEventListener('change', updateRotation);
    return () => {
      clearInterval(timer);
      motionPreference.removeEventListener('change', updateRotation);
    };
  }, [announcementsPaused, announcementHovered]);

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.querySelector('meta[name="theme-color"]').content =
      nextTheme === 'dark' ? '#000000' : '#faf7f2';
    try {
      localStorage.setItem('walletmandu-theme', nextTheme);
    } catch {
      // The theme still works for this visit if storage is unavailable.
    }
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function toggleMenu() {
    setIsMenuOpen((wasOpen) => !wasOpen);
  }

  return (
    <>
      <div
        className="announcement"
        onMouseEnter={() => setAnnouncementHovered(true)}
        onMouseLeave={() => setAnnouncementHovered(false)}
      >
        <div
          className="announcement-window"
          aria-hidden="true"
        >
          {announcements.map((message, index) => (
            <span
              key={message}
              className={`announcement-message ${index === announcementIndex ? 'is-active' : index === (announcementIndex + announcements.length - 1) % announcements.length ? 'is-previous' : ''}`}
            >
              {message}
            </span>
          ))}
        </div>
        <span className="sr-only">{announcements.join(' ')}</span>
        <button
          className="announcement-toggle"
          onClick={() => setAnnouncementsPaused((paused) => !paused)}
          aria-label={
            announcementsPaused ? 'Play announcements' : 'Pause announcements'
          }
        >
          {announcementsPaused ? <Play size={12} /> : <Pause size={12} />}
        </button>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <Brand />

          <nav
            className={isMenuOpen ? 'main-nav is-open' : 'main-nav'}
            aria-label="Main navigation"
            id="main-menu"
          >
            <a
              href="/collection"
              onClick={closeMenu}
            >
              Shop wallets
            </a>

            <a
              href="/#materials"
              onClick={closeMenu}
            >
              The details
            </a>

            <a
              href="/#our-story"
              onClick={closeMenu}
            >
              Our story <ArrowUpRight size={13} />
            </a>
          </nav>

          <div className="header-actions">
            <button
              className="icon-button theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              className="bag-button"
              onClick={onCart}
              aria-label={`Open bag, ${count} items`}
            >
              <ShoppingBag size={20} />
              <span className="bag-label">Bag</span>
              {/* <span className="bag-count">{count}</span> */}
            </button>

            <button
              className="icon-button menu-toggle"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="main-menu"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
