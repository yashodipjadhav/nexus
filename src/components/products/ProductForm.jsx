import { useState, useEffect } from "react";
import { validateProduct } from "../../utils/validation";
import { getCategories } from "../../services/productApi";
import {
  Save,
  AlertCircle,
  Package,
  DollarSign,
  Boxes,
  Tag,
  FileText,
  Image as ImageIcon,
  Building2,
} from "lucide-react";

export default function ProductForm({
  initialData = null,
  onSubmit,
  submitting = false,
  onCancel,
}) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    price: initialData?.price ?? "",
    stock: initialData?.stock ?? "",
    brand: initialData?.brand || "",
    description: initialData?.description || "",
    thumbnail:
      initialData?.thumbnail ||
      initialData?.images?.[0] ||
      "",
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    let mounted = true;
    getCategories()
      .then((cats) => {
        if (mounted) setCategories(cats);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validateProduct(form);
    if (validationErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = validateProduct(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setTouched({
        title: true,
        price: true,
        stock: true,
        category: true,
        description: true,
      });
      return;
    }

    await onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      thumbnail:
        form.thumbnail.trim() ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(errors).length > 0 && Object.values(errors).some(Boolean) && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Please fix the highlighted errors below:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-red-600">
              {Object.entries(errors)
                .filter(([, msg]) => Boolean(msg))
                .map(([field, msg]) => (
                  <li key={field}>{msg}</li>
                ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Product Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Package className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Wireless Noise Canceling Headphones Pro"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.title && touched.title
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20"
                  : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600"
              }`}
            />
          </div>
          {errors.title && touched.title && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 appearance-none cursor-pointer transition-all capitalize ${
                errors.category && touched.category
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20"
                  : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600"
              }`}
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {errors.category && touched.category && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Brand Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Apple, Sony, Samsung"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Price (USD $) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={form.price}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. 299.99"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.price && touched.price
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20"
                  : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600"
              }`}
            />
          </div>
          {errors.price && touched.price && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Inventory Stock Units <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Boxes className="w-4 h-4" />
            </div>
            <input
              type="number"
              step="1"
              min="0"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. 50"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.stock && touched.stock
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20"
                  : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600"
              }`}
            />
          </div>
          {errors.stock && touched.stock && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.stock}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Thumbnail Image URL (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <input
              type="url"
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Leave blank to use automatic high-resolution product demo image.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Product Description <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
              <FileText className="w-4 h-4" />
            </div>
            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Provide a detailed description of the product features, specs, and benefits..."
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.description && touched.description
                  ? "border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20"
                  : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600"
              }`}
            />
          </div>
          {errors.description && touched.description && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving Product...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {initialData ? "Update Product" : "Save Product"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
