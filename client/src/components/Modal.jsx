function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 hover:bg-gray-200"
        >
          ✖
        </button>
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}

export default Modal;