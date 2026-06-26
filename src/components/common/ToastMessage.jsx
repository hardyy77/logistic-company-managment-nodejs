export default function ToastMessage({ type = "success", message, onClose }) {
  if (!message) return null;

  const styles =
    type === "error"
      ? "border-destructive bg-destructive text-white"
      : "border-[#3ba55d] bg-[#2f4538] text-[#d3f8df]";

  return (
    <div className={`pointer-events-auto min-w-[300px] max-w-[420px] rounded-md border px-4 py-3 shadow-lg shadow-black/20 ${styles}`}>
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
