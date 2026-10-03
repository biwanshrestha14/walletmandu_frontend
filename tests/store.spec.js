import { test, expect } from '@playwright/test';

const category = {
  id: 'bifold',
  name: 'Bifolds',
  createdAt: '2026-01-01T00:00:00Z',
};
const products = [
  {
    id: 'apex',
    name: 'Apex Bifold',
    description: 'An everyday companion.',
    categoryId: 'bifold',
    price: '2400.00',
    stock: 2,
    isActive: true,
  },
  {
    id: 'travel',
    name: 'Travel Folio',
    description: 'For the road.',
    categoryId: 'travel',
    price: '3200.00',
    stock: 3,
    isActive: true,
  },
  {
    id: 'sold-out',
    name: 'Card Sleeve',
    categoryId: 'bifold',
    price: '1600.00',
    stock: 0,
    isActive: true,
  },
  {
    id: 'hidden',
    name: 'Unpublished Wallet',
    price: '100.00',
    stock: 5,
    isActive: false,
  },
];

async function mockCatalog(page) {
  await page.route('**/api/category', (route) =>
    route.fulfill({
      json: [category, { id: 'travel', name: 'Travel wallets' }],
    }),
  );
  await page.route('**/api/products', (route) =>
    route.fulfill({ json: products }),
  );
}

async function expectNoOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

test('catalog filters, search, sorting, and distinct bag items work', async ({
  page,
}) => {
  await mockCatalog(page);
  await page.goto('/');
  await expect(page.locator('.product-card')).toHaveCount(3);
  await expect(page.getByText('Unpublished Wallet')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Add Card Sleeve to bag' }),
  ).toBeDisabled();

  await page
    .getByRole('button', { name: 'Travel wallets', exact: true })
    .click();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('button', { name: /All wallets/ }).click();
  await page.getByLabel('Search wallets').fill('apex');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByLabel('Search wallets').fill('');
  await page.getByLabel('Sort products').selectOption('low');
  await expect(page.locator('.product-card').first()).toContainText(
    'Card Sleeve',
  );

  await page.getByRole('button', { name: 'Add Apex Bifold to bag' }).click();
  await expect(page.getByRole('dialog', { name: 'Your bag' })).toBeVisible();
  await page
    .getByRole('button', { name: 'Increase Apex Bifold quantity' })
    .click();
  await expect(
    page.getByRole('button', { name: 'Increase Apex Bifold quantity' }),
  ).toBeDisabled();
  await expect(page.locator('.cart-total')).toContainText('Rs. 4,800');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Add Travel Folio to bag' }).click();
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await expect(page.locator('.cart-total')).toContainText('Rs. 8,000');
  await page.reload();
  await page.getByRole('button', { name: 'Open bag, 3 items' }).click();
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await page.getByRole('button', { name: 'Remove Apex Bifold' }).click();
  await expect(page.locator('.cart-total')).toContainText('Rs. 3,200');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expectNoOverflow(page);
});

test('product detail page, material selection, and mobile navigation work', async ({
  page,
}, testInfo) => {
  await mockCatalog(page);
  await page.goto('/');
  await page
    .getByRole('link', { name: 'View Apex Bifold', exact: true })
    .click();
  await expect(page).toHaveURL(/\/products\/apex\?from=home$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Apex Bifold' }),
  ).toBeVisible();
  await expect(page.getByText('An everyday companion.')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Apex Bifold' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Your bag' })).toContainText(
    'Apex Bifold',
  );
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await expectNoOverflow(page);
  await page.getByRole('link', { name: 'Back to collection' }).click();
  await expect(page).toHaveURL(/\/#collection$/);
  await page
    .getByRole('button', { name: 'Ballistic nylon', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'For days that take you further.' }),
  ).toBeVisible();

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('link', { name: 'Shop wallets', exact: true }).click();
    await expect(
      page.getByRole('button', { name: 'Open menu' }),
    ).toHaveAttribute('aria-expanded', 'false');
  }
  await expectNoOverflow(page);
});

