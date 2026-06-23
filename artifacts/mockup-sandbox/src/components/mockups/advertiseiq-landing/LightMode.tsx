import React, { useState, useEffect } from 'react';
import { 
  Menu, Sun, X, CheckCircle2, XCircle, 
  ChevronRight, Star, ArrowRight, Play,
  BarChart3, Target, Zap, ShieldAlert,
  Clock, TrendingUp, ChevronDown
} from 'lucide-react';

export function LightMode() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [monthlySpend, setMonthlySpend] = useState(50000);
  const [currentAcos, setCurrentAcos] = useState(35);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter',sans-serif] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bg-gradient-primary {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-xl leading-none">A</div>
            <span className="font-['Manrope',sans-serif] font-bold text-xl tracking-tight text-slate-900">AdvertiseIQ</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#customers" className="hover:text-blue-600 transition-colors">Customers</a>
            <a href="#resources" className="hover:text-blue-600 transition-colors">Resources</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Sun className="w-5 h-5" />
            </button>
            <button className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
              Log in
            </button>
            <button className="text-sm font-semibold text-white bg-gradient-primary px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all">
              Start Free Trial
            </button>
          </div>
          
          <button className="md:hidden text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        {/* Subtle grid background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        {/* Decorative blur blobs */}
        <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute top-40 right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-400/20 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>AdvertiseIQ AI Engine 2.0 is now live</span>
          </div>
          
          <h1 className="font-['Manrope',sans-serif] text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mb-6 leading-[1.1]">
            Stop Managing Amazon Ads. <br />
            <span className="text-gradient">Start Automating Growth.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
            The enterprise-grade platform that uses advanced AI to optimize bids, discover high-converting keywords, and scale your Amazon revenue on autopilot.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-primary text-white font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
              Start 14-Day Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-700 font-semibold text-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
              <Play className="w-5 h-5" />
              Book Live Demo
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500">No credit card required • Setup in 5 minutes</p>

          {/* Dashboard Mockup */}
          <div className="mt-20 w-full max-w-5xl relative animate-float">
            <div className="relative rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-xl shadow-2xl shadow-blue-900/5 p-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-white/80 z-0"></div>
              
              <div className="relative z-10 rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
                {/* Mockup Header */}
                <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="h-6 w-64 bg-white border border-slate-200 rounded-md shadow-sm"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                  </div>
                </div>
                
                {/* Mockup Content */}
                <div className="flex-1 p-6 grid grid-cols-12 gap-6 bg-slate-50/30">
                  <div className="col-span-3 space-y-4">
                    <div className="h-24 bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col justify-center">
                      <div className="text-sm text-slate-500 mb-1">Total Ad Spend</div>
                      <div className="text-2xl font-bold text-slate-900">$124,592</div>
                    </div>
                    <div className="h-24 bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col justify-center">
                      <div className="text-sm text-slate-500 mb-1 flex items-center justify-between">
                        Overall ROAS
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+32%</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">4.8x</div>
                    </div>
                    <div className="h-24 bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col justify-center">
                      <div className="text-sm text-slate-500 mb-1">Avg. ACoS</div>
                      <div className="text-2xl font-bold text-slate-900">20.8%</div>
                    </div>
                  </div>
                  
                  <div className="col-span-9 bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <div className="font-semibold text-slate-900">Revenue vs Spend</div>
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-slate-100 rounded"></div>
                        <div className="h-6 w-16 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-end gap-2 mt-auto pb-4">
                      {/* CSS Bar Chart */}
                      {[40, 60, 45, 80, 55, 90, 70, 100, 85, 65, 75, 95].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col gap-1 justify-end group">
                          <div className="w-full bg-blue-100 rounded-t-sm relative transition-all duration-300 group-hover:bg-blue-200" style={{ height: `\${height}%` }}>
                            <div className="absolute bottom-0 left-0 w-full bg-blue-600 rounded-t-sm transition-all duration-300 group-hover:bg-blue-500" style={{ height: `\${height * 0.4}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Metric Cards */}
            <div className="absolute -left-12 top-1/4 animate-float-delayed z-20">
              <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">Sales Up</div>
                  <div className="text-lg font-bold text-slate-900">+$12,450 Today</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 bottom-1/4 animate-float z-20" style={{ animationDelay: '0.5s' }}>
              <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">Auto-Optimized</div>
                  <div className="text-lg font-bold text-slate-900">342 Bids Updated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-slate-200">
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 font-['Manrope',sans-serif] mb-2">$100M+</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Ad Spend Managed</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 font-['Manrope',sans-serif] mb-2">500K+</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Automated Optimizations</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-green-600 font-['Manrope',sans-serif] mb-2">25%</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Avg ROAS Improvement</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 font-['Manrope',sans-serif] mb-2">99.9%</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Platform Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="py-24 bg-white" id="solutions">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-['Manrope',sans-serif] mb-4">The Old Way vs. The AdvertiseIQ Way</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Manual campaign management drains your time and budget. Our AI platform transforms complex advertising tasks into automated revenue generation.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Problems */}
            <div className="space-y-4">
              <div className="text-xl font-bold text-slate-400 mb-6 font-['Manrope',sans-serif]">Without AdvertiseIQ</div>
              {[
                { title: 'High ACoS & Wasted Spend', desc: 'Bleeding budget on non-converting terms' },
                { title: 'Manual Bid Adjustments', desc: 'Hours spent downloading and uploading bulk sheets' },
                { title: 'Missed Keyword Opportunities', desc: 'Competitors outranking you on hidden gems' },
                { title: 'Stockout Nightmares', desc: 'Wasting ad spend on products that are out of stock' },
                { title: 'Stagnant Growth', desc: 'Hitting a plateau because scaling is too complex' },
                { title: 'Fragmented Data', desc: 'Juggling Seller Central, spreadsheets, and guesswork' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100">
                  <div className="mt-0.5">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Solutions */}
            <div className="space-y-4 relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl opacity-5 blur-xl -z-10"></div>
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-primary mb-6 font-['Manrope',sans-serif]">With AdvertiseIQ</div>
              {[
                { title: 'AI-Driven Target ACoS', desc: 'Algorithms continuously shift budget to profitable targets' },
                { title: 'Hourly Bid Automation', desc: 'Reacting to market changes faster than humanly possible' },
                { title: 'Smart Keyword Harvesting', desc: 'Automatically promoting converting search terms to exact match' },
                { title: 'Inventory-Aware Pacing', desc: 'Automatically pausing ads when stock runs low' },
                { title: 'Infinite Scalability', desc: 'Manage 10 or 10,000 campaigns with the same effort' },
                { title: 'Unified Profit Analytics', desc: 'True profit calculation including COGS, fees, and ad spend' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24 bg-slate-50" id="features">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-['Manrope',sans-serif] mb-4">Enterprise Power. Consumer Simplicity.</h2>
              <p className="text-lg text-slate-600">A complete suite of tools designed specifically for brands and agencies looking to dominate their Amazon niche.</p>
            </div>
            <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
              View all features <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Area */}
        <div className="w-full overflow-x-auto hide-scrollbar pb-12 pt-4 px-6 snap-x snap-mandatory flex gap-6">
          <div className="w-4 flex-shrink-0"></div> {/* Left padding spacer */}
          
          {[
            {
              icon: <Zap className="w-6 h-6 text-blue-600" />,
              title: "Campaign Automation",
              bullets: ["Rule-based bid adjustments", "Keyword harvesting logic", "Automated campaign creation", "Search term negation"],
              badge: "Core"
            },
            {
              icon: <Target className="w-6 h-6 text-violet-600" />,
              title: "Keyword Intelligence",
              bullets: ["Competitor conquesting", "Search volume trends", "Share of Voice tracking", "Long-tail discovery"],
              badge: "Popular"
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-emerald-600" />,
              title: "Profit Analytics",
              bullets: ["True profitability view", "COGS & FBA fee deductions", "Brand vs Non-Brand split", "Custom report builder"],
              badge: "Essential"
            },
            {
              icon: <Clock className="w-6 h-6 text-amber-600" />,
              title: "Smart Dayparting",
              bullets: ["Hourly performance analysis", "Schedule-based bid modifiers", "Budget pacing controls", "Time-zone specific"],
              badge: "Advanced"
            },
            {
              icon: <ShieldAlert className="w-6 h-6 text-red-600" />,
              title: "Inventory Protection",
              bullets: ["Stock-level awareness", "Auto-pause campaigns", "Velocity forecasting", "Restock alerts"],
              badge: "Pro"
            }
          ].map((feature, i) => (
            <div key={i} className="flex-shrink-0 w-[340px] snap-center">
              <div className="h-full bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 transition-all">
                    {feature.icon}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">{feature.badge}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-['Manrope',sans-serif]">{feature.title}</h3>
                <ul className="space-y-3">
                  {feature.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          
          <div className="w-4 flex-shrink-0"></div> {/* Right padding spacer */}
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-['Manrope',sans-serif] mb-4">Calculate Your True Potential</h2>
              <p className="text-lg text-slate-600 mb-8">See how much revenue you're leaving on the table and how much you could save with our AI optimization engine.</p>
              
              <div className="space-y-8 bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-semibold text-slate-900">Monthly Ad Spend</label>
                    <span className="text-blue-600 font-bold">${monthlySpend.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="500000" 
                    step="1000"
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>$1k</span>
                    <span>$500k+</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-semibold text-slate-900">Current ACoS</label>
                    <span className="text-blue-600 font-bold">{currentAcos}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    step="1"
                    value={currentAcos}
                    onChange={(e) => setCurrentAcos(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>5%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                
                <h3 className="text-xl font-medium text-white mb-8 font-['Manrope',sans-serif]">Projected 30-Day Impact</h3>
                
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="text-slate-400 text-sm mb-1">Estimated Ad Spend Savings</div>
                    <div className="text-3xl font-bold text-white">${Math.round(monthlySpend * 0.15).toLocaleString()}</div>
                    <div className="text-sm text-green-400 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      15% reduction in wasted spend
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600/20 to-violet-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
                    <div className="relative z-10">
                      <div className="text-blue-200 text-sm mb-1">Projected New Revenue</div>
                      <div className="text-4xl font-bold text-white mb-2">
                        ${Math.round((monthlySpend / (currentAcos/100)) * 1.25).toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-300">
                        Based on 25% avg. improvement in ROAS
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button className="w-full py-4 rounded-xl bg-white text-slate-900 font-bold text-lg hover:bg-slate-50 transition-colors">
                    Start Achieving These Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50" id="customers">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-['Manrope',sans-serif] mb-4">Trusted by Top Amazon Sellers</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">See how brands and agencies are scaling profitably with AdvertiseIQ.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "We were struggling to scale past $500k/month without our ACoS exploding. AdvertiseIQ's hourly bidding algorithm found the sweet spots we couldn't see.",
                name: "Sarah Jenkins",
                role: "CMO, Elevate Health",
                metric: "+42% Revenue",
                color: "bg-blue-500"
              },
              {
                quote: "The keyword harvesting is practically magic. It discovered long-tail converting terms that our competitors were completely ignoring. ROI was instant.",
                name: "David Chen",
                role: "Founder, Peak Outdoors",
                metric: "2.5x ROAS",
                color: "bg-violet-500"
              },
              {
                quote: "As an agency managing 40+ brands, we used to have 6 full-time media buyers. Now we manage twice the ad spend with half the team, with better results.",
                name: "Marcus Rodriguez",
                role: "Director, AmzGrowth Agency",
                metric: "15 hrs saved/wk",
                color: "bg-emerald-500"
              }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-700 mb-8 flex-1 leading-relaxed">"{t.quote}"</p>
                
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.color} text-white flex items-center justify-center font-bold text-lg`}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">{t.metric}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-['Manrope',sans-serif] mb-4">Transparent Pricing for Every Stage</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">No percentage of ad spend. Simple, flat monthly rates based on your feature needs.</p>
            
            <div className="inline-flex bg-slate-100 p-1 rounded-full">
              <button 
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Starter */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
              <p className="text-slate-500 text-sm mb-6">For emerging brands under $10k/mo ad spend</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-slate-900">${billingCycle === 'monthly' ? '49' : '39'}</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Basic rule automation', 'Daily bid updates', '1 Marketplace', 'Email support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-slate-300" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Professional */}
            <div className="relative bg-slate-900 p-8 rounded-3xl shadow-2xl scale-105 border border-slate-800 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-primary text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
              <p className="text-slate-400 text-sm mb-6">For scaling brands and serious sellers</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">${billingCycle === 'monthly' ? '149' : '119'}</span>
                <span className="text-slate-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['AI algorithmic bidding', 'Hourly bid updates', 'Unlimited Marketplaces', 'Keyword Harvesting', 'Profit Analytics', 'Priority Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl bg-gradient-primary text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <p className="text-slate-500 text-sm mb-6">For agencies and high-volume brands</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-slate-900">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Custom AI models', 'API Access', 'White-label reporting', 'Dedicated Account Manager', 'Custom integrations'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-slate-300" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-['Manrope',sans-serif] mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How long does it take for the AI to learn my campaigns?",
                a: "Our algorithm begins analyzing historical data immediately upon connection. Most users see noticeable performance improvements within the first 3-5 days, with optimal AI calibration typically reached around day 14."
              },
              {
                q: "Does AdvertiseIQ support multiple Amazon regions?",
                a: "Yes, our Professional and Enterprise plans support unlimited Amazon marketplaces (North America, Europe, Asia Pacific) from a single unified dashboard."
              },
              {
                q: "What happens if I pause my subscription?",
                a: "Your Amazon campaigns will continue running exactly as they are currently configured. We never delete or drastically alter your base campaign structures. However, you will lose the automated bid adjustments and AI rules."
              },
              {
                q: "Is there a limit on how much ad spend I can manage?",
                a: "No! Unlike other platforms that charge a percentage of your ad spend (essentially taxing your growth), our pricing is a flat monthly fee regardless of whether you spend $5k or $500k."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <button 
                  className="w-full px-6 py-5 text-left flex justify-between items-center font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${expandedFaq === i ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-violet-600/30 z-0"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white font-['Manrope',sans-serif] mb-6">
            Ready To Scale Your Amazon Business?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of sellers who have automated their Amazon PPC and dramatically increased their profit margins.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:shadow-xl hover:shadow-white/10 transition-all flex items-center justify-center gap-2">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent text-white font-bold text-lg border border-white/20 hover:bg-white/5 transition-all flex items-center justify-center">
              View Pricing
            </button>
          </div>
          <p className="mt-6 text-sm text-blue-200/60">14-day free trial • Cancel anytime • No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-xl leading-none">A</div>
                <span className="font-['Manrope',sans-serif] font-bold text-xl tracking-tight text-slate-900">AdvertiseIQ</span>
              </div>
              <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
                The enterprise-grade Amazon Advertising platform that uses advanced AI to optimize bids, discover keywords, and scale your revenue.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholder */}
                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-colors flex items-center justify-center text-slate-400 cursor-pointer">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-colors flex items-center justify-center text-slate-400 cursor-pointer">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4 font-['Manrope',sans-serif]">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Integrations</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4 font-['Manrope',sans-serif]">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Amazon PPC Guide</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4 font-['Manrope',sans-serif]">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Contact</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Partners</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© {new Date().getFullYear()} AdvertiseIQ. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
