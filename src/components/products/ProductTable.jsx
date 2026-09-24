import { useNavigate } from "react-router-dom";
import { Eye, Edit3, Trash2, Star, ImageIcon } from "lucide-react";
import { formatCurrency, formatRating, getStockStatus } from "../../utils/formatters";
import { useState } from "react";

export default function ProductTable({ products = [], onDelete }) {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 pl-6 pr-4">Product</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Stock Status</th>
              <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              const hasImageError = imageErrors[product.id];
              const thumbnailSrc =
                !hasImageError && (product.thumbnail || product.images?.[0]);

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {/* Product Info */}
                  <td className="py-3.5 pl-6 pr-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/60 overflow-hidden shrink-0 flex items-center justify-center">
                        {thumbnailSrc ? (
                          <img
                            src={thumbnailSrc}
                            alt={product.title}
                            onError={() => handleImageError(product.id)}
                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 max-w-xs sm:max-w-sm">
                        <p className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {product.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {product.brand ? `${product.brand} • ` : ""}
                          ID: #{product.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                      {product.category?.replace("-", " ") || "General"}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-[11px] font-medium text-emerald-600">
                          {Math.round(product.discountPercentage)}% OFF
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                      </div>
                      <span className="font-semibold text-slate-800 text-xs">
                        {formatRating(product.rating)}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({product.reviews?.length || 0})
                      </span>
                    </div>
                  </td>

                  {/* Stock Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${stockStatus.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${stockStatus.dotClass}`}></span>
                      {stockStatus.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 pl-4 pr-6 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        title="View Details"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => navigate(`/products/${product.id}?edit=true`)}
                        title="Edit Product"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(product)}
                        title="Delete Product"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
