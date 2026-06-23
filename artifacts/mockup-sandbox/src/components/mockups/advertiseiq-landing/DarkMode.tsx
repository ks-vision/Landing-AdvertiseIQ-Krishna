import React, { useState, useEffect } from "react";
import {
  Moon,
  ChevronDown,
  CheckCircle2,
  XCircle,
  BarChart3,
  Search,
  BrainCircuit,
  PackageCheck,
  Clock,
  TrendingUp,
  ChevronRight,
  ArrowRight,
  Star,
  Quote,
  Zap,
  Activity,
  Layers,
  Check,
  Plus,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DarkMode() {
  const [adSpend, setAdSpend] = useState([50000]);
  const [acos, setAcos] = useState([35]);
  const [annualBilling, setAnnualBilling] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Counter animation hook
  const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime: number | null = null;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        // Easing function (easeOutExpo)
        const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
        
        setCount(Math.floor(end * easeOut));

        if (percentage < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return count;
  };

  const spendManaged = useCounter(100);
  const optimizations = useCounter(500);
  const roasImprovement = useCounter(25);
  const uptime = useCounter(99);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-['Inter'] selection:bg-blue-500/30 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .glass-card {
          background: rgba(17, 24, 39, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .text-gradient {
          background: linear-gradient(to right, #60a5fa, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        }
        .glow-effect {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .glow-effect:hover {
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        .bg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
      `}} />

      {/* Sticky Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b-0 border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-primary flex items-center justify-center glow-effect">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-['Manrope'] font-bold text-white tracking-tight">AdvertiseIQ</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#customers" className="hover:text-white transition-colors">Customers</a>
            <a href="#resources" className="hover:text-white transition-colors">Resources</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
              <Moon className="w-5 h-5" />
            </button>
            <Button variant="ghost" className="text-slate-300 hover:text-white hidden sm:inline-flex">
              Login
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90 text-white border-0 glow-effect font-medium rounded-full px-6">
              Start Free Trial
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 px-4 py-1.5 rounded-full font-medium">
            <Zap className="w-4 h-4 mr-2" />
            New: Generative AI Keyword Discovery
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-['Manrope'] font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Stop Managing Amazon Ads.<br />
            <span className="text-gradient">Start Automating Growth.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            The enterprise-grade platform combining advanced Amazon Ads automation, AI-driven insights, and intelligent inventory protection to maximize your ROAS and scale profitably.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button className="w-full sm:w-auto h-14 bg-gradient-primary hover:opacity-90 text-white border-0 glow-effect font-medium text-lg rounded-full px-8">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" className="w-full sm:w-auto h-14 border-slate-700 bg-white/5 hover:bg-white/10 text-white font-medium text-lg rounded-full px-8">
              Book Live Demo
            </Button>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-2xl glass-card border border-slate-700/50 p-2 shadow-2xl shadow-blue-900/20">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-2xl pointer-events-none" />
            
            {/* Top Bar */}
            <div className="flex items-center gap-2 p-3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-4 h-6 w-64 bg-slate-800/50 rounded flex items-center px-2">
                <Search className="w-3 h-3 text-slate-500" />
                <div className="ml-2 h-2 w-24 bg-slate-700/50 rounded" />
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6 grid grid-cols-12 gap-6 bg-[#0a0f1c]/50 rounded-b-xl relative">
              {/* Floating Cards */}
              <div className="absolute -left-12 top-20 glass-card p-4 rounded-xl animate-float shadow-xl z-20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Total ROAS</div>
                  <div className="text-xl font-bold text-white">4.8x <span className="text-green-400 text-sm ml-1">+12%</span></div>
                </div>
              </div>

              <div className="absolute -right-8 top-40 glass-card p-4 rounded-xl animate-float-delayed shadow-xl z-20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Avg ACoS</div>
                  <div className="text-xl font-bold text-white">22.4% <span className="text-green-400 text-sm ml-1">-3.2%</span></div>
                </div>
              </div>

              {/* Main Content Areas */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <div className="h-64 glass-card rounded-xl p-5 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-slate-200">Revenue vs Spend</h3>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-slate-800 rounded-full" />
                      <div className="h-6 w-16 bg-blue-600/30 border border-blue-500/50 rounded-full text-[10px] flex items-center justify-center text-blue-300 font-medium">30 Days</div>
                    </div>
                  </div>
                  {/* Fake Chart Bars */}
                  <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 mt-auto">
                    {[30, 45, 25, 60, 80, 50, 70, 90, 65, 85, 100, 75].map((h, i) => (
                      <div key={i} className="w-full flex flex-col gap-1 justify-end group">
                        <div className="w-full bg-blue-500/80 rounded-t-sm transition-all duration-300 group-hover:bg-blue-400" style={{ height: `${h}%` }} />
                        <div className="w-full bg-slate-700/50 rounded-b-sm" style={{ height: `${h * 0.3}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-card p-5 rounded-xl">
                    <div className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400" /> Active Automations
                    </div>
                    <div className="text-3xl font-bold text-white">1,248</div>
                  </div>
                  <div className="glass-card p-5 rounded-xl border-orange-500/20">
                    <div className="text-sm text-orange-400 mb-2 flex items-center gap-2">
                      <PackageCheck className="w-4 h-4" /> Low Inventory Alerts
                    </div>
                    <div className="text-3xl font-bold text-white">3 <span className="text-sm font-normal text-slate-500">campaigns paused</span></div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="glass-card rounded-xl p-5 h-full flex flex-col">
                  <h3 className="font-semibold text-slate-200 mb-4">Recent AI Actions</h3>
                  <div className="space-y-4 flex-1">
                    {[
                      { icon: <TrendingUp className="w-4 h-4 text-green-400" />, title: "Bid Increased", desc: "+$0.45 on 'running shoes'", time: "2m ago" },
                      { icon: <Minus className="w-4 h-4 text-red-400" />, title: "Keyword Negated", desc: "'cheap trainers' (ACoS 85%)", time: "15m ago" },
                      { icon: <Clock className="w-4 h-4 text-blue-400" />, title: "Dayparting Applied", desc: "Paused until 6:00 AM", time: "1h ago" },
                      { icon: <Plus className="w-4 h-4 text-purple-400" />, title: "New Keyword Discovered", desc: "'marathon sneakers men'", time: "2h ago" },
                    ].map((act, i) => (
                      <div key={i} className="flex gap-3 items-start border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <div className="p-2 rounded bg-slate-800/80 mt-1">{act.icon}</div>
                        <div>
                          <div className="text-sm font-medium text-slate-200">{act.title}</div>
                          <div className="text-xs text-slate-400">{act.desc}</div>
                        </div>
                        <div className="ml-auto text-[10px] text-slate-500 pt-1">{act.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 border-y border-white/5 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5 text-center">
          <div>
            <div className="text-4xl font-bold text-white mb-2">${spendManaged}M+</div>
            <div className="text-sm text-slate-400 font-medium">Ad Spend Managed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">{optimizations}K+</div>
            <div className="text-sm text-slate-400 font-medium">Automated Optimizations</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">{roasImprovement}%</div>
            <div className="text-sm text-slate-400 font-medium">Avg ROAS Improvement</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">{uptime}.9%</div>
            <div className="text-sm text-slate-400 font-medium">Platform Uptime</div>
          </div>
        </div>
      </section>

      {/* Problems vs Solutions */}
      <section className="py-24 px-6 relative" id="solutions">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-['Manrope'] font-bold text-white mb-4">The Old Way vs <span className="text-gradient">The IQ Way</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Stop letting manual management eat your margins. See how AdvertiseIQ transforms your Amazon advertising workflows.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* Problems */}
            <div className="glass-card rounded-2xl p-8 border-red-900/30 bg-red-950/10">
              <h3 className="text-2xl font-semibold text-slate-200 mb-8 flex items-center">
                <XCircle className="w-6 h-6 text-red-500 mr-3" /> Manual Management
              </h3>
              <ul className="space-y-6">
                {[
                  "High ACoS and wasted ad spend on non-converting terms",
                  "Hours spent manually adjusting bids across thousands of targets",
                  "Missing out on trending keywords your competitors are grabbing",
                  "Running ads for products that are dangerously low in stock",
                  "Inefficient budget allocation across your brand portfolio",
                  "Difficulty scaling campaigns without adding headcount"
                ].map((text, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mt-1 mr-4 min-w-[20px]"><XCircle className="w-5 h-5 text-red-500/70" /></div>
                    <span className="text-slate-300">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div className="glass-card rounded-2xl p-8 border-blue-500/30 bg-blue-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center relative z-10">
                <CheckCircle2 className="w-6 h-6 text-blue-400 mr-3" /> AdvertiseIQ Automation
              </h3>
              <ul className="space-y-6 relative z-10">
                {[
                  "AI algorithms automatically optimize bids for target ACoS/ROAS",
                  "Rule-based automation handles routine changes 24/7",
                  "Generative AI continuously mines converting search terms",
                  "Smart inventory protection pauses ads before stockouts",
                  "Dynamic budget pacing shifts spend to top performers",
                  "Infinitely scalable infrastructure grows with your business"
                ].map((text, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mt-1 mr-4 min-w-[20px]"><CheckCircle2 className="w-5 h-5 text-blue-400" /></div>
                    <span className="text-white font-medium">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Horizontal Scroll */}
      <section className="py-24 px-6 overflow-hidden relative border-t border-white/5" id="features">
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-['Manrope'] font-bold text-white mb-4">Enterprise-Grade <span className="text-gradient">Intelligence</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl">Everything you need to dominate Amazon Search, built into one powerful platform.</p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-12 px-6 max-w-[100vw] hide-scrollbar snap-x snap-mandatory" style={{ paddingLeft: 'max(1.5rem, calc((100vw - 80rem) / 2))', paddingRight: 'max(1.5rem, calc((100vw - 80rem) / 2))' }}>
          {[
            { 
              icon: <BrainCircuit className="w-8 h-8 text-blue-400" />, 
              title: "AI Bid Automation", 
              metric: "+28% ROAS",
              bullets: ["Goal-based bidding algorithms", "Intra-day optimization", "Competitor tracking", "Margin-aware bidding"]
            },
            { 
              icon: <Search className="w-8 h-8 text-purple-400" />, 
              title: "Keyword Intelligence", 
              metric: "2M+ Terms",
              bullets: ["Automated term harvesting", "Negative keyword AI", "Search volume trends", "Share of voice tracking"]
            },
            { 
              icon: <PackageCheck className="w-8 h-8 text-orange-400" />, 
              title: "Inventory Protection", 
              metric: "0 Stockouts",
              bullets: ["Real-time stock syncing", "Auto-pause low inventory", "Velocity forecasting", "Restock recommendations"]
            },
            { 
              icon: <Clock className="w-8 h-8 text-green-400" />, 
              title: "Smart Dayparting", 
              metric: "-15% Waste",
              bullets: ["Hourly performance analytics", "Custom ad schedules", "Time-of-day bid modifiers", "Timezone aware"]
            },
            { 
              icon: <BarChart3 className="w-8 h-8 text-pink-400" />, 
              title: "Profit Analytics", 
              metric: "True ROI",
              bullets: ["COGS integration", "Net profit dashboards", "Fee breakdown", "Brand vs Non-brand splits"]
            },
          ].map((feature, i) => (
            <div key={i} className="min-w-[320px] md:min-w-[400px] glass-card rounded-2xl p-8 snap-start flex-shrink-0 group hover:border-blue-500/50 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-blue-500/10 transition-colors">
                  {feature.icon}
                </div>
                <Badge className="bg-white/10 text-white hover:bg-white/20 border-0">{feature.metric}</Badge>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-6">{feature.title}</h3>
              <ul className="space-y-3">
                {feature.bullets.map((b, j) => (
                  <li key={j} className="flex items-center text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-['Manrope'] font-bold text-white mb-4">The Obvious Choice</h2>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border border-slate-700/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20">
                    <th className="p-6 text-slate-400 font-medium w-1/3">Capabilities</th>
                    <th className="p-6 text-slate-400 font-medium text-center border-r border-white/5 w-1/3">Manual / Basic Tools</th>
                    <th className="p-6 text-white font-semibold text-center bg-blue-900/20 w-1/3 text-lg">AdvertiseIQ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["Bid Optimization Frequency", "Daily/Weekly", "Hourly (Intra-day)"],
                    ["Keyword Harvesting", "Manual reviews", "Automated AI rules"],
                    ["Inventory Awareness", "None", "Real-time pausing"],
                    ["Profit Tracking (COGS)", "Spreadsheets", "Native integration"],
                    ["Custom Automation Rules", "Basic IF/THEN", "Advanced logic trees"],
                    ["Dayparting", "Platform limits", "Granular scheduling"],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-6 text-slate-300 font-medium">{row[0]}</td>
                      <td className="p-6 text-slate-500 text-center border-r border-white/5">
                        {row[1] === "None" ? <Minus className="w-5 h-5 mx-auto opacity-50" /> : row[1]}
                      </td>
                      <td className="p-6 text-blue-200 text-center bg-blue-900/10 font-medium">
                        {row[2]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10" />
        <div className="absolute -left-[20%] top-0 w-[50%] h-full bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-['Manrope'] font-bold text-white mb-4">Calculate Your <span className="text-gradient">ROI</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">See how much revenue you could recover with AdvertiseIQ.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="glass-card rounded-2xl p-8 lg:p-10">
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-medium text-slate-300">Monthly Ad Spend</label>
                    <div className="text-2xl font-bold text-white">${adSpend[0].toLocaleString()}</div>
                  </div>
                  <Slider 
                    defaultValue={[50000]} 
                    max={500000} 
                    min={5000} 
                    step={5000}
                    value={adSpend}
                    onValueChange={setAdSpend}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>$5k</span>
                    <span>$500k+</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-medium text-slate-300">Current ACoS</label>
                    <div className="text-2xl font-bold text-white">{acos[0]}%</div>
                  </div>
                  <Slider 
                    defaultValue={[35]} 
                    max={100} 
                    min={10} 
                    step={1}
                    value={acos}
                    onValueChange={setAcos}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>10%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="glass-card rounded-2xl p-8 border-green-500/30 bg-green-900/10">
                <div className="text-sm text-green-400 font-medium uppercase tracking-wider mb-2">Estimated Monthly Savings</div>
                <div className="text-5xl font-bold text-white mb-2">
                  ${Math.round((adSpend[0] * (acos[0]/100)) * 0.15).toLocaleString()}
                </div>
                <p className="text-slate-400 text-sm">Through reduced wasted spend and better targeting</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="glass-card rounded-xl p-6">
                  <div className="text-sm text-slate-400 font-medium mb-2">Projected New ACoS</div>
                  <div className="text-3xl font-bold text-blue-400">
                    {Math.max(10, Math.round(acos[0] * 0.82))}%
                  </div>
                </div>
                <div className="glass-card rounded-xl p-6">
                  <div className="text-sm text-slate-400 font-medium mb-2">Hours Saved</div>
                  <div className="text-3xl font-bold text-purple-400">
                    {Math.round(adSpend[0] / 5000)}h/mo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6" id="customers">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-['Manrope'] font-bold text-white mb-4">Trusted by Top Brands</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "Amazon Brand Owner", metric: "+42% Sales", color: "bg-blue-500", quote: "AdvertiseIQ completely transformed our Amazon strategy. We reduced our ACoS by 15% while scaling sales by over 40% in just 3 months. The inventory protection alone paid for the software." },
              { name: "Michael Chen", role: "Agency Director", metric: "3x Client Capacity", color: "bg-purple-500", quote: "As an agency, we were maxed out on how many accounts our team could manage. The automation rules allowed us to triple our client roster without hiring more account managers." },
              { name: "Elena Rodriguez", role: "CMO, TechGear", metric: "2.5x ROAS", color: "bg-green-500", quote: "The profit analytics and intra-day bidding are game changers. We finally have a true picture of our margins after Amazon fees, and the AI optimizes for net profit, not just top-line revenue." }
            ].map((test, i) => (
              <div key={i} className="glass-card rounded-2xl p-8 flex flex-col relative">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5" />
                <div className="flex text-yellow-500 mb-6 gap-1">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-300 text-lg leading-relaxed mb-8 flex-1">"{test.quote}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className={`w-12 h-12 rounded-full ${test.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{test.name}</div>
                    <div className="text-sm text-slate-400">{test.role}</div>
                  </div>
                </div>
                <Badge className="absolute -top-3 left-8 bg-black border border-white/10 text-white px-3 py-1">{test.metric}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 border-t border-white/5 bg-slate-900/30" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-['Manrope'] font-bold text-white mb-4">Simple, Transparent <span className="text-gradient">Pricing</span></h2>
            <p className="text-slate-400 text-lg mb-8">No hidden fees or percentage of ad spend.</p>
            
            <div className="inline-flex items-center glass-card p-1 rounded-full mx-auto">
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${!annualBilling ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setAnnualBilling(false)}
              >
                Monthly
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${annualBilling ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setAnnualBilling(true)}
              >
                Annually <span className="text-green-400 ml-1">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Starter */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-2">Starter</h3>
              <p className="text-sm text-slate-400 mb-6">For emerging brands</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">${annualBilling ? '39' : '49'}</span>
                <span className="text-slate-400">/mo</span>
              </div>
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white mb-8 h-12">Start Trial</Button>
              <ul className="space-y-4">
                {["Up to $10k monthly spend", "Basic automation rules", "Daily sync frequency", "Email support"].map((f, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-300">
                    <Check className="w-4 h-4 text-blue-400 mr-3 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional */}
            <div className="glass-card rounded-2xl p-8 border border-blue-500/50 relative glow-effect md:-mt-8 md:mb-8 bg-blue-900/10">
              <div className="absolute top-0 inset-x-0 flex justify-center -mt-3.5">
                <Badge className="bg-gradient-primary text-white border-0 px-3 py-1 uppercase tracking-widest text-[10px] font-bold">Most Popular</Badge>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Professional</h3>
              <p className="text-sm text-blue-200 mb-6">For growing sellers & agencies</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">${annualBilling ? '119' : '149'}</span>
                <span className="text-slate-400">/mo</span>
              </div>
              <Button className="w-full bg-gradient-primary hover:opacity-90 text-white border-0 glow-effect h-12 mb-8">Start Free Trial</Button>
              <ul className="space-y-4">
                {["Up to $100k monthly spend", "Advanced AI Bid algorithms", "Hourly sync & dayparting", "Inventory protection", "Priority support"].map((f, i) => (
                  <li key={i} className="flex items-center text-sm text-white">
                    <Check className="w-4 h-4 text-blue-400 mr-3 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enterprise */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
              <p className="text-sm text-slate-400 mb-6">For large brands & aggregators</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white mb-8 h-12">Contact Sales</Button>
              <ul className="space-y-4">
                {["Unlimited ad spend", "Custom AI models", "Dedicated Success Manager", "API access", "White-label reporting"].map((f, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-300">
                    <Check className="w-4 h-4 text-purple-400 mr-3 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-['Manrope'] font-bold text-white">Questions?</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "How does AdvertiseIQ integrate with Amazon?", a: "We use the official Amazon Advertising API. Setup takes less than 2 minutes—you just click 'Connect to Amazon' and authorize the connection. No technical knowledge required." },
              { q: "Can I connect multiple seller accounts?", a: "Yes, our Professional and Enterprise plans support multiple Amazon seller accounts and regional marketplaces under a single dashboard." },
              { q: "What marketplaces are supported?", a: "We support all major Amazon marketplaces including US, CA, MX, UK, DE, FR, IT, ES, IN, JP, and AU." },
              { q: "Is there a free trial available?", a: "Yes, we offer a 14-day full-featured free trial on Starter and Professional plans. No credit card required to start." }
            ].map((faq, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-white text-lg">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-400">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-20" />
        <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto relative z-10 text-center glass-card p-12 md:p-20 rounded-3xl border-blue-500/30">
          <h2 className="text-4xl md:text-6xl font-['Manrope'] font-bold text-white mb-6 tracking-tight">Ready To Scale Your Amazon Business?</h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">Join hundreds of top sellers maximizing their ROAS with intelligent automation.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="h-14 bg-white text-blue-900 hover:bg-slate-100 font-bold text-lg rounded-full px-8">
              Start 14-Day Free Trial
            </Button>
            <Button variant="outline" className="h-14 border-white/20 bg-black/20 hover:bg-white/10 text-white font-medium text-lg rounded-full px-8">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-gradient-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-['Manrope'] font-bold text-white">AdvertiseIQ</span>
            </div>
            <p className="text-slate-400 max-w-xs">
              The enterprise-grade platform for Amazon advertising automation and intelligence.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>© {new Date().getFullYear()} AdvertiseIQ, Inc. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
