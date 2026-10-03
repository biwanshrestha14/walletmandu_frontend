export default function StoreNotice({ message, onDismiss }) {
  return (
    <div
      className="notice"
      role="status"
    >
      {message}
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  );
}
