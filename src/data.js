// Preview content only. Live products and their NPR prices come from the API.
export const previewCategories = [
  { id: 'bifold', name: 'Bifolds' },
  { id: 'cardholder', name: 'Cardholders' },
  { id: 'trifold', name: 'Trifolds' },
  { id: 'travel', name: 'Travel wallets' },
];
export const previewProducts = [
  {
    id: 'apex',
    name: 'Apex Minimalist Bifold',
    categoryId: 'bifold',
    price: 2400,
    description:
      'A clean, compact fold with room for your daily cards and notes.',
    tone: 'cognac',
    material: 'PU leather',
  },
  {
    id: 'heritage',
    name: 'Heritage Monogram Bifold',
    categoryId: 'bifold',
    price: 2800,
    description: 'A familiar silhouette, considered down to the last stitch.',
    tone: 'dark',
    material: 'PU leather',
  },
  {
    id: 'vanguard',
    name: 'Vanguard Card Sleeve',
    categoryId: 'cardholder',
    price: 1600,
    description: 'Just the essentials. A slim companion for lighter days.',
    tone: 'olive',
    material: 'Recycled polyester',
  },
  {
    id: 'nomad',
    name: 'Nomad Travel Folio',
    categoryId: 'travel',
    price: 3200,
    description: 'Keep your passport, notes and cards together on the move.',
    tone: 'sand',
    material: 'PVC',
  },
  {
    id: 'tactix',
    name: 'Tactix Ballistic Trifold',
    categoryId: 'trifold',
    price: 2600,
    description:
      'A practical three-fold design for the things you carry every day.',
    tone: 'dark',
    material: 'Ballistic nylon',
  },
  {
    id: 'komorebi',
    name: 'Komorebi Heritage Trifold',
    categoryId: 'trifold',
    price: 2450,
    description: 'Extra room, a soft finish and an easy everyday shape.',
    tone: 'cognac',
    material: 'PU leather',
  },
].map((p) => ({ ...p, stock: 20, isActive: true, preview: true }));
