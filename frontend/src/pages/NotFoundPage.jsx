export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#0b213a] p-6">
      <div className="max-w-5xl mx-auto text-center pt-24">

        <h1 className="text-6xl font-bold text-[#fff5e6] mb-4 tracking-wide">
          404
        </h1>

        <h2 className="text-3xl font-semibold text-[#fff5e6] mb-6">
          Page Not Found
        </h2>

        <p className="text-[#c7d5e0] mb-8">
          The requested route does not exist.
        </p>

        <a
          href="/events"
          className="
            inline-block
            px-6 py-3
            rounded
            bg-[#006d77]
            hover:bg-[#0a7f8a]
            text-[#fff5e6]
            font-medium
            transition-colors
          "
        >
          Back to Events
        </a>

      </div>
    </main>
  );
}