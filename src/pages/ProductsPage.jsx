import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { PlusCircle, RefreshCw } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import ProductStats from "../components/products/ProductStats";
import ProductFilters from "../components/products/ProductFilters";
import ProductTable from "../components/products/ProductTable";
import ProductCard from "../components/products/ProductCard";
import ProductPagination from "../components/products/ProductPagination";
import DeleteDialog from "../components/products/DeleteDialog";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

import useDebounce from "../hooks/useDebounce";
import { useToast } from "../context/ToastContext";
import {
  deleteProduct,
  getCategories,
  getProducts,
} from "../services/productApi";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const rawPage = searchParams.get("page");
  const rawLimit = searchParams.get("limit");
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlSort = searchParams.get("sort") || "";

  const parsedPage = parseInt(rawPage, 10);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const parsedLimit = parseInt(rawLimit, 10);
  const limit = [10, 20, 50].includes(parsedLimit) ? parsedLimit : 10;

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestIdRef = useRef(0);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const updateURL = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      updateURL({
        search: debouncedSearch.trim(),
        page: 1,
      });
    }
  }, [debouncedSearch, urlSearch, updateURL]);

  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((data) => {
        if (isMounted) setCategories(data);
      })
      .catch((err) => {
        console.error("Failed to load product categories:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const loadProducts = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    const controller = new AbortController();

    setLoading(true);
    setError("");

    try {
      let sortBy = "";
      let order = "asc";
      if (urlSort) {
        const parts = urlSort.split("-");
        sortBy = parts[0];
        order = parts[1] || "asc";
      }

      const skip = (page - 1) * limit;

      const data = await getProducts({
        limit,
        skip,
        search: urlSearch,
        category: urlCategory,
        sortBy,
        order,
        signal: controller.signal,
      });

      if (currentRequestId === requestIdRef.current) {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        return;
      }

      if (currentRequestId === requestIdRef.current) {
        setError(
          err.response?.data?.message ||
            "Unable to retrieve products. Please check your internet connection and try again."
        );
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }

    return () => {
      controller.abort();
    };
  }, [page, limit, urlSearch, urlCategory, urlSort]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCategoryChange = (cat) => {
    updateURL({ category: cat, page: 1 });
  };

  const handleSortChange = (sortVal) => {
    updateURL({ sort: sortVal, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    updateURL({ page: newPage });
  };

  const handleLimitChange = (newLimit) => {
    updateURL({ limit: newLimit, page: 1 });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTotal((prev) => Math.max(0, prev - 1));
      showToast(`Product "${deleteTarget.title}" deleted successfully.`, "success");
      setDeleteTarget(null);
    } catch (err) {
      showToast("Failed to delete product. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Products Catalog
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage inventory, view details, search, filter, and modify products.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadProducts()}
              title="Refresh product list"
              className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-2xs hover:shadow-xs active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
            </button>

            <Link
              to="/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Add Product
            </Link>
          </div>
        </div>

        <ProductStats
          total={total}
          categoriesCount={categories.length}
          products={products}
        />

        <ProductFilters
          search={searchInput}
          setSearch={setSearchInput}
          category={urlCategory}
          setCategory={handleCategoryChange}
          sort={urlSort}
          setSort={handleSortChange}
          categories={categories}
          isSearching={loading && Boolean(searchInput)}
          onReset={handleResetFilters}
        />

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
            <Loader message="Fetching products catalog..." />
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
            <ErrorMessage message={error} onRetry={() => loadProducts()} />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No products matched your search"
            description="We couldn't find any products with your current search query or category filter. Try refining your keywords or clearing the filters."
            onClearFilters={handleResetFilters}
          />
        ) : (
          <div className="space-y-4">
            <div className="hidden md:block">
              <ProductTable products={products} onDelete={(p) => setDeleteTarget(p)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={(p) => setDeleteTarget(p)}
                />
              ))}
            </div>

            <ProductPagination
              currentPage={page}
              limit={limit}
              total={total}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </div>
        )}

        <DeleteDialog
          isOpen={Boolean(deleteTarget)}
          product={deleteTarget}
          isDeleting={isDeleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </DashboardLayout>
  );
}
