import { AlertTriangle, Trash2, X } from "lucide-react";
import { useEffect } from "react";

export default function DeleteDialog({
  isOpen,
  product,
  isDeleting = false,
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-slate-900">Delete Product?</h3>
          <p className="mt-1 text-sm text-slate-500">
            Are you sure you want to permanently delete this product? This action will remove it from the catalog.
          </p>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <img
              src={product.thumbnail || product.images?.[0]}
              alt={product.title}
              className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-200 p-1 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{product.title}</p>
              <p className="text-xs text-slate-500">
                ${product.price} • Stock: {product.stock}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Confirm Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