test('API failure labels previews; an empty live catalog is not replaced', async ({
  page,
}) => {
  await page.route('**/api/**', (route) =>
    route.fulfill({ status: 503, json: { message: 'Unavailable' } }),
  );
  await page.goto('/');
  await expect(page.getByText(/Preview collection/)).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(6);
  await page.screenshot({
    path: `test-results/storefront-${test.info().project.name}.png`,
    fullPage: true,
  });
  await expectNoOverflow(page);

  await page.unroute('**/api/**');
  await page.route('**/api/**', (route) => route.fulfill({ json: [] }));
  await page.reload();
  await expect(page.getByText('The collection is on its way.')).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(0);
});

test('landing carousel uses featured images from active products', async ({
  page,
}) => {
  await mockCatalog(page);
  await page.route('**/api/products', (route) =>
    route.fulfill({
      json: products.map((product) => ({
        ...product,
        featuredimage: product.id !== 'travel',
        coverImageUrl: `https://images.example/${product.id}.jpg`,
      })),
    }),
  );
  await page.goto('/');
  await expect(page.locator('.hero .wallet-gallery-image')).toHaveCount(2);
  await expect(
    page.locator('.hero .wallet-gallery-image').first(),
  ).toHaveAttribute('src', 'https://images.example/apex.jpg');
  await expect(
    page.locator('.hero .wallet-gallery-image[src*="hidden"]'),
  ).toHaveCount(0);
});

test('products with the featured toggle off are excluded from the hero', async ({
  page,
}) => {
  await mockCatalog(page);
  await page.goto('/');
  await expect(
    page.getByText('Featured collection coming soon.'),
  ).toBeVisible();
  await expect(page.locator('.hero .wallet-gallery-image')).toHaveCount(0);
  await expect(page.locator('.product-card')).toHaveCount(3);
});

