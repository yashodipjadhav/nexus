/**
 * Format numbers into standard USD currency string
 * @param {number|string} amount
 * @returns {string} e.g. "₹1,299.00"
 */
export const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return "₹0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(num);
};

/**
 * Format rating with one decimal point
 * @param {number|string} rating
 * @returns {string} e.g. "4.8"
 */
export const formatRating = (rating) => {
  const num = Number(rating);
  if (isNaN(num)) return "0.0";
  return num.toFixed(1);
};

/**
 * Get visual badge colors and label for product stock
 * @param {number} stock
 * @returns {{ label: string, badgeClass: string, dotClass: string }}
 */
export const getStockStatus = (stock) => {
  const num = Number(stock) || 0;
  if (num <= 0) {
    return {
      label: "Out of Stock",
      badgeClass: "bg-red-50 text-red-700 border-red-200",
      dotClass: "bg-red-500",
    };
  }
  if (num <= 15) {
    return {
      label: `Low Stock (${num})`,
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      dotClass: "bg-amber-500",
    };
  }
  return {
    label: `In Stock (${num})`,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  };
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
