import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Edit3,
  Trash2,
  Calendar,
  User,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import ProductForm from "../components/products/ProductForm";
import DeleteDialog from "../components/products/DeleteDialog";
import Loader from "../components/common/Loader";
import { useToast } from "../context/ToastContext";
import { formatCurrency, formatRating, getStockStatus } from "../utils/formatters";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "../services/productApi";

export default function ProductDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const isEditMode = searchParams.get("edit") === "true";

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getProductById(params.id, controller.signal);
        if (!data || !data.id) {
          throw new Error("Product not found.");
        }
        if (isMounted) {
          setProduct(data);
          setSelectedImage(data.thumbnail || data.images?.[0] || "");
        }
      } catch (err) {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
        if (isMounted) {
          setError(
            err.response?.status === 404
              ? "Product not found in catalog."
              : err.message || "Failed to load product details."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [params.id]);

  const handleUpdate = async (updatedFields) => {
    if (submitting) return;

    setSubmitting(true);
    try {
      const result = await updateProduct(params.id, updatedFields);
      setProduct((prev) => ({ ...prev, ...result, ...updatedFields }));
      setSelectedImage(
        updatedFields.thumbnail || result.thumbnail || product?.thumbnail || ""
      );
      showToast("Product updated successfully!", "success");
      navigate(`/products/${params.id}`);
    } catch (err) {
      showToast("Failed to update product. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      showToast(`Product "${deleteTarget.title}" was deleted.`, "success");
      navigate("/products", { replace: true });
    } catch (err) {
      showToast("Failed to delete product.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 shadow-xs min-h-96 flex items-center justify-center">
          <Loader message="Loading product specifications & reviews..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs my-8">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            {error || `We couldn't locate any product with ID #${params.id}. It may have been removed or does not exist.`}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Products Catalog
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail].filter(Boolean);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products Catalog
          </Link>

          <div className="flex items-center gap-2">
            {!isEditMode ? (
              <>
                <button
                  onClick={() => navigate(`/products/${params.id}?edit=true`)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-all shadow-2xs active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  Edit Product
                </button>
                <button
                  onClick={() => setDeleteTarget(product)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/60 rounded-xl transition-all active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(`/products/${params.id}`)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs"
              >
                Cancel Editing
              </button>
            )}
          </div>
        </div>

        {isEditMode ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Edit Product: {product.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update pricing, inventory, descriptions, and category tags.
              </p>
            </div>
            <ProductForm
              initialData={product}
              onSubmit={handleUpdate}
              submitting={submitting}
              onCancel={() => navigate(`/products/${params.id}`)}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-4">
                  <div className="w-full h-80 sm:h-96 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 overflow-hidden relative group">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-slate-300" />
                    )}
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        {Math.round(product.discountPercentage)}% DISCOUNT
                      </div>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(img)}
                          className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-slate-50 p-1 shrink-0 transition-all ${
                            selectedImage === img
                              ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.title} view ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
                        {product.category?.replace("-", " ") || "General"}
                      </span>
                      {product.brand && (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          Brand: {product.brand}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-lg text-xs font-medium text-slate-400">
                        SKU: {product.sku || `PRD-${product.id}`}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      {product.title}
                    </h1>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-400 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                        <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                        <span className="font-bold text-slate-800 text-sm">
                          {formatRating(product.rating)}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        Based on {product.reviews?.length || 0} customer reviews
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-sm font-medium text-slate-400 line-through">
                          {formatCurrency(
                            product.price / (1 - product.discountPercentage / 100)
                          )}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${stockStatus.badgeClass}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${stockStatus.dotClass}`}></span>
                        {stockStatus.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        Availability: {product.availabilityStatus || "Standard Delivery"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Description
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{product.warrantyInformation || "1 Year Warranty"}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700">
                      <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{product.shippingInformation || "Fast Shipping"}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700">
                      <RotateCcw className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{product.returnPolicy || "30-Day Free Returns"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Customer Reviews ({product.reviews?.length || 0})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified user reviews and feedback
                  </p>
                </div>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                            {review.reviewerName?.charAt(0) || <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">
                              {review.reviewerName}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {review.reviewerEmail}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, starIdx) => (
                            <Star
                              key={starIdx}
                              className={`w-3.5 h-3.5 ${
                                starIdx < Math.round(review.rating)
                                  ? "fill-amber-400 stroke-amber-400"
                                  : "stroke-slate-300 fill-slate-100"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 italic">
                        "{review.comment}"
                      </p>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No customer reviews recorded yet.</p>
              )}
            </div>
          </div>
        )}

        <DeleteDialog
          isOpen={Boolean(deleteTarget)}
          product={deleteTarget}
          isDeleting={isDeleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
