import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import WalletVisual from '../WalletVisual';

const materials = [
  {
    name: 'PU leather',
    title: 'A softer side to the everyday.',
    text: 'A smooth finish and an understated look. Our PU leather collection brings a familiar wallet shape to your daily routine.',
    tone: 'cognac',
  },
  {
    name: 'Ballistic nylon',
    title: 'For days that take you further.',
    text: 'A textured weave with a practical feel. Explore nylon wallets for a more casual everyday carry.',
    tone: 'dark',
  },
  {
    name: 'Recycled polyester',
    title: 'Keep things light.',
    text: 'Simple shapes and lightweight fabric. Discover the card sleeves in our recycled polyester collection.',
    tone: 'olive',
  },
  {
    name: 'PVC',
    title: 'Everything in its place.',
    text: 'An easy-to-carry format for notes, cards and travel essentials. A practical companion for your next journey.',
    tone: 'sand',
  },
];

export default function MaterialsSection() {
  const [activeMaterialIndex, setActiveMaterialIndex] = useState(0);
  return (
    <section
      className="materials-section"
      id="materials"
    >
      <div className="container materials-grid">
        <div className="material-art">
          <WalletVisual
            carousel={false}
            product={{
              tone: materials[activeMaterialIndex].tone,
              name: materials[activeMaterialIndex].name,
            }}
          />
          <span className="material-note">FORM, FEEL & THE FINER DETAILS</span>
        </div>
        <div className="material-copy">
          <span className="eyebrow">GOOD THINGS ARE IN THE DETAILS</span>
          <h2>{materials[activeMaterialIndex].title}</h2>
          <div
            className="material-tabs"
            aria-label="Explore materials"
          >
            {materials.map((material, index) => (
              <button
                key={material.name}
                aria-pressed={index === activeMaterialIndex}
                className={index === activeMaterialIndex ? 'active' : ''}
                onClick={() => setActiveMaterialIndex(index)}
              >
                {material.name}
              </button>
            ))}
          </div>
          <p>{materials[activeMaterialIndex].text}</p>
          <a
            href="#collection"
            className="text-link"
          >
            Explore the collection <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
