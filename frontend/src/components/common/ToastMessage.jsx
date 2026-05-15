export default function ToastMessage({ type = "success", message, onClose }) {
  if (!message) return null;

  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-green-200 bg-green-50 text-green-800";

  return (
    <div
      className={`pointer-events-auto min-w-[320px] max-w-[420px] rounded-xl border px-4 py-3 shadow-lg ${styles}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm font-medium">{message}</div>
        <button
          onClick={onClose}
          className="text-xs opacity-70 transition hover:opacity-100"
          type="button"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
}