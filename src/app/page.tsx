import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-finder-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-midnight-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-finder-400/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-finder-400 to-finder-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-display font-bold text-xl">Finder Force</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/admin"
            className="px-5 py-2.5 bg-finder-500 hover:bg-finder-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-finder-500/25"
          >
            Admin Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-finder-400 rounded-full animate-pulse" />
            <span className="text-sm text-white/70">Innovation Awards 2025</span>
          </div>
          
          <h1 className="font-display text-6xl md:text-7xl font-bold mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Discover the
            <span className="text-gradient block">Best Innovations</span>
          </h1>
          
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Submit your groundbreaking innovations, get judged by industry experts, 
            and win recognition for excellence in your category.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/admin/categories"
              className="px-8 py-4 bg-gradient-to-r from-finder-500 to-finder-600 hover:from-finder-600 hover:to-finder-700 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-finder-500/30 hover:-translate-y-1"
            >
              View Categories
            </Link>
            <Link
              href="/admin"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-semibold text-lg transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-24">
          {[
            {
              icon: "📋",
              title: "Create Categories",
              description: "Define award categories with custom metrics - numeric or text-based",
              delay: "0.4s",
            },
            {
              icon: "👥",
              title: "Invite Judges",
              description: "Send secure links to your judging panel to evaluate submissions",
              delay: "0.5s",
            },
            {
              icon: "🏆",
              title: "Weighted Scoring",
              description: "Assign weights to metrics and automatically calculate winners",
              delay: "0.6s",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl hover:border-finder-500/30 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: feature.delay }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

