import { useState } from "react";

export default function SettingsPage() {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [productTips, setProductTips] = useState(true);

  return (
    <main className="w-full px-6 py-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm text-gray-500">Basic preferences for your account.</p>

      <div className="mt-6 rounded-xl border bg-white p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-medium">Email updates</div>
            <div className="text-sm text-gray-500">Receive important account updates via email.</div>
          </div>
          <input
            type="checkbox"
            checked={emailUpdates}
            onChange={(e) => setEmailUpdates(e.target.checked)}
            className="h-5 w-5"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-medium">Product tips</div>
            <div className="text-sm text-gray-500">Get recommendations and tips based on your activity.</div>
          </div>
          <input
            type="checkbox"
            checked={productTips}
            onChange={(e) => setProductTips(e.target.checked)}
            className="h-5 w-5"
          />
        </div>

        <div className="pt-4 border-t text-xs text-gray-500">
          Note: These settings are UI-only for now; we can persist them later.
        </div>
      </div>
    </main>
  );
}
