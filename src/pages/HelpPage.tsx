export default function HelpPage() {
  return (
    <main className="w-full px-6 py-6">
      <h1 className="text-2xl font-semibold">Help & Support</h1>
      <p className="mt-2 text-sm text-gray-500">
        Quick answers and ways to contact support.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold">FAQs</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div>
              <div className="font-medium">How do I add products to cart?</div>
              <div className="text-gray-600">Open a product page and click “Add to Cart”.</div>
            </div>
            <div>
              <div className="font-medium">How do favourites work?</div>
              <div className="text-gray-600">Click “Add to Favourite” and find it in your favourites page.</div>
            </div>
            <div>
              <div className="font-medium">Is checkout real?</div>
              <div className="text-gray-600">Not yet — it’s a demo flow for now.</div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Contact</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div>
              <div className="text-gray-500">Email</div>
              <div className="font-medium">support@comparehub.com</div>
            </div>
            <div>
              <div className="text-gray-500">Hours</div>
              <div className="font-medium">Mon–Fri, 9:00–17:00</div>
            </div>
            <button
              type="button"
              className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create support ticket (demo)
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
