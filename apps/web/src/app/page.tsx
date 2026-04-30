export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
      <div className="text-center px-6">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-white text-3xl font-bold">P</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-4">
          PLMS
        </h1>
        <p className="text-blue-300 text-xl mb-2 font-medium">
          Professional Life Management System
        </p>
        <p className="text-slate-400 text-base mb-12 max-w-md mx-auto">
          Avukatlar, doktorlar, mimarlar ve danışmanlar için AI destekli profesyonel asistan
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['Halüsinasyon-Free AI', 'KVKK Uyumlu', 'Ses → Transkripsiyon', 'Otomatik Uyarılar'].map((feat) => (
            <span
              key={feat}
              className="px-4 py-2 bg-blue-900/50 border border-blue-700/50 text-blue-300 rounded-full text-sm font-medium"
            >
              ✓ {feat}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="/auth/login"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            Giriş Yap
          </a>
          <a
            href="/auth/register"
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors"
          >
            Ücretsiz Başla
          </a>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>API: http://localhost:4000</span>
        </div>
      </div>
    </main>
  );
}
