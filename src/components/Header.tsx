import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Dummy user for now
  const user = { name: "Rahul Pareek", email: "rahulpareek0203@gmail.com" };
  const initials = "RP"; // force GU as you requested

  // close dropdown on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-blue-600 shadow-sm">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-2">
        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-bold tracking-wide text-white hover:opacity-90"
        >
          CompareHub
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Favourites */}
          <Link
            to="/favourites"
            className="inline-flex items-center gap-2 rounded-md border border-white/30 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10"
          >
            <span>♡</span>
            <span className="hidden sm:inline">Favourites</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {/* Profile (GU only) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Open profile menu"
            >
              {initials}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border bg-white shadow-lg">
                {/* user header */}
                <div className="border-b px-4 py-3">
                  <div className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>

                {/* menu items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Settings
                  </Link>

                  <div className="my-2 border-t" />

                  <Link
                    to="/help"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Help & Support
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      alert("Later: implement sign out");
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
