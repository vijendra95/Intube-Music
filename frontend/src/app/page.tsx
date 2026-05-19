import Link from "next/link";
import {
  Zap,
  Upload,
  Key,
  Play,
  Tv,
  Monitor,
  Globe,
  RefreshCw,
  Layers,
  BarChart3,
  ListMusic,
  Shield,
  Smartphone,
  Check,
  ChevronDown,
  Star,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0a1e] overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f0a1e]/80 backdrop-blur-xl border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              intube<span className="text-purple-400">media</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-gray-400 hover:text-white text-sm transition">How it Works</a>
            <a href="#features" className="text-gray-400 hover:text-white text-sm transition">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-white text-sm transition">Pricing</a>
            <a href="#faq" className="text-gray-400 hover:text-white text-sm transition">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-300 hover:text-white text-sm transition px-4 py-2">
              Sign In
            </Link>
            <Link
              href="/register"
              className="gradient-bg hover:opacity-90 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition shadow-lg shadow-purple-500/25"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 hero-gradient relative">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-pink-500/15 rounded-full blur-[100px]"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-purple-200">India&apos;s #1 24/7 Live Streaming Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
            Go Live <span className="gradient-text">24/7</span>
            <br />
            <span className="text-gray-300 font-semibold text-4xl md:text-5xl">Without Your PC Running</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your videos once. We stream them non-stop to YouTube, Facebook,
            Twitch — all from the cloud. No hardware. No hassle.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="gradient-bg hover:opacity-90 text-white px-8 py-4 rounded-full font-semibold text-lg transition shadow-xl shadow-purple-500/30 flex items-center gap-2"
            >
              Start Streaming Now <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="border border-purple-700/50 hover:border-purple-500 text-purple-200 px-8 py-4 rounded-full font-medium transition backdrop-blur-sm"
            >
              Watch Demo
            </a>
          </div>

          {/* Platform Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {[
              { name: "YouTube", color: "bg-red-500/10 border-red-500/30 text-red-300" },
              { name: "Facebook", color: "bg-blue-500/10 border-blue-500/30 text-blue-300" },
              { name: "Twitch", color: "bg-violet-500/10 border-violet-500/30 text-violet-300" },
              { name: "Custom RTMP", color: "bg-amber-500/10 border-amber-500/30 text-amber-300" },
            ].map((p) => (
              <span key={p.name} className={`${p.color} border px-4 py-2 rounded-full text-sm font-medium`}>
                {p.name}
              </span>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "99.9%", label: "Uptime", icon: Zap },
              { value: "24/7", label: "Non-Stop", icon: RefreshCw },
              { value: "₹399", label: "From", icon: Star },
              { value: "1080p", label: "Full HD", icon: Monitor },
            ].map((stat) => (
              <div key={stat.label} className="card p-4 text-center card-hover transition">
                <stat.icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Live in <span className="gradient-text">4 Steps</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Monitor, title: "Sign Up", desc: "Create your free account in 30 seconds", num: "01" },
              { icon: Upload, title: "Upload", desc: "Drop your MP4, MOV, AVI or WebM videos", num: "02" },
              { icon: Key, title: "Connect", desc: "Add stream key from YouTube/Facebook/Twitch", num: "03" },
              { icon: Play, title: "Go Live", desc: "Hit start — we handle the rest 24/7", num: "04" },
            ].map((step) => (
              <div key={step.title} className="card p-6 card-hover transition relative group">
                <span className="absolute top-4 right-4 text-4xl font-black text-purple-500/10 group-hover:text-purple-500/20 transition">
                  {step.num}
                </span>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-[#130e24]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Everything You Need</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              Professional streaming tools that just work. No technical knowledge required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: RefreshCw, title: "24/7 Auto-Loop", desc: "Videos loop endlessly. Auto-restart on any failure within seconds.", color: "text-green-400 bg-green-500/10 border-green-500/20" },
              { icon: Globe, title: "Multi-Platform", desc: "Stream to YouTube, Facebook, Twitch, and Custom RTMP simultaneously.", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
              { icon: Layers, title: "Stream Designer", desc: "Add logo watermarks, text overlays, lower-thirds, and animated tickers.", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
              { icon: BarChart3, title: "Live Analytics", desc: "Real-time views, watch time, peak viewers, and estimated revenue tracking.", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
              { icon: ListMusic, title: "Playlist Mode", desc: "Queue videos, reorder with drag-drop, schedule content, and loop playlists.", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
              { icon: Shield, title: "Enterprise Secure", desc: "Encrypted stream keys, 99.9% SLA, enterprise-grade cloud infrastructure.", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              { icon: Smartphone, title: "Vertical Live", desc: "Stream 9:16 for YouTube Shorts, Facebook Reels, and TikTok Live.", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
              { icon: Zap, title: "Instant Swap", desc: "Change videos mid-stream without stopping. Zero downtime transitions.", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
              { icon: Tv, title: "HD Quality", desc: "Stream in crystal-clear 720p or 1080p Full HD. Your choice per stream.", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
            ].map((feature) => (
              <div key={feature.title} className="card p-6 card-hover transition">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">Plans</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-gray-400 mt-4">Start free. Scale as you grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {/* Basic */}
            <div className="card p-7 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold">Basic</h3>
                <p className="text-sm text-gray-500 mt-1">For beginners</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">₹559</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "1 Stream Slot",
                  "720p HD Quality",
                  "2 GB Storage",
                  "YouTube Only",
                  "24/7 Loop Mode",
                  "Swap Videos Anytime",
                  "Email Support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="w-full border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 py-3 rounded-full font-medium text-center transition"
              >
                Get Started
              </Link>
            </div>

            {/* Popular */}
            <div className="relative card p-7 flex flex-col border-purple-500/40 glow-purple">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 gradient-bg text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                BEST VALUE
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold">Popular</h3>
                <p className="text-sm text-gray-500 mt-1">Most chosen plan</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">₹699</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "1 Stream Slot",
                  "1080p Full HD",
                  "5 GB Storage",
                  "YouTube + Facebook",
                  "Unlimited 24/7 Loop",
                  "Stream Designer",
                  "Auto-restart on Failure",
                  "Basic Analytics",
                  "Schedule Streams",
                  "WhatsApp + Email Support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="w-full gradient-bg hover:opacity-90 text-white py-3 rounded-full font-semibold text-center transition shadow-lg shadow-purple-500/25"
              >
                Get Popular
              </Link>
            </div>

            {/* Custom */}
            <div className="card p-7 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold">Custom</h3>
                <p className="text-sm text-gray-500 mt-1">Build your own</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">₹399</span>
                <span className="text-gray-500">/slot + extras</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "1-10 Stream Slots",
                  "720p or 1080p",
                  "1 GB to 25 GB Storage",
                  "All Platforms + RTMP",
                  "Flexible Billing",
                  "Auto-restart",
                  "Priority Support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="w-full border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 py-3 rounded-full font-medium text-center transition"
              >
                Build Plan
              </Link>
            </div>
          </div>

          <p className="text-center text-gray-600 text-sm mt-8">
            All prices exclusive of 18% GST • Secured by Razorpay
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 bg-[#130e24]/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Questions</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Common <span className="gradient-text">FAQs</span>
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "How does 24/7 live streaming work?", a: "Upload pre-recorded videos, paste your stream key, and we loop them on your YouTube/Facebook channel non-stop. Our cloud servers handle everything — you can close your browser." },
              { q: "Do I need to keep my computer running?", a: "No! Everything runs on our servers. Once you start a stream, it runs independently 24/7 without any hardware from your side." },
              { q: "Which platforms are supported?", a: "YouTube, Facebook, Twitch, and any Custom RTMP destination. Multi-platform streaming lets you go live on all of them simultaneously." },
              { q: "What video formats are accepted?", a: "We accept MP4, MOV, AVI, and WebM. Videos are processed on our servers for optimal streaming quality." },
              { q: "What if my stream disconnects?", a: "Smart auto-restart detects failures and restarts within seconds. Your stream stays live 24/7 with minimal interruption." },
              { q: "Can I swap videos without stopping?", a: "Yes! Change your playlist anytime without stopping the stream. The new content plays immediately." },
              { q: "Is there a free trial?", a: "Yes — our free plan gives you 1 GB storage, 720p quality, and 2 hours/day streaming to test everything out." },
              { q: "How safe are my stream keys?", a: "Stream keys are encrypted end-to-end. We never share credentials with third parties." },
            ].map((faq) => (
              <details key={faq.q} className="card p-5 group cursor-pointer">
                <summary className="flex items-center justify-between list-none">
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-purple-400 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <p className="text-gray-400 mt-4 text-sm leading-relaxed border-t border-purple-900/30 pt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Stream?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of creators streaming 24/7. Free to start.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 gradient-bg hover:opacity-90 text-white px-10 py-4 rounded-full font-semibold text-lg transition shadow-xl shadow-purple-500/30"
          >
            <Play className="w-5 h-5" /> Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 py-12 px-4 bg-[#0a0716]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Tv className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">intubemedia</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              The most reliable 24/7 live streaming platform for creators. Stream non-stop, grow your channel.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Product</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="#features" className="hover:text-purple-400 transition">Features</a></li>
              <li><a href="#pricing" className="hover:text-purple-400 transition">Pricing</a></li>
              <li><Link href="/login" className="hover:text-purple-400 transition">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Support</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="#faq" className="hover:text-purple-400 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Contact</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Legal</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><a href="#" className="hover:text-purple-400 transition">Privacy</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Terms</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-purple-900/20 text-center text-sm text-gray-600">
          © 2026 IntubeMedia.live — All rights reserved.
        </div>
      </footer>
    </div>
  );
}
