export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your journal preferences.</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <p className="text-zinc-300">Theme is automatically synced with your Windows system preferences.</p>
      </div>
    </div>
  );
}
