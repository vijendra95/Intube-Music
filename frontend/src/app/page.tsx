import Link from "next/link";
import {
  Wifi,
  Upload,
  Key,
  Play,
  Radio,
  Monitor,
  Globe,
  RefreshCw,
  Palette,
  BarChart3,
  ListMusic,
  Shield,
  Smartphone,
  Check,
  X,
  ChevronDown,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Radio className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold">
              Intube<span className="text-cyan-400">Media</span>.live
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition">FAQ</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-300 hover:text-white transition px-4 py-2">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-300">99.9% Uptime Guaranteed</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Videos, Live <span className="gradient-text">24/7</span>
            <br />
            Without Keeping Your PC On
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Stream your pre-recorded videos non-stop on YouTube, Facebook, Twitch
            and more. Cloud-powered. No hardware needed. Just upload and go live.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/register"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3.5 rounded-lg font-semibold text-lg transition flex items-center gap-2"
            >
              <Play className="w-5 h-5" /> Start Streaming Free
            </Link>
            <a
              href="#features"
              className="border border-gray-600 hover:border-gray-400 text-gray-300 px-8 py-3.5 rounded-lg font-medium transition"
            >
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { value: "99.9%", label: "Uptime SLA" },
              { value: "24/7", label: "Non-Stop Streams" },
              { value: "₹399", label: "Starting Price" },
              { value: "1080p", label: "Full HD Quality" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4">
                <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stream To Platforms */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 mb-6">Stream to all major platforms</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {["YouTube", "Facebook", "Twitch", "Custom RTMP"].map((platform) => (
              <div key={platform} className="flex items-center gap-2 text-gray-300">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span className="font-medium">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Simple <span className="gradient-text">4-Step</span> Process
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Get your live stream running in minutes, not hours
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Monitor, title: "Create Account", desc: "Sign up in 30 seconds with email or Google" },
              { icon: Upload, title: "Upload Videos", desc: "Upload MP4, MOV, AVI, WebM to your gallery" },
              { icon: Key, title: "Add Stream Key", desc: "Paste your YouTube/FB/Twitch stream key" },
              { icon: Play, title: "Go Live!", desc: "Click start and your stream goes live 24/7" },
            ].map((step, i) => (
              <div key={step.title} className="relative text-center">
                <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center text-sm font-bold md:right-auto md:left-1/2 md:-translate-x-1/2 md:-top-3">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to run a professional 24/7 live stream
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Radio, title: "24/7 Non-Stop Streaming", desc: "Your stream runs continuously without any breaks. Automatic restart on failure." },
              { icon: Monitor, title: "Pre-Recorded Goes Live", desc: "Upload videos and stream them as if you're live. No one can tell the difference." },
              { icon: Globe, title: "Multi-Platform Support", desc: "Stream simultaneously to YouTube, Facebook, Twitch, and any Custom RTMP destination." },
              { icon: RefreshCw, title: "Smart Auto-Restart", desc: "If stream drops, it auto-restarts within seconds. Loop mode ensures 24/7 uptime." },
              { icon: Palette, title: "Stream Designer", desc: "Add logo watermarks, lower-thirds, custom overlays, and animated tickers." },
              { icon: BarChart3, title: "Live Analytics", desc: "Track views, watch time, peak concurrent viewers, and estimated revenue." },
              { icon: ListMusic, title: "Playlist Management", desc: "Create playlists, schedule videos, reorder with drag-drop, and loop content." },
              { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade infrastructure with 99.9% uptime SLA and encrypted stream keys." },
              { icon: Smartphone, title: "Vertical Live (9:16)", desc: "Stream in vertical format for YouTube Shorts, Facebook Reels, and TikTok." },
            ].map((feature) => (
              <div key={feature.title} className="glass rounded-xl p-6 hover:border-cyan-500/30 transition">
                <feature.icon className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Start free. Upgrade when you need more power.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="glass rounded-2xl p-6 flex flex-col">
              <h3 className="text-xl font-bold mb-1">Basic</h3>
              <p className="text-sm text-gray-400 mb-4">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹559</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "1 Live Streaming Channel",
                  "720p HD Quality",
                  "2 GB Video Storage",
                  "YouTube Platform",
                  "Continuous Loop Streaming",
                  "Swap Videos Anytime",
                  "Easy Control Panel",
                  "Email Support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
                {["1080p Full HD", "Multi-Platform"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <X className="w-4 h-4 text-gray-600 shrink-0" />
                    <span className="text-gray-500">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="w-full border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 py-3 rounded-lg font-medium text-center transition"
              >
                Choose Plan
              </Link>
            </div>

            {/* Popular */}
            <div className="relative glass rounded-2xl p-6 flex flex-col border-cyan-500/50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold mb-1">Popular</h3>
              <p className="text-sm text-gray-400 mb-4">Full HD + Multi-platform</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹699</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "1 Live Streaming Channel",
                  "1080p Full HD Quality",
                  "5 GB Video Storage",
                  "YouTube + Facebook",
                  "Unlimited Loop Streaming",
                  "Swap Videos Unlimited",
                  "Schedule Streams",
                  "Stream Designer (Logo + Lower-third)",
                  "Auto-restart on Failure",
                  "Basic Analytics",
                  "WhatsApp + Email Support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-medium text-center transition"
              >
                Choose Plan
              </Link>
            </div>

            {/* Custom */}
            <div className="glass rounded-2xl p-6 flex flex-col">
              <div className="absolute -top-3 right-4 bg-emerald-500 text-xs font-bold px-3 py-1 rounded-full">
                FLEXIBLE
              </div>
              <h3 className="text-xl font-bold mb-1">Custom</h3>
              <p className="text-sm text-gray-400 mb-4">Build your own plan</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹399</span>
                <span className="text-gray-400">/mo + add-ons</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Start from 1 Channel",
                  "Choose 720p / 1080p",
                  "Storage: 1 GB to 25 GB",
                  "YouTube, Facebook, Twitch, RTMP",
                  "Add Extra Stream Slots",
                  "Auto-restart on Failure",
                  "Continuous Loop Streaming",
                  "Schedule Streams",
                  "Swap Videos Anytime",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="w-full border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 py-3 rounded-lg font-medium text-center transition"
              >
                Choose Plan
              </Link>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            * Prices exclusive of 18% GST. Payments secured by Razorpay.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <div className="space-y-4">
            {[
              { q: "How does 24/7 live streaming work?", a: "You upload pre-recorded videos to our platform, add your YouTube/Facebook stream key, and we stream your videos continuously in a loop — 24 hours a day, 7 days a week. Our servers handle everything." },
              { q: "Do I need to keep my computer on?", a: "No! Everything runs on our cloud servers. Once you set up your stream, it runs independently. You can close your browser and your stream continues." },
              { q: "Which platforms are supported?", a: "We support YouTube, Facebook, Twitch, and any platform that accepts Custom RTMP streams. You can even stream to multiple platforms simultaneously." },
              { q: "What video formats can I upload?", a: "We support MP4, MOV, AVI, and WebM formats. Videos are processed on our servers for optimal streaming quality." },
              { q: "What happens if my stream drops?", a: "Our smart auto-restart feature detects stream failures and automatically restarts within seconds, ensuring minimal downtime." },
              { q: "Can I change videos while streaming?", a: "Yes! You can swap videos anytime without stopping your stream. The new video will start playing immediately." },
              { q: "Is there a free trial?", a: "Yes, we offer a free plan with 1 GB storage, 720p quality, and 2 hours/day streaming so you can test our platform." },
              { q: "How secure is my stream key?", a: "Stream keys are encrypted and stored securely. We never share your credentials with third parties." },
            ].map((faq) => (
              <details key={faq.q} className="glass rounded-xl p-5 group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-gray-400 mt-3 text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to <span className="gradient-text">Go Live</span>?
          </h2>
          <p className="text-gray-400 mb-8">
            Start streaming today. No credit card required for the free plan.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
          >
            <Play className="w-5 h-5" /> Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-6 h-6 text-cyan-400" />
              <span className="font-bold text-lg">IntubeMedia.live</span>
            </div>
            <p className="text-gray-400 text-sm">
              The best 24/7 pre-recorded video live streaming platform. Stream non-stop and grow your channel.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              <li><Link href="/login" className="hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">Tutorial</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © 2026 IntubeMedia.live. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
