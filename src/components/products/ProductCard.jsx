import { useNavigate } from "react-router-dom";
import { Eye, Edit3, Trash2, Star, ImageIcon } from "lucide-react";
import { formatCurrency, formatRating, getStockStatus } from "../../utils/formatters";
import { useState } from "react";

export default function ProductCard({ product, onDelete }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const stockStatus = getStockStatus(product.stock);
  const thumbnailSrc = !imageError && (product.thumbnail || product.images?.[0]);

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
    >
      <div>
        <div className="relative w-full h-44 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center mb-3">
          {thumbnailSrc ? (
            <img
              src={thumbnailSrc}
              alt={product.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
              loading="lazy"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-slate-300" />
          )}

          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white/90 text-slate-700 border border-slate-200/80 backdrop-blur-xs capitalize shadow-xs">
              {product.category?.replace("-", " ") || "General"}
            </span>
          </div>

          {product.discountPercentage > 0 && (
            <div className="absolute top-2 right-2">
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                -{Math.round(product.discountPercentage)}%
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {product.title}
            </h3>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900">
                {formatCurrency(product.price)}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="font-semibold text-slate-800">
                {formatRating(product.rating)}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${stockStatus.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${stockStatus.dotClass}`}></span>
              {stockStatus.label}
            </span>
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-2 pt-3 border-t border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => navigate(`/products/${product.id}`)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>

        <button
          onClick={() => navigate(`/products/${product.id}?edit=true`)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 rounded-xl transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </button>

        <button
          onClick={() => onDelete(product)}
          className="p-2 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition-colors"
          title="Delete product"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