test('theme follows initial system preference and remembers a manual choice', async ({
  page,
}, testInfo) => {
  await mockCatalog(page);
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.screenshot({
    path: `test-results/theme-dark-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await expectNoOverflow(page);
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.screenshot({
    path: `test-results/theme-light-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await expectNoOverflow(page);
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await page.getByRole('button', { name: 'Add Apex Bifold to bag' }).click();
  await expect(page.getByRole('dialog', { name: 'Your bag' })).toHaveCSS(
    'background-color',
    'rgb(0, 0, 0)',
  );
});

test('announcements rotate upward, pause, and use a light bar in dark mode', async ({
  page,
}) => {
  await mockCatalog(page);
  await page.clock.install();
  await page.emulateMedia({
    colorScheme: 'dark',
    reducedMotion: 'no-preference',
  });
  await page.goto('/');
  const active = page.locator('.announcement-message.is-active');
  await expect(active).toHaveText('Based in Nepal. Made for your everyday.');
  await expect(page.locator('.announcement')).toHaveCSS(
    'background-color',
    'rgb(250, 247, 242)',
  );
  await expect(page.locator('.site-header')).toHaveCSS(
    'backdrop-filter',
    'blur(20px) saturate(1.4)',
  );
  await page.clock.fastForward(4100);
  await expect(active).toHaveText('नमस्ते, welcome to WalletMandu');
  await page.getByRole('button', { name: 'Pause announcements' }).click();
  await page.mouse.move(0, 400);
  await page.clock.fastForward(8100);
  await expect(active).toHaveText('नमस्ते, welcome to WalletMandu');
  await page.getByRole('button', { name: 'Play announcements' }).click();
  await page.mouse.move(0, 400);
  await page.clock.fastForward(4100);
  await expect(active).toHaveText('Small essentials. Everyday stories.');
  await page.clock.fastForward(4100);
  await expect(active).toHaveText('Based in Nepal. Made for your everyday.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(
    page.getByRole('button', { name: 'Pause announcements' }),
  ).toBeHidden();
  await page.clock.fastForward(8100);
  await expect(active).toHaveText('Based in Nepal. Made for your everyday.');
  await expectNoOverflow(page);
});

test('landing caps the collection at six and View all opens a dedicated catalog', async ({
  page,
}) => {
  await mockCatalog(page);
  const largeCatalog = Array.from({ length: 9 }, (_, index) => ({
    ...products[0],
    id: `wallet-${index}`,
    name: `Wallet ${index + 1}`,
    price: String(1000 + index * 100),
  }));
  await page.route('**/api/products', (route) =>
    route.fulfill({ json: largeCatalog }),
  );
  await page.goto('/');
  await expect(page.locator('.product-card')).toHaveCount(6);
  await expect(page.getByText('6 of 9 wallets')).toBeVisible();
  await page.getByLabel('Sort products').selectOption('high');
  await page.getByRole('link', { name: 'View all wallets' }).click();
  await expect(page).toHaveURL(/\/collection\?/);
  await expect(page.locator('.hero')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Find your everyday.' }),
  ).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(9);
  await expect(page.locator('.product-card').first()).toContainText('Wallet 9');
  await page.reload();
  await expect(page.locator('.product-card')).toHaveCount(9);
  await page.getByRole('button', { name: 'Add Wallet 9 to bag' }).click();
  await expect(page.getByRole('dialog', { name: 'Your bag' })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('link', { name: 'Back to home' }).click();
  await expect(
    page.getByRole('button', { name: 'Open bag, 1 items' }),
  ).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(6);
  await expectNoOverflow(page);
});

test('budget sliders compose with category, search, and sorting and can be reset', async ({
  page,
}) => {
  await mockCatalog(page);
  await page.goto('/collection');
  await expect(page.locator('.product-card')).toHaveCount(3);
  await page
    .getByRole('slider', { name: 'Minimum price', exact: true })
    .fill('2000');
  await page
    .getByRole('slider', { name: 'Maximum price', exact: true })
    .fill('3000');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card')).toContainText('Apex Bifold');
  await page
    .getByRole('button', { name: 'Travel wallets', exact: true })
    .click();
  await expect(page.getByText('Nothing here just yet.')).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.locator('.product-card')).toHaveCount(3);
  await page.getByLabel('Search wallets').fill('folio');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByLabel('Search wallets').fill('');
  await page.getByLabel('Sort products').selectOption('high');
  await expect(page.locator('.product-card').first()).toContainText(
    'Travel Folio',
  );
  await page
    .getByRole('slider', { name: 'Maximum price', exact: true })
    .fill('1600');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card')).toContainText('Card Sleeve');
  await page
    .getByRole('slider', { name: 'Minimum price', exact: true })
    .fill('2000');
  await expect(
    page.getByRole('slider', { name: 'Minimum price', exact: true }),
  ).toHaveValue('1600');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expectNoOverflow(page);
});

test('product routes support collection links, sold-out products, and missing products', async ({
  page,
}) => {
  await mockCatalog(page);
  await page.goto('/collection');
  await page.getByRole('link', { name: 'Card Sleeve', exact: true }).click();
  await expect(page).toHaveURL(/\/products\/sold-out$/);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Sold out' })).toBeDisabled();
  await page.getByRole('link', { name: 'Back to collection' }).click();
  await expect(page).toHaveURL(/\/collection$/);
  await page.goto('/products/hidden');
  await expect(
    page.getByRole('heading', { name: 'Product not found.' }),
  ).toBeVisible();
  await page.goto('/products/nonexistent');
  await expect(
    page.getByRole('heading', { name: 'Product not found.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Add to bag', exact: true }),
  ).toHaveCount(0);
  await page.route('**/api/**', (route) =>
    route.fulfill({ status: 503, json: {} }),
  );
  await page.goto('/products/apex');
  await expect(
    page.getByRole('heading', { name: 'Unable to load this product.' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
});
