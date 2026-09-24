export default function Loader({ message = "Loading products..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
        <div className="absolute w-6 h-6 rounded-full border-2 border-indigo-200 border-b-indigo-500 animate-spin animate-reverse"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">{message}</p>
    </div>
  );
}
