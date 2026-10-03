import { ArrowDown } from 'lucide-react';

export default function StorySection() {
  return (
    <section
      className="story container section-space"
      id="our-story"
    >
      <div>
        <h2>
          The things we carry
          <br />
          become part of our story.
        </h2>
        <p>
          A folded note. A favourite photograph. The card you reach for every
          morning. We believe the small things deserve a little thought, too.
        </p>
        <p>
          WalletMandu is a Nepal-based company with a simple idea: everyday
          essentials should feel good to carry, and easy to make your own.
        </p>
        <a
          className="text-link"
          href="#collection"
        >
          Find your companion <ArrowDown size={17} />
        </a>
      </div>
      <div className="saath">
        <span className="eyebrow">FROM NEPAL, WITH INTENTION</span>
        <span
          className="story-nepali"
          lang="ne"
        >
          आफ्नै साथ।
        </span>
      </div>
    </section>
  );
}
