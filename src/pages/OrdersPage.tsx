import { Link } from "react-router-dom";

export default function OrdersPage() {
  return (
    <main className="w-full px-6 py-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <p className="mt-2 text-sm text-gray-500">
        You don’t have any orders yet. After we build checkout, your order history will appear here.
      </p>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <div className="text-sm text-gray-700">
          When ready, we’ll show: order ID, date, status, items, and total.
        </div>

        <Link
          to="/"
          className="mt-4 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
