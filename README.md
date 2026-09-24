# Product Admin Dashboard 

A modern, high-performance Product Admin Dashboard built with pure **React 19**, **Vite**, **React Router v7**, **Tailwind CSS v4**, and **Axios**, powered by the free [DummyJSON API](https://dummyjson.com).

---

##  Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to [http://localhost:5173](http://localhost:5173)

---

## Login Credentials

- **Username**: `Yashodip`
- **Password**: `Yashodip1234`


---

##  Features

- **AuthGuard & Session**: Protected dashboard routes with centralized Axios token interceptors.
- **Dual Layouts**: Desktop data table + Mobile interactive card view.
- **Debounced Search**: 400ms typing debounce with AbortController race-condition prevention.
- **Category Filter & Sorting**: Dynamic category filter with combined hybrid search matching.
- **Hand-Crafted Pagination**: Custom React pagination (page size: 10, 20, 50, smart ellipsis pills, range text).
- **Product Details (`/products/:id`)**: Gallery with thumbnails, full specifications, ratings, and customer reviews.
- **Full CRUD with Persistence Overlay**: Add, edit, and delete products with local storage persistence.
- **Toast Notifications**: Responsive visual feedback for user actions.
