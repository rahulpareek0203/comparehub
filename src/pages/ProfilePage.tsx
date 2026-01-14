import { useEffect, useState } from "react";

type Profile = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
};

const PROFILE_KEY = "comparehub_profile_v1";

function loadProfile(): Profile {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) {
    // sensible defaults for first-time users
    return {
      fullName: "Rahul Pareek",
      email: "rahulpareek0203@gmail.com",
      phone: "+49 1725936119",
      addressLine1: "Kurt-Schumacher Straße 66",
      addressLine2: "",
      city: "Kaiserslautern",
      postalCode: "67663",
      country: "Germany",
    };
  }
  try {
    return JSON.parse(raw) as Profile;
  } catch {
    // if parsing fails, reset to defaults
    return {
      fullName: "Rahul Pareek",
      email: "rahulpareek0203@gmail.com",
      phone: "",
      addressLine1: "Kurt-Schumacher Straße 66",
      addressLine2: "",
      city: "Kaiserslautern",
      postalCode: "67663",
      country: "Germany",
    };
  }
}

function saveProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
      />
    </label>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [saved, setSaved] = useState(false);

  // if user opens profile in another tab and updates, this page can refresh on reload
  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    saveProfile(profile);
    setSaved(true);
    // hide message after a short time
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <main className="w-full px-6 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal details for checkout and account settings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save changes
        </button>
      </div>

      {saved && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Saved successfully ✓
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left: form */}
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Personal information</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full name"
              value={profile.fullName}
              onChange={(v) => update("fullName", v)}
              placeholder="e.g., Manish Pareek"
            />
            <Input
              label="Email"
              value={profile.email}
              onChange={(v) => update("email", v)}
              placeholder="e.g., name@email.com"
              type="email"
            />
            <Input
              label="Phone"
              value={profile.phone}
              onChange={(v) => update("phone", v)}
              placeholder="e.g., +49 123 456789"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Address</h2>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <Input
                label="Address line 1"
                value={profile.addressLine1}
                onChange={(v) => update("addressLine1", v)}
                placeholder="Street and house number"
              />
              <Input
                label="Address line 2 (optional)"
                value={profile.addressLine2}
                onChange={(v) => update("addressLine2", v)}
                placeholder="Apartment, floor, etc."
              />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City"
                value={profile.city}
                onChange={(v) => update("city", v)}
                placeholder="Berlin"
              />
              <Input
                label="Postal code"
                value={profile.postalCode}
                onChange={(v) => update("postalCode", v)}
                placeholder="10115"
              />
              <Input
                label="Country"
                value={profile.country}
                onChange={(v) => update("country", v)}
                placeholder="Germany"
              />
            </div>
          </div>
        </section>

        {/* Right: summary card */}
        <aside className="rounded-xl border bg-white p-6 h-fit lg:sticky lg:top-20">
          <h2 className="text-lg font-semibold">Profile summary</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <div className="text-gray-500">Name</div>
              <div className="font-medium text-gray-900">{profile.fullName || "-"}</div>
            </div>
            <div>
              <div className="text-gray-500">Email</div>
              <div className="font-medium text-gray-900">{profile.email || "-"}</div>
            </div>
            <div>
              <div className="text-gray-500">Phone</div>
              <div className="font-medium text-gray-900">{profile.phone || "-"}</div>
            </div>
            <div className="pt-2 border-t">
              <div className="text-gray-500">Address</div>
              <div className="font-medium text-gray-900">
                {[profile.addressLine1, profile.addressLine2, profile.city, profile.postalCode, profile.country]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Tip: Later we’ll connect this to checkout so your address auto-fills.
          </p>
        </aside>
      </div>
    </main>
  );
}
