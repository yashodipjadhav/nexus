/**
 * Validates product form input data
 * @param {Object} product
 * @returns {Object} map of field errors
 */
export const validateProduct = (product) => {
  const errors = {};

  // Title validation
  if (!product.title || !product.title.trim()) {
    errors.title = "Product title is required.";
  } else if (product.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters long.";
  }

  // Price validation
  if (product.price === "" || product.price === null || product.price === undefined) {
    errors.price = "Price is required.";
  } else {
    const numPrice = Number(product.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      errors.price = "Price must be a positive number greater than 0.";
    }
  }

  // Stock validation
  if (product.stock === "" || product.stock === null || product.stock === undefined) {
    errors.stock = "Stock quantity is required.";
  } else {
    const numStock = Number(product.stock);
    if (isNaN(numStock) || numStock < 0 || !Number.isInteger(numStock)) {
      errors.stock = "Stock must be a non-negative whole integer.";
    }
  }

  // Category validation
  if (!product.category || !product.category.trim()) {
    errors.category = "Category selection is required.";
  }

  // Description validation
  if (!product.description || !product.description.trim()) {
    errors.description = "Product description is required.";
  } else if (product.description.trim().length < 10) {
    errors.description = "Description should be at least 10 characters.";
  }

  return errors;
};

/**
 * Validates login form input
 * @param {string} username
 * @param {string} password
 * @returns {Object} map of field errors
 */
export const validateLogin = (username, password) => {
  const errors = {};

  if (!username || !username.trim()) {
    errors.username = "Username is required.";
  }

  if (!password || !password.trim()) {
    errors.password = "Password is required.";
  }

  return errors;
};
