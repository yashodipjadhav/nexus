import api from "./axios";
import {
  applyOverlayToProduct,
  getAddedProducts,
  getDeletedProductIds,
  getLocalProductById,
  getUpdatedProducts,
  saveAddedProduct,
  saveDeletedProduct,
  saveUpdatedProduct,
} from "./localProductStore";

/**
 * Normalizes categories response (DummyJSON returns array of objects {slug, name, url} or array of strings)
 */
export const getCategories = async () => {
  const response = await api.get("/products/categories");
  const data = response.data;
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    if (typeof item === "string") {
      return {
        slug: item,
        name: item.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      };
    }
    return {
      slug: item.slug || item.name,
      name: item.name || item.slug,
    };
  });
};

/**
 * Fetches products list with support for search, category filter, pagination, and sorting.
 * Also seamlessly overlays client-persisted mock CRUD items.
 */
export const getProducts = async ({
  limit = 10,
  skip = 0,
  search = "",
  category = "",
  sortBy = "",
  order = "asc",
  delay = 0,
  signal,
}) => {
  const deletedIds = getDeletedProductIds();
  const addedProducts = getAddedProducts();
  const updatedMap = getUpdatedProducts();

  let apiProducts = [];
  let apiTotal = 0;

  // Case 1: Both Search and Category are active
  if (category && search) {
    const params = new URLSearchParams();
    params.append("limit", "150"); // Fetch all within category
    if (delay) params.append("delay", String(delay));

    const response = await api.get(
      `/products/category/${encodeURIComponent(category)}?${params.toString()}`,
      { signal }
    );

    const allCatProducts = response.data.products || [];
    const query = search.toLowerCase().trim();

    let filtered = allCatProducts.filter(
      (p) =>
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
    );

    const matchingAdded = addedProducts.filter(
      (p) =>
        p.category?.toLowerCase() === category.toLowerCase() &&
        (p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query))
    );

    let combined = [...matchingAdded, ...filtered]
      .filter((p) => !deletedIds.includes(Number(p.id)))
      .map((p) => (updatedMap[Number(p.id)] ? { ...p, ...updatedMap[Number(p.id)] } : p));

    if (sortBy) {
      combined.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (typeof valA === "string") {
          return order === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        return order === "asc" ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
      });
    }

    const paginated = combined.slice(skip, skip + limit);
    return {
      products: paginated,
      total: combined.length,
      skip,
      limit,
      isCombinedFilter: true,
    };
  }

  // Case 2: Only Search is active
  if (search) {
    const params = new URLSearchParams();
    params.append("q", search);
    params.append("limit", String(limit));
    params.append("skip", String(skip));
    if (sortBy) {
      params.append("sortBy", sortBy);
      params.append("order", order);
    }
    if (delay) params.append("delay", String(delay));

    const response = await api.get(`/products/search?${params.toString()}`, { signal });
    apiProducts = response.data.products || [];
    apiTotal = response.data.total || 0;

    const query = search.toLowerCase().trim();
    const matchingAdded = addedProducts.filter(
      (p) =>
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
    );

    let processed = [...matchingAdded, ...apiProducts]
      .filter((p) => !deletedIds.includes(Number(p.id)))
      .map((p) => (updatedMap[Number(p.id)] ? { ...p, ...updatedMap[Number(p.id)] } : p));

    return {
      products: processed.slice(0, limit),
      total: Math.max(0, apiTotal + matchingAdded.length - deletedIds.length),
      skip,
      limit,
      isCombinedFilter: false,
    };
  }

  // Case 3: Only Category is active
  if (category) {
    const params = new URLSearchParams();
    params.append("limit", String(limit));
    params.append("skip", String(skip));
    if (sortBy) {
      params.append("sortBy", sortBy);
      params.append("order", order);
    }
    if (delay) params.append("delay", String(delay));

    const response = await api.get(
      `/products/category/${encodeURIComponent(category)}?${params.toString()}`,
      { signal }
    );
    apiProducts = response.data.products || [];
    apiTotal = response.data.total || 0;

    const matchingAdded = addedProducts.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );

    let processed = [...matchingAdded, ...apiProducts]
      .filter((p) => !deletedIds.includes(Number(p.id)))
      .map((p) => (updatedMap[Number(p.id)] ? { ...p, ...updatedMap[Number(p.id)] } : p));

    return {
      products: processed.slice(0, limit),
      total: Math.max(0, apiTotal + matchingAdded.length - deletedIds.length),
      skip,
      limit,
      isCombinedFilter: false,
    };
  }

  // Case 4: Default / Normal pagination & sorting
  const params = new URLSearchParams();
  params.append("limit", String(limit));
  params.append("skip", String(skip));
  if (sortBy) {
    params.append("sortBy", sortBy);
    params.append("order", order);
  }
  if (delay) params.append("delay", String(delay));

  const response = await api.get(`/products?${params.toString()}`, { signal });
  apiProducts = response.data.products || [];
  apiTotal = response.data.total || 0;

  let combinedList = skip === 0 ? [...addedProducts, ...apiProducts] : apiProducts;

  let processed = combinedList
    .filter((p) => !deletedIds.includes(Number(p.id)))
    .map((p) => (updatedMap[Number(p.id)] ? { ...p, ...updatedMap[Number(p.id)] } : p));

  const effectiveTotal = Math.max(0, apiTotal + addedProducts.length - deletedIds.length);

  return {
    products: processed.slice(0, limit),
    total: effectiveTotal,
    skip,
    limit,
    isCombinedFilter: false,
  };
};

/**
 * Fetch a single product by ID (handles DummyJSON fetch + local overlay checks)
 */
export const getProductById = async (id, signal) => {
  const numId = Number(id);
  const deletedIds = getDeletedProductIds();
  if (deletedIds.includes(numId)) {
    throw new Error("Product not found (deleted).");
  }

  const localProduct = getLocalProductById(id);
  if (localProduct && localProduct.id === numId && !localProduct.apiOriginal) {
    return localProduct;
  }

  try {
    const response = await api.get(`/products/${id}`, { signal });
    const product = response.data;
    if (!product || !product.id) {
      throw new Error("Product not found.");
    }
    return applyOverlayToProduct(product);
  } catch (error) {
    if (localProduct) return localProduct;
    throw error;
  }
};

/**
 * Add a new product (calls DummyJSON POST /products/add and persists in local overlay store)
 */
export const addProduct = async (productData) => {
  try {
    const response = await api.post("/products/add", productData);
    const apiResult = response.data;
    const persisted = saveAddedProduct({
      ...productData,
      ...apiResult,
      id: apiResult.id || Date.now(),
    });
    return persisted;
  } catch (error) {
    const persisted = saveAddedProduct({
      ...productData,
      id: Date.now(),
    });
    return persisted;
  }
};

/**
 * Update an existing product (calls DummyJSON PUT /products/:id and persists in local overlay store)
 */
export const updateProduct = async (id, updatedData) => {
  try {
    const response = await api.put(`/products/${id}`, updatedData);
    const apiResult = response.data;
    const persisted = saveUpdatedProduct(id, { ...updatedData, ...apiResult });
    return persisted;
  } catch (error) {
    const persisted = saveUpdatedProduct(id, updatedData);
    return persisted;
  }
};

/**
 * Delete a product (calls DummyJSON DELETE /products/:id and registers in local overlay store)
 */
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    saveDeletedProduct(id);
    return response.data;
  } catch (error) {
    saveDeletedProduct(id);
    return { id, isDeleted: true };
  }
};
