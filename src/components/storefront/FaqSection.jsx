export default function FaqSection() {
  return (
    <section className="faq container">
      <h2>A few helpful details.</h2>

      <div>
        {[
          [
            'What material are your wallets made from?',
            'Our wallets are made from 100% pure leather.',
          ],
          [
            'Do your wallets come with a warranty?',
            'Yes, our wallets come with a one-year warranty covering leather discoloration, stitching, and button issues. The warranty does not cover physical damage.',
          ],
          ['Where are you located?', 'We’re located in Hattiban, Lalitpur.'],
          [
            'Is cash on delivery available?',
            'Yes, cash on delivery is available. For orders inside the valley, an advance payment of NPR 200–500 is required to confirm your order. For orders outside the valley, the confirmation advance is NPR 500.',
          ],
          [
            'Can I exchange a wallet if I change my mind?',
            'We’re unable to offer exchanges if you simply change your mind. However, if you receive a damaged piece, we’ll exchange it for the same product.',
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span>+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
