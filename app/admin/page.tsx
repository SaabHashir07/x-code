export default function AdminPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-text-primary">
          Admin Overview
        </h1>
        <p className="text-text-muted">
          Welcome to the admin panel. Use the sidebar to navigate.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-border bg-surface p-8">
        <h2 className="text-lg font-semibold text-text-primary">
          Coming up next
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-text-muted">
          <li>• Users list with search and filters</li>
          <li>• Projects overview with stats</li>
          <li>• Activity log of recent signups</li>
        </ul>
      </div>
    </>
  );
}