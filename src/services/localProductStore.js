const STORAGE_KEY_ADDED = "app_products_added";
const STORAGE_KEY_UPDATED = "app_products_updated";
const STORAGE_KEY_DELETED = "app_products_deleted";

/**
 * Safe local storage reader
 */
const getStorageItem = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Safe local storage writer
 */
const setStorageItem = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save to localStorage for key: ${key}`, error);
  }
};

export const getAddedProducts = () => getStorageItem(STORAGE_KEY_ADDED, []);
export const getUpdatedProducts = () => getStorageItem(STORAGE_KEY_UPDATED, {});
export const getDeletedProductIds = () => getStorageItem(STORAGE_KEY_DELETED, []);

export const saveAddedProduct = (product) => {
  const added = getAddedProducts();
  const newProduct = {
    ...product,
    id: product.id || Date.now(),
    thumbnail: product.thumbnail || product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    rating: product.rating || 5.0,
    reviews: product.reviews || [
      {
        rating: 5,
        comment: "Newly added product into admin dashboard!",
        date: new Date().toISOString(),
        reviewerName: "Admin User",
        reviewerEmail: "admin@example.com",
      },
    ],
  };
  added.unshift(newProduct);
  setStorageItem(STORAGE_KEY_ADDED, added);
  return newProduct;
};

export const saveUpdatedProduct = (id, updatedFields) => {
  const numId = Number(id);
  const added = getAddedProducts();
  const addedIndex = added.findIndex((p) => Number(p.id) === numId);
  if (addedIndex !== -1) {
    added[addedIndex] = { ...added[addedIndex], ...updatedFields };
    setStorageItem(STORAGE_KEY_ADDED, added);
    return added[addedIndex];
  }

  const updatedMap = getUpdatedProducts();
  updatedMap[numId] = {
    ...(updatedMap[numId] || {}),
    ...updatedFields,
    id: numId,
  };
  setStorageItem(STORAGE_KEY_UPDATED, updatedMap);
  return updatedMap[numId];
};

export const saveDeletedProduct = (id) => {
  const numId = Number(id);
  const added = getAddedProducts();
  const filteredAdded = added.filter((p) => Number(p.id) !== numId);
  if (filteredAdded.length !== added.length) {
    setStorageItem(STORAGE_KEY_ADDED, filteredAdded);
  }

  const deleted = getDeletedProductIds();
  if (!deleted.includes(numId)) {
    deleted.push(numId);
    setStorageItem(STORAGE_KEY_DELETED, deleted);
  }
};

export const getLocalProductById = (id) => {
  const numId = Number(id);
  const deleted = getDeletedProductIds();
  if (deleted.includes(numId)) return null;

  const added = getAddedProducts();
  const foundInAdded = added.find((p) => Number(p.id) === numId);
  if (foundInAdded) {
    return foundInAdded;
  }

  const updatedMap = getUpdatedProducts();
  return updatedMap[numId] || null;
};

export const applyOverlayToProduct = (product) => {
  if (!product) return null;
  const numId = Number(product.id);
  const deleted = getDeletedProductIds();
  if (deleted.includes(numId)) return null;

  const updatedMap = getUpdatedProducts();
  if (updatedMap[numId]) {
    return { ...product, ...updatedMap[numId] };
  }
  return product;
};

export const clearLocalData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY_ADDED);
  localStorage.removeItem(STORAGE_KEY_UPDATED);
  localStorage.removeItem(STORAGE_KEY_DELETED);
};
