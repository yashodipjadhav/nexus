import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import ProductForm from "../components/products/ProductForm";
import { useToast } from "../context/ToastContext";
import { addProduct } from "../services/productApi";

export default function NewProductPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (productData) => {
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const created = await addProduct(productData);
      showToast(
        `Product "${created.title || productData.title}" created successfully!`,
        "success"
      );
      navigate("/products");
    } catch (err) {
      console.error("Add product error:", err);
      setError("Failed to create product. Please try again.");
      showToast("Unable to create product.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products Catalog
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="mb-6 pb-4 border-b border-slate-100 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Add New Product
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter product details to add a new item into the inventory database.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Catalog Entry</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <ProductForm
            onSubmit={handleSubmit}
            submitting={submitting}
            onCancel={() => navigate("/products")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
