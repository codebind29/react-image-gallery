import axios from "axios";
import React, { useEffect, useState } from "react";

const App = () => {
  const [userData, setUserData] = useState([]);
  const [index, setIndex] = useState(1);

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("aatrive-theme") !== "light";
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("aatrive-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Fetch images
  const getData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `https://picsum.photos/v2/list?page=${index}&limit=10`
      );

      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch image data:", error);
      setError("Failed to load images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever page changes
  useEffect(() => {
    getData();
  }, [index]);

  return (
    <div
      className={`${
        isDark
          ? "bg-[#101312] text-stone-100"
          : "bg-[#f4f6f3] text-stone-900"
      } min-h-screen overflow-auto transition-colors duration-300`}
    >
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-9">
        <header className="flex flex-col gap-8 border-b border-current/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl">
              react-<span className={isDark ? "text-emerald-300" : "text-emerald-700"}>image-gallery</span>
            </h1>
            <p className={`mt-4 max-w-lg text-sm leading-6 sm:text-base ${isDark ? "text-stone-400" : "text-stone-600"}`}>
              Explore beautiful photography from creators around the world.
            </p>
          </div>

          <button
            type="button"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            onClick={() => setIsDark((currentValue) => !currentValue)}
            className={`inline-flex items-center justify-center gap-2 self-start rounded-full border px-4 py-2.5 text-sm font-bold transition duration-200 hover:-translate-y-0.5 active:scale-95 sm:self-auto ${
              isDark
                ? "border-stone-700 bg-stone-800 text-stone-100 hover:border-emerald-300 hover:text-emerald-200"
                : "border-stone-300 bg-white text-stone-800 shadow-sm hover:border-emerald-600 hover:text-emerald-700"
            }`}
          >
            <span aria-hidden="true" className="text-base">{isDark ? "○" : "●"}</span>
            {isDark ? "Light mode" : "Dark mode"}
          </button>
        </header>

        <div className="flex items-center justify-between gap-4 py-7">
          <div>
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">Curated moments</h2>
            <p className={`mt-1 text-xs ${isDark ? "text-stone-500" : "text-stone-500"}`}>
              Page {index} <span className="mx-1">/</span> Fresh from the community
            </p>
          </div>
          <div className={`hidden h-px flex-1 max-w-xs sm:block ${isDark ? "bg-stone-800" : "bg-stone-200"}`} />
        </div>

        <main>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-5">
          {loading ? (
            <div className="col-span-full flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-current/15">
              <div className={`mb-4 h-9 w-9 animate-spin rounded-full border-2 border-current/15 border-t-current ${isDark ? "text-emerald-300" : "text-emerald-700"}`} />
              <h3 className={`text-sm font-semibold ${isDark ? "text-stone-300" : "text-stone-600"}`}>
                Loading....
              </h3>
            </div>
          ) : error ? (
            <div className="col-span-full rounded-2xl border border-red-500/30 bg-red-500/5 px-5 py-16 text-center">
              <h3 className="text-sm font-semibold text-red-400">{error}</h3>
            </div>
          ) : (
            userData.map((elem) => (
              <a
                href={elem.url}
                target="_blank"
                rel="noreferrer"
                key={elem.id}
                className="group min-w-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
              >
                <div className={`relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm ring-1 ring-current/10 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${isDark ? "bg-stone-800 group-hover:ring-emerald-300/50" : "bg-stone-200 group-hover:ring-emerald-700/40"}`}>
                  <img
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    src={elem.download_url}
                    alt={`Photo by ${elem.author}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isDark ? "bg-emerald-300" : "bg-emerald-700"}`} />
                  <h2 className={`truncate text-sm font-bold ${isDark ? "text-stone-200" : "text-stone-800"}`}>
                    {elem.author}
                  </h2>
                </div>
              </a>
            ))
          )}
          </div>
        </main>

        <nav className="mt-14 flex items-center justify-center gap-3" aria-label="Gallery pagination">
          <button
            disabled={index === 1 || loading}
            onClick={() => setIndex(index - 1)}
            className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${isDark ? "border-stone-700 bg-stone-900 hover:border-emerald-300" : "border-stone-300 bg-white shadow-sm hover:border-emerald-700"}`}
          >
            <span aria-hidden="true">←</span> Prev
          </button>

          <h4 className={`min-w-24 rounded-full px-4 py-2.5 text-center text-sm font-bold ${isDark ? "bg-emerald-300 text-stone-950" : "bg-emerald-700 text-white"}`}>
            Page {index}
          </h4>

          <button
            disabled={loading}
            onClick={() => setIndex(index + 1)}
            className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${isDark ? "border-stone-700 bg-stone-900 hover:border-emerald-300" : "border-stone-300 bg-white shadow-sm hover:border-emerald-700"}`}
          >
            Next <span aria-hidden="true">→</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;