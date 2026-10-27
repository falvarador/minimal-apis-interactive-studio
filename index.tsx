import React, { useState, useEffect } from 'react';
import { 
  Terminal, Code2, Play, Shield, FileText, Layers, 
  CheckCircle2, AlertTriangle, XCircle, ArrowRight, 
  Database, Lock, Unlock, Sparkles, BookOpen, 
  ChevronRight, ChevronLeft, RefreshCw, Search, 
  Sliders, Eye, Server, Cpu, Key, Check, Copy,
  HelpCircle, Zap, Box, GitBranch, Filter
} from 'lucide-react';

const INITIAL_DISHES = [
  { 
    id: "d1a2b3c4-1111-4000-8000-000000000001", 
    name: "Rendang", 
    ingredients: [
      { id: "i1", name: "Beef" },
      { id: "i2", name: "Coconut Milk" },
      { id: "i3", name: "Lemongrass" },
      { id: "i4", name: "Chili" }
    ]
  },
  { 
    id: "d1a2b3c4-2222-4000-8000-000000000002", 
    name: "Mussels with French Fries", 
    ingredients: [
      { id: "i5", name: "Mussels" },
      { id: "i6", name: "Potatoes" },
      { id: "i7", name: "Celery" },
      { id: "i8", name: "White Wine" }
    ]
  },
  { 
    id: "d1a2b3c4-3333-4000-8000-000000000003", 
    name: "Waterzooi", 
    ingredients: [
      { id: "i9", name: "Chicken" },
      { id: "i10", name: "Carrots" },
      { id: "i11", name: "Leeks" },
      { id: "i12", name: "Cream" }
    ]
  }
];

const MODULES = [
  {
    id: "intro",
    number: "01",
    title: "Foundations & HTTP Pipeline",
    subtitle: "Minimal APIs vs MVC, WebApplicationBuilder & Middleware",
    icon: Layers,
    color: "from-violet-500 to-indigo-600",
    badge: "Pages 1–7"
  },
  {
    id: "routing",
    number: "02",
    title: "DI, Routing & DTO Mapping",
    subtitle: "Lifetimes, Route Constraints, Object Cycles & Parameter Binding",
    icon: GitBranch,
    color: "from-blue-500 to-cyan-500",
    badge: "Pages 7–15"
  },
  {
    id: "responses",
    number: "03",
    title: "Responses, TypedResults & Errors",
    subtitle: "IResult vs TypedResults, Status Codes & RFC 9457 Problem Details",
    icon: Zap,
    color: "from-emerald-500 to-teal-600",
    badge: "Pages 15–21"
  },
  {
    id: "crud",
    number: "04",
    title: "CRUD Lab & MapGroup",
    subtitle: "Interactive .http Simulator, CreatedAtRoute & Route Groups",
    icon: Database,
    color: "from-amber-500 to-orange-600",
    badge: "Pages 21–27"
  },
  {
    id: "architecture",
    number: "05",
    title: "Validation, Structure & Logging",
    subtitle: ".NET 10 AddValidation(), Handler Refactoring & Structured ILogger",
    icon: Code2,
    color: "from-pink-500 to-rose-600",
    badge: "Pages 27–33"
  },
  {
    id: "security",
    number: "06",
    title: "JWT Security & Policies",
    subtitle: "dotnet user-jwts Lab, ClaimsPrincipal & RequireAdminFromBelgium",
    icon: Shield,
    color: "from-purple-500 to-fuchsia-600",
    badge: "Pages 33–39"
  },
  {
    id: "openapi",
    number: "07",
    title: "OpenAPI, Scalar UI & Showdown",
    subtitle: "Built-in OpenAPI, Document Transformers & Final Architecture Matrix",
    icon: BookOpen,
    color: "from-cyan-500 to-blue-600",
    badge: "Pages 39–44"
  }
];

const CodeWindow = ({ title, code, highlightLines = [], badge = "C# 14 / .NET 10" }) => {
  const [copied, setCopied] = useState(false);
  const lines = code.trim().split('\n');

  const handleCopy = () => {
    const el = document.createElement('textarea');
    el.value = code.trim();
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl my-3">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-xs font-mono text-slate-300 font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">
            {badge}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const isHighlighted = highlightLines.includes(lineNum);
          return (
            <div 
              key={idx} 
              className={`flex items-start px-2 py-0.5 rounded ${
                isHighlighted ? 'bg-violet-500/20 border-l-2 border-violet-400' : ''
              }`}
            >
              <span className="w-7 select-none text-slate-600 text-right pr-3 shrink-0">
                {lineNum}
              </span>
              <span className="text-slate-200 whitespace-pre">{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Module1Intro = () => {
  const [archTab, setArchTab] = useState('minimal');
  const [useControllers, setUseControllers] = useState(false);
  const [enableOpenApi, setEnableOpenApi] = useState(false);
  const [authType, setAuthType] = useState('None');
  const [pipelineStep, setPipelineStep] = useState(0);
  const [isAnimatingPipeline, setIsAnimatingPipeline] = useState(false);
  const [requestUrl, setRequestUrl] = useState('http://localhost:5034/weatherforecast');

  useEffect(() => {
    let timer;
    if (isAnimatingPipeline) {
      timer = setInterval(() => {
        setPipelineStep((prev) => {
          if (prev >= 5) {
            setIsAnimatingPipeline(false);
            return 5;
          }
          return prev + 1;
        });
      }, 850);
    }
    return () => clearInterval(timer);
  }, [isAnimatingPipeline]);

  const triggerPipeline = () => {
    setPipelineStep(1);
    setIsAnimatingPipeline(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-900/40 via-slate-900 to-indigo-950/40 border border-violet-500/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Instructor: Kevin Dockx (Solution Architect & Microsoft MVP)
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
              Getting Started with ASP.NET Core 10 Minimal APIs
            </h2>
            <p className="text-slate-300 mt-2 max-w-3xl text-sm sm:text-base leading-relaxed">
              Minimal APIs provide a streamlined, low-ceremony approach to building fast HTTP APIs in .NET 10 without the scaffolding of Model-View-Controller (MVC). Let's explore how they compare and inspect our initial <code className="text-violet-300">DishesAPI</code> project!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive MVC vs Minimal API Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-violet-400" />
                Architectural Pattern Explorer
              </h3>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setArchTab('minimal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    archTab === 'minimal' 
                      ? 'bg-violet-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Minimal API
                </button>
                <button
                  onClick={() => setArchTab('mvc')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    archTab === 'mvc' 
                      ? 'bg-indigo-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ASP.NET Core MVC
                </button>
              </div>
            </div>

            {archTab === 'minimal' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/30">
                  <div className="text-xs font-semibold uppercase tracking-wider text-violet-300 mb-2">
                    Direct Route-to-Handler Pipeline
                  </div>
                  <div className="flex items-center justify-between gap-2 text-center py-3">
                    <div className="flex-1 p-3 rounded-lg bg-slate-900 border border-slate-700">
                      <div className="text-xs text-slate-400">HTTP Request</div>
                      <div className="font-mono text-xs text-emerald-400 mt-1">GET /dishes</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-violet-400 shrink-0 animate-pulse" />
                    <div className="flex-1 p-3 rounded-lg bg-violet-600/20 border border-violet-500">
                      <div className="text-xs text-violet-200">Route Handler</div>
                      <div className="font-mono text-xs text-white mt-1">Lambda / Static Method</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-violet-400 shrink-0 animate-pulse" />
                    <div className="flex-1 p-3 rounded-lg bg-slate-900 border border-slate-700">
                      <div className="text-xs text-slate-400">JSON View</div>
                      <div className="font-mono text-xs text-cyan-400 mt-1">TypedResults.Ok</div>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                    <span><strong>Zero Ceremony:</strong> Maps URI + HTTP verb directly to a delegate or static method.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                    <span><strong>Ideal Use Cases:</strong> Microservices, lightweight APIs, proxy/aggregate APIs, JSON-first backends.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                    <span><strong>Out-of-the-box Tradeoffs:</strong> No built-in XML content negotiation or full MVC filter pipeline (unless using libraries like Carter).</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-2">
                    Model-View-Controller Triad
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center py-3">
                    <div className="p-3 rounded-lg bg-slate-900 border border-indigo-500/40">
                      <div className="font-bold text-indigo-300 text-xs">Controller</div>
                      <div className="text-[11px] text-slate-400 mt-1">Accepts input & orchestrates logic</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-indigo-500/40">
                      <div className="font-bold text-indigo-300 text-xs">Model</div>
                      <div className="text-[11px] text-slate-400 mt-1">Data, business rules & state</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-indigo-500/40">
                      <div className="font-bold text-indigo-300 text-xs">View (JSON)</div>
                      <div className="text-[11px] text-slate-400 mt-1">Formatted representation</div>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                    <span><strong>Full Filter Pipeline:</strong> Granular Action, Resource, Result, Authorization & Exception filters.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                    <span><strong>Content Negotiation:</strong> Built-in support for `Accept: application/xml`, CSV, or custom formatters.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                    <span><strong>Shared Core:</strong> Uses the exact same DI container, routing engine, and Auth middleware as Minimal APIs!</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>EF Core SQLite Data Layer: <code className="text-emerald-400">Dishes.db</code></span>
            <span>C# <code className="text-violet-300">required</code> + <code className="text-violet-300">[SetsRequiredMembers]</code></span>
          </div>
        </div>

        {/* Visual Studio 2026 New Project Wizard Simulator */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              Visual Studio 2026 Template Wizard
            </h3>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              DishesAPI.csproj
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Toggle the project template options below to see why Kevin unchecks everything when starting from scratch:
          </p>

          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-900 transition-colors">
              <div>
                <div className="text-sm font-medium text-white">Use controllers</div>
                <div className="text-xs text-slate-400">Uncheck to use Minimal APIs instead of MVC Controllers</div>
              </div>
              <input 
                type="checkbox" 
                checked={useControllers} 
                onChange={(e) => setUseControllers(e.target.checked)}
                className="w-5 h-5 accent-violet-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-900 transition-colors">
              <div>
                <div className="text-sm font-medium text-white">Enable OpenAPI support</div>
                <div className="text-xs text-slate-400">We uncheck to build OpenAPI + Scalar cleanly from scratch in Module 7</div>
              </div>
              <input 
                type="checkbox" 
                checked={enableOpenApi} 
                onChange={(e) => setEnableOpenApi(e.target.checked)}
                className="w-5 h-5 accent-violet-500 rounded cursor-pointer"
              />
            </label>

            <div className="flex items-center justify-between p-2">
              <div>
                <div className="text-sm font-medium text-white">Authentication Type</div>
                <div className="text-xs text-slate-400">Start with None to avoid template magic; configure JWT manually later</div>
              </div>
              <select 
                value={authType}
                onChange={(e) => setAuthType(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
              >
                <option value="None">None (Course Default)</option>
                <option value="MicrosoftIdentity">Microsoft Identity Platform</option>
              </select>
            </div>
          </div>

          <CodeWindow
            title="Generated Program.cs Preview"
            badge={useControllers ? "MVC Template" : "Minimal API Template"}
            code={
              useControllers
                ? `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers(); // <-- MVC Ceremony
${enableOpenApi ? 'builder.Services.AddOpenApi();\n' : ''}var app = builder.Build();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();`
                : `var builder = WebApplication.CreateBuilder(args);
// Register EF Core SQLite DbContext
builder.Services.AddDbContext<DishesDbContext>(o => 
    o.UseSqlite(builder.Configuration["ConnectionStrings:DishesDBConnectionString"]));
${enableOpenApi ? 'builder.Services.AddOpenApi();\n' : ''}
var app = builder.Build();
app.UseHttpsRedirection();

app.MapGet("/weatherforecast", () => "Hello Minimal API!");
app.Run();`
            }
          />
        </div>
      </div>

      {/* Interactive Request Pipeline & Middleware Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              Interactive HTTP Request Pipeline & Middleware Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Watch how an HTTP request travels downstream through middleware in order, hits the route handler, and travels upstream in reverse order!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={requestUrl}
              onChange={(e) => {
                setRequestUrl(e.target.value);
                setPipelineStep(0);
              }}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
            >
              <option value="http://localhost:5034/weatherforecast">GET http://localhost:5034/weatherforecast (200 OK)</option>
              <option value="http://localhost:5034/">GET http://localhost:5034/ (404 Not Found)</option>
            </select>
            <button
              onClick={triggerPipeline}
              disabled={isAnimatingPipeline}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-lg hover:opacity-95 disabled:opacity-50 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              {isAnimatingPipeline ? 'Tracing Request...' : 'Send Request Through Pipeline'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { step: 1, title: "1. Incoming Request", desc: requestUrl, badge: "Downstream →" },
            { step: 2, title: "2. UseHttpsRedirection", desc: "Redirects HTTP :5034 to HTTPS :7290", badge: "Middleware 1" },
            { step: 3, title: "3. Endpoint Routing", desc: requestUrl.endsWith('/weatherforecast') ? "Matches MapGet('/weatherforecast')" : "No matching route found!", badge: "Middleware 2" },
            { step: 4, title: "4. Route Handler", desc: requestUrl.endsWith('/weatherforecast') ? "Executes delegate & creates array" : "Skipped (Returns 404)", badge: "Delegate" },
            { step: 5, title: "5. Upstream Response", desc: requestUrl.endsWith('/weatherforecast') ? "200 OK + JSON Payload" : "404 Not Found (Server is alive!)", badge: "← Upstream" }
          ].map((item) => {
            const active = pipelineStep === item.step;
            const passed = pipelineStep > item.step;
            return (
              <div
                key={item.step}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  active
                    ? 'bg-emerald-500/20 border-emerald-400 scale-[1.03] shadow-lg shadow-emerald-500/10'
                    : passed
                    ? 'bg-slate-800/80 border-emerald-500/40'
                    : 'bg-slate-950 border-slate-800 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className={active ? 'text-emerald-300 font-bold' : 'text-slate-400'}>{item.badge}</span>
                  {passed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="font-bold text-sm text-white mb-1">{item.title}</div>
                <div className="text-xs text-slate-300 font-mono break-all">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Module2Routing = () => {
  const [testParam, setTestParam] = useState('d1a2b3c4-1111-4000-8000-000000000001');
  const [useConstraint, setUseConstraint] = useState(true);
  const [useDtoMode, setUseDtoMode] = useState(false);

  const isGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(testParam);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* DI Lifetimes Visual Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Box className="w-5 h-5 text-blue-400" />
          Dependency Injection (IoC) Lifetimes in Minimal APIs
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-5">
          In Minimal APIs, you don't need constructor injection—simply pass registered services (like <code className="text-cyan-300">DishesDbContext</code>) directly as parameters to your route handler delegate!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-blue-400">AddTransient&lt;T&gt;()</span>
              <span className="px-2 py-0.5 text-[10px] rounded bg-blue-500/20 text-blue-300">Every Request to Container</span>
            </div>
            <p className="text-xs text-slate-300">
              A brand-new instance is created every single time the service is requested from the container, even multiple times within the same HTTP request.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 ring-1 ring-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-emerald-400">AddScoped&lt;T&gt;()</span>
              <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300">Per HTTP Request (DbContext)</span>
            </div>
            <p className="text-xs text-slate-300">
              One instance is created per HTTP request scope and reused throughout that single request. <code className="text-emerald-300">AddDbContext</code> uses Scoped by default!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-purple-400">AddSingleton&lt;T&gt;()</span>
              <span className="px-2 py-0.5 text-[10px] rounded bg-purple-500/20 text-purple-300">Application Lifetime</span>
            </div>
            <p className="text-xs text-slate-300">
              Created once on first request and shared across all HTTP requests and threads for the entire lifetime of the web application.
            </p>
          </div>
        </div>
      </div>

      {/* Route Constraints & AmbiguousMatchException Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              Route Constraints & Ambiguous Match Lab
            </h3>
            <label className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={useConstraint}
                onChange={(e) => setUseConstraint(e.target.checked)}
                className="accent-cyan-400"
              />
              <span className="text-cyan-300 font-mono">:guid Constraint</span>
            </label>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            What happens when you expose both <code className="text-slate-200">/dishes/&#123;dishId&#125;</code> and <code className="text-slate-200">/dishes/&#123;dishName&#125;</code>? Test with or without the <code className="text-cyan-300">:guid</code> route constraint!
          </p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTestParam('d1a2b3c4-1111-4000-8000-000000000001')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                isGuid ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Test GUID (/dishes/d1a2...0001)
            </button>
            <button
              onClick={() => setTestParam('Rendang')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                !isGuid ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Test Name (/dishes/Rendang)
            </button>
          </div>

          <CodeWindow
            title="Route Registration"
            code={
              useConstraint
                ? `// Constrained route resolves ambiguity!
app.MapGet("/dishes/{dishId:guid}", async (DishesDbContext db, Guid dishId) => 
    await db.Dishes.FirstOrDefaultAsync(d => d.Id == dishId));

app.MapGet("/dishes/{dishName}", async (DishesDbContext db, string dishName) => 
    await db.Dishes.FirstOrDefaultAsync(d => d.Name == dishName));`
                : `// WARNING: Both routes match any segment!
app.MapGet("/dishes/{dishId}", async (DishesDbContext db, Guid dishId) => ...);
app.MapGet("/dishes/{dishName}", async (DishesDbContext db, string dishName) => ...);`
            }
          />

          <div className={`p-4 rounded-xl border font-mono text-xs ${
            !useConstraint 
              ? 'bg-rose-950/40 border-rose-500/50 text-rose-200' 
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
          }`}>
            {!useConstraint ? (
              <div>
                <div className="font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                  <XCircle className="w-4 h-4" />
                  500 Internal Server Error: AmbiguousMatchException
                </div>
                <div>The request matched multiple endpoints:</div>
                <div>- HTTP: GET /dishes/&#123;dishId&#125;</div>
                <div>- HTTP: GET /dishes/&#123;dishName&#125;</div>
              </div>
            ) : (
              <div>
                <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  200 OK — Matched: {isGuid ? 'GET /dishes/{dishId:guid}' : 'GET /dishes/{dishName}'}
                </div>
                <div>Bound Parameter: {isGuid ? `Guid dishId = ${testParam}` : `string dishName = "${testParam}"`}</div>
              </div>
            )}
          </div>
        </div>

        {/* Object Cycle Visualizer: Entity vs DTO */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-400" />
                Why You Shouldn't Expose Entities Directly
              </h3>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setUseDtoMode(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    !useDtoMode ? 'bg-rose-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Raw Entity (Cycle!)
                </button>
                <button
                  onClick={() => setUseDtoMode(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    useDtoMode ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  DTO + Extension
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              When fetching <code className="text-slate-200">/dishes/&#123;dishId&#125;/ingredients</code> with <code className="text-cyan-300">.Include(d =&gt; d.Ingredients)</code>, the many-to-many navigation properties create an infinite loop during JSON serialization!
            </p>

            {!useDtoMode ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs font-mono space-y-2">
                  <div className="text-rose-300 font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    System.Text.Json.JsonException: A possible object cycle was detected!
                  </div>
                  <div className="text-slate-300 flex items-center gap-2 flex-wrap py-2">
                    <span className="px-2 py-1 rounded bg-slate-900 border border-rose-500/40">Dish (Rendang)</span>
                    <span>→</span>
                    <span className="px-2 py-1 rounded bg-slate-900 border border-rose-500/40">Ingredients[0] (Beef)</span>
                    <span>→</span>
                    <span className="px-2 py-1 rounded bg-slate-900 border border-rose-500/40">Dishes[0] (Rendang)</span>
                    <span>→</span>
                    <span className="text-rose-400 font-bold">∞ INFINITE LOOP</span>
                  </div>
                </div>
                <CodeWindow
                  title="Bad: Returning Entity Graph Directly"
                  code={`app.MapGet("/dishes/{dishId:guid}/ingredients", async (DishesDbContext db, Guid dishId) => {
    // Includes Dishes -> Ingredients -> Dishes -> Ingredients...
    return (await db.Dishes.Include(d => d.Ingredients)
        .FirstOrDefaultAsync(d => d.Id == dishId))?.Ingredients;
});`}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs font-mono space-y-2">
                  <div className="text-emerald-300 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Clean Outward-Facing Contract (IngredientDto)
                  </div>
                  <div className="text-slate-300">
                    Flattens the Many-to-Many relationship into a single <code className="text-emerald-300">DishId</code> property using a zero-dependency <code className="text-cyan-300">.ToIngredientDtoList(dishId)</code> extension method!
                  </div>
                </div>
                <CodeWindow
                  title="Good: MappingExtensions.cs"
                  code={`public static IngredientDto ToIngredientDto(this Ingredient entity, Guid dishId) =>
    new() {
        Id = entity.Id,
        Name = entity.Name,
        DishId = dishId // No circular Dishes collection!
    };`}
                />
              </div>
            )}
          </div>

          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-200">Pro Tip from Course:</strong> For small models, manual extension methods are fast and dependency-free. For large enterprise models, use a source-generator library like <strong>Mapperly</strong> for zero runtime overhead.
          </div>
        </div>
      </div>

      {/* 6-Step Parameter Binding Precedence Rules */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Filter className="w-5 h-5 text-violet-400" />
          Minimal API Parameter Binding Precedence Hierarchy
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          How does ASP.NET Core 10 know where a handler parameter comes from when you omit attributes like <code className="text-violet-300">[FromQuery]</code> or <code className="text-violet-300">[FromServices]</code>? It evaluates rules in this exact order:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { rank: "1", name: "Explicit Attributes", ex: "[FromRoute], [FromQuery], [FromHeader], [FromBody], [FromServices]" },
            { rank: "2", name: "Special Types", ex: "HttpContext, HttpRequest, ClaimsPrincipal, CancellationToken, IFormFile" },
            { rank: "3", name: "BindAsync Method", ex: "Custom types implementing a static valid BindAsync method" },
            { rank: "4", name: "String / TryParse", ex: "Bound from Route if parameter name matches template; otherwise Query String!" },
            { rank: "5", name: "DI Services", ex: "Types registered in builder.Services (e.g., DishesDbContext, ILogger)" },
            { rank: "6", name: "Request Body", ex: "Complex DTOs (e.g., DishForCreationDto) deserialized from JSON body" }
          ].map((rule) => (
            <div key={rule.rank} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono text-xs font-bold mb-2">
                  Rule #{rule.rank}
                </span>
                <div className="font-bold text-white text-sm mb-1">{rule.name}</div>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-2">{rule.ex}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Module3Responses = () => {
  const [returnMode, setReturnMode] = useState('typedExplicit');
  const [envMode, setEnvMode] = useState('Development');
  const [statusCodePages, setStatusCodePages] = useState(true);
  const [simScenario, setSimScenario] = useState('404');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* TypedResults vs Results Compiler Lab */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              Return Types Lab: Why <code className="text-emerald-300">Task&lt;Results&lt;NotFound, Ok&lt;DishDto&gt;&gt;&gt;</code> Matters
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              In Page 18, returning both <code className="text-slate-200">TypedResults.NotFound()</code> and <code className="text-slate-200">TypedResults.Ok(dto)</code> inside an implicit lambda triggers a cryptic compiler error: <span className="text-rose-400 font-mono">Delegate 'RequestDelegate' does not take 2 arguments</span>. Explore why!
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setReturnMode('brokenTyped')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                returnMode === 'brokenTyped' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              1. Implicit TypedResults (Error)
            </button>
            <button
              onClick={() => setReturnMode('untypedResults')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                returnMode === 'untypedResults' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              2. Results.Ok (Loses OpenAPI Metadata)
            </button>
            <button
              onClick={() => setReturnMode('typedExplicit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                returnMode === 'typedExplicit' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              3. Explicit TypedResults Union (Best!)
            </button>
          </div>
        </div>

        {returnMode === 'brokenTyped' && (
          <div className="space-y-3">
            <CodeWindow
              title="Compiler Error: Two Different Concrete Return Types"
              highlightLines={[3, 5]}
              code={`app.MapGet("/dishes/{dishId:guid}", async (DishesDbContext db, Guid dishId) => {
    var dish = await db.Dishes.FirstOrDefaultAsync(d => d.Id == dishId);
    if (dish == null)
        return TypedResults.NotFound(); // Concrete type: NotFound
    
    return TypedResults.Ok(dish.ToDishDto()); // Concrete type: Ok<DishDto>
});`}
            />
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 font-mono">
              ❌ CS1593: Delegate 'RequestDelegate' does not take 2 arguments. Because C# cannot infer a common return type between concrete <code className="text-white">NotFound</code> and <code className="text-white">Ok&lt;DishDto&gt;</code>, overload resolution fails!
            </div>
          </div>
        )}

        {returnMode === 'untypedResults' && (
          <div className="space-y-3">
            <CodeWindow
              title="Workaround: Using Results (Returns IResult Interface)"
              highlightLines={[3, 5]}
              code={`app.MapGet("/dishes/{dishId:guid}", async (DishesDbContext db, Guid dishId) => {
    var dish = await db.Dishes.FirstOrDefaultAsync(d => d.Id == dishId);
    if (dish == null)
        return Results.NotFound(); // Returns IResult
    
    return Results.Ok(dish.ToDishDto()); // Also returns IResult
});`}
            />
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200">
              ⚠️ <strong>Compiles, but hides metadata:</strong> Because <code className="font-mono">Results</code> returns the opaque <code className="font-mono">IResult</code> interface, you lose compile-time type safety and OpenAPI won't automatically know what status codes or DTO schemas your endpoint returns!
            </div>
          </div>
        )}

        {returnMode === 'typedExplicit' && (
          <div className="space-y-3">
            <CodeWindow
              title="Best Practice: Explicit Task<Results<T1, T2>> Union Signature"
              highlightLines={[2, 6, 8]}
              code={`app.MapGet("/dishes/{dishId:guid}", 
    async Task<Results<NotFound, Ok<DishDto>>> (DishesDbContext db, Guid dishId) => {
        var dish = await db.Dishes.FirstOrDefaultAsync(d => d.Id == dishId);
        if (dish == null)
            return TypedResults.NotFound();
        
        return TypedResults.Ok(dish.ToDishDto());
    });`}
            />
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200">
              ✅ <strong>Compile-Time Safety + Automatic OpenAPI Spec:</strong> If you accidentally return an <code className="font-mono">IngredientDto</code> instead of <code className="font-mono">DishDto</code>, the compiler catches it immediately, and Scalar/OpenAPI automatically documents both <code className="font-mono">200 OK</code> and <code className="font-mono">404 Not Found</code>!
            </div>
          </div>
        )}
      </div>

      {/* RFC 9457 Problem Details & Exception Middleware Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          RFC 9457 Problem Details & Environment Exception Simulator
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Toggle <code className="text-cyan-300">app.UseStatusCodePages()</code> and switch between <strong>Development</strong> and <strong>Production</strong> environments to see how <code className="text-cyan-300">builder.Services.AddProblemDetails()</code> standardizes all API errors!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pipeline & Environment Controls
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-200">ASPNETCORE_ENVIRONMENT</span>
                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
                  <button
                    onClick={() => setEnvMode('Development')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      envMode === 'Development' ? 'bg-violet-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Development
                  </button>
                  <button
                    onClick={() => setEnvMode('Production')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      envMode === 'Production' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Production
                  </button>
                </div>
              </div>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-800">
                <div>
                  <div className="text-xs font-mono text-white">app.UseStatusCodePages()</div>
                  <div className="text-[11px] text-slate-400">Translates empty 404/401/403 responses into ProblemDetails</div>
                </div>
                <input
                  type="checkbox"
                  checked={statusCodePages}
                  onChange={(e) => setStatusCodePages(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
              </label>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-300 mb-2">Test Error Scenario:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSimScenario('404')}
                    className={`p-2 rounded-lg text-xs font-mono border ${
                      simScenario === '404'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    GET /dishes/unknown-guid (404)
                  </button>
                  <button
                    onClick={() => setSimScenario('500')}
                    className={`p-2 rounded-lg text-xs font-mono border ${
                      simScenario === '500'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    GET /testerror (500 Exception)
                  </button>
                </div>
              </div>
            </div>

            <CodeWindow
              title="Program.cs Error Handling Setup"
              code={`builder.Services.AddProblemDetails();
var app = builder.Build();

if (!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler(); // Clean 500 in Production
}
${statusCodePages ? 'app.UseStatusCodePages(); // Populates 404 ProblemDetails body' : '// app.UseStatusCodePages(); (Disabled!)'}`}
            />
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-xl border border-slate-700 bg-slate-950 overflow-hidden h-full flex flex-col">
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-300">HTTP Response Inspector</span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                  simScenario === '404' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {simScenario === '404' ? 'HTTP/1.1 404 Not Found' : 'HTTP/1.1 500 Internal Server Error'}
                </span>
              </div>
              <div className="p-4 font-mono text-xs text-slate-300 space-y-3 flex-1">
                <div className="text-slate-400">
                  Content-Type: {simScenario === '404' && !statusCodePages ? 'None (Empty Body)' : 'application/problem+json; charset=utf-8'}
                </div>
                <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-300 overflow-x-auto leading-relaxed">
{simScenario === '404' && !statusCodePages
  ? `// Empty Response Body!
// Without app.UseStatusCodePages(), AddProblemDetails() alone 
// does not generate a payload for 404 NotFound responses.`
  : simScenario === '404' && statusCodePages
  ? JSON.stringify({
      type: "https://tools.ietf.org/html/rfc9110#section-15.5.5",
      title: "Not Found",
      status: 404
    }, null, 2)
  : envMode === 'Development'
  ? JSON.stringify({
      type: "https://tools.ietf.org/html/rfc9110#section-15.6.1",
      title: "System.NotImplementedException",
      status: 500,
      detail: "The method or operation is not implemented.",
      exception: {
        details: "System.NotImplementedException: The method or operation is not implemented.\n   at Program.<>c.<<Main>$>b__0_1() in Program.cs:line 28"
      }
    }, null, 2)
  : JSON.stringify({
      type: "https://tools.ietf.org/html/rfc9110#section-15.6.1",
      title: "An error occurred while processing your request.",
      status: 500
    }, null, 2)}
                </pre>
                {simScenario === '500' && (
                  <div className={`p-3 rounded-lg border text-xs ${
                    envMode === 'Development' 
                      ? 'bg-amber-950/30 border-amber-500/30 text-amber-200' 
                      : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  }`}>
                    {envMode === 'Development'
                      ? '🔍 Development Mode: DeveloperExceptionPageMiddleware includes the full stack trace for debugging.'
                      : '🔒 Production Mode: ExceptionHandlerMiddleware hides sensitive stack traces while keeping the standardized RFC 9457 contract!'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Module4CrudLab = ({ dishes, setDishes, resetDatabase }) => {
  const [selectedReq, setSelectedReq] = useState('GET_ALL');
  const [queryFilter, setQueryFilter] = useState('Mussels');
  const [postName, setPostName] = useState('Hawaiian Pizza');
  const [putName, setPutName] = useState('Spicy Beef Rendang');
  const [targetGuid, setTargetGuid] = useState(INITIAL_DISHES[0].id);
  const [lastResponse, setLastResponse] = useState(null);

  const executeRequest = () => {
    if (selectedReq === 'GET_ALL') {
      const list = dishes.map(d => ({ id: d.id, name: d.name }));
      setLastResponse({
        status: "200 OK",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: list
      });
    } else if (selectedReq === 'GET_FILTER') {
      const list = dishes
        .filter(d => !queryFilter || d.name.toLowerCase().includes(queryFilter.toLowerCase()))
        .map(d => ({ id: d.id, name: d.name }));
      setLastResponse({
        status: "200 OK",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: list
      });
    } else if (selectedReq === 'GET_BY_ID') {
      const found = dishes.find(d => d.id === targetGuid);
      if (!found) {
        setLastResponse({
          status: "404 Not Found",
          headers: { "Content-Type": "application/problem+json" },
          body: { type: "https://tools.ietf.org/html/rfc9110#section-15.5.5", title: "Not Found", status: 404 }
        });
      } else {
        setLastResponse({
          status: "200 OK",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: { id: found.id, name: found.name }
        });
      }
    } else if (selectedReq === 'POST_DISH') {
      if (!postName || postName.trim().length < 2) {
        setLastResponse({
          status: "400 Bad Request",
          headers: { "Content-Type": "application/problem+json" },
          body: {
            type: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
            title: "One or more validation errors occurred.",
            status: 400,
            errors: { Name: ["The field Name must be a string with a minimum length of 2 and a maximum length of 200."] }
          }
        });
        return;
      }
      const newId = `d1a2b3c4-${Math.floor(1000 + Math.random() * 9000)}-4000-8000-000000000099`;
      const newDish = { id: newId, name: postName.trim(), ingredients: [] };
      setDishes(prev => [...prev, newDish]);
      setTargetGuid(newId);
      setLastResponse({
        status: "201 Created",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Location": `https://localhost:7290/dishes/${newId}`
        },
        body: { id: newId, name: newDish.name }
      });
    } else if (selectedReq === 'PUT_DISH') {
      const exists = dishes.find(d => d.id === targetGuid);
      if (!exists) {
        setLastResponse({
          status: "404 Not Found",
          headers: { "Content-Type": "application/problem+json" },
          body: { title: "Not Found", status: 404 }
        });
        return;
      }
      setDishes(prev => prev.map(d => d.id === targetGuid ? { ...d, name: putName } : d));
      setLastResponse({
        status: "204 No Content",
        headers: {},
        body: null
      });
    } else if (selectedReq === 'DELETE_DISH') {
      const exists = dishes.find(d => d.id === targetGuid);
      if (!exists) {
        setLastResponse({
          status: "404 Not Found",
          headers: { "Content-Type": "application/problem+json" },
          body: { title: "Not Found", status: 404 }
        });
        return;
      }
      setDishes(prev => prev.filter(d => d.id !== targetGuid));
      setLastResponse({
        status: "204 No Content",
        headers: {},
        body: null
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Live Visual Studio .http File Runner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-400" />
              Interactive <code className="text-amber-300">DishesAPI.http</code> Playground & Live SQLite State
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Test GET, POST (<code className="text-emerald-300">CreatedAtRoute</code> with named route <code className="text-cyan-300">"GetDish"</code>), PUT (<code className="text-amber-300">204 No Content</code>), and DELETE against our live in-memory database!
            </p>
          </div>
          <button
            onClick={() => {
              resetDatabase();
              setTargetGuid(INITIAL_DISHES[0].id);
              setLastResponse(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-seed Dishes.db (EnsureDeleted + Migrate)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: .http Request Selector */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'GET_ALL', label: 'GET /dishes', verb: 'GET', color: 'text-emerald-400 border-emerald-500/30' },
                { id: 'GET_FILTER', label: 'GET /dishes?name=', verb: 'GET', color: 'text-emerald-400 border-emerald-500/30' },
                { id: 'GET_BY_ID', label: 'GET /dishes/{id}', verb: 'GET', color: 'text-emerald-400 border-emerald-500/30' },
                { id: 'POST_DISH', label: 'POST /dishes', verb: 'POST', color: 'text-amber-400 border-amber-500/30' },
                { id: 'PUT_DISH', label: 'PUT /dishes/{id}', verb: 'PUT', color: 'text-blue-400 border-blue-500/30' },
                { id: 'DELETE_DISH', label: 'DELETE /dishes/{id}', verb: 'DELETE', color: 'text-rose-400 border-rose-500/30' },
              ].map((req) => (
                <button
                  key={req.id}
                  onClick={() => setSelectedReq(req.id)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs border transition-all ${
                    selectedReq === req.id
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow'
                      : `bg-slate-950 ${req.color} opacity-75 hover:opacity-100`
                  }`}
                >
                  {req.label}
                </button>
              ))}
            </div>

            {/* Dynamic Inputs for Request */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
              <div className="text-slate-500">@baseUrl = https://localhost:7290</div>
              <div className="text-slate-500">###</div>

              {selectedReq === 'GET_ALL' && (
                <div className="text-emerald-300 font-bold">GET &#123;&#123;baseUrl&#125;&#125;/dishes</div>
              )}

              {selectedReq === 'GET_FILTER' && (
                <div className="space-y-2">
                  <div className="text-emerald-300 font-bold">
                    GET &#123;&#123;baseUrl&#125;&#125;/dishes?name={queryFilter}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-slate-400">Query String <code className="text-white">name</code>:</span>
                    <input
                      type="text"
                      value={queryFilter}
                      onChange={(e) => setQueryFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white"
                      placeholder="e.g. Mussels or e"
                    />
                  </div>
                </div>
              )}

              {(selectedReq === 'GET_BY_ID' || selectedReq === 'PUT_DISH' || selectedReq === 'DELETE_DISH') && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Target Dish GUID:</span>
                    <select
                      value={targetGuid}
                      onChange={(e) => setTargetGuid(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-amber-300 text-xs"
                    >
                      {dishes.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.id.slice(0, 13)}...)</option>
                      ))}
                      <option value="00000000-0000-0000-0000-000000000000">Non-existent GUID (Trigger 404)</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedReq === 'POST_DISH' && (
                <div className="space-y-2">
                  <div className="text-amber-300 font-bold">POST &#123;&#123;baseUrl&#125;&#125;/dishes</div>
                  <div className="text-cyan-300">Content-Type: application/json</div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-slate-400">DishForCreationDto.Name:</span>
                    <input
                      type="text"
                      value={postName}
                      onChange={(e) => setPostName(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white"
                    />
                  </div>
                  <pre className="text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
{`{\n  "name": "${postName}"\n}`}
                  </pre>
                </div>
              )}

              {selectedReq === 'PUT_DISH' && (
                <div className="space-y-2">
                  <div className="text-blue-300 font-bold">PUT &#123;&#123;baseUrl&#125;&#125;/dishes/{targetGuid}</div>
                  <div className="text-cyan-300">Content-Type: application/json</div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-slate-400">DishForUpdateDto.Name:</span>
                    <input
                      type="text"
                      value={putName}
                      onChange={(e) => setPutName(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={executeRequest}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-sans font-semibold text-xs shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Send Request (Visual Studio .http Runner)
              </button>
            </div>

            {/* Live Database Table */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Current SQLite Dishes Table ({dishes.length} rows)</span>
                <span className="font-mono text-[11px] text-emerald-400">DishesDbContext.Dishes</span>
              </div>
              <div className="space-y-1.5">
                {dishes.map((d) => (
                  <div key={d.id} className="flex items-center justify-between px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs">
                    <span className="font-semibold text-white">{d.name}</span>
                    <span className="font-mono text-slate-400">{d.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Response Output & CreatedAtRoute Explanation */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="rounded-xl border border-slate-700 bg-slate-950 overflow-hidden flex-1 flex flex-col">
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-300">Response Output</span>
                {lastResponse && (
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    lastResponse.status.startsWith('2') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {lastResponse.status}
                  </span>
                )}
              </div>
              <div className="p-4 font-mono text-xs flex-1">
                {!lastResponse ? (
                  <div className="text-slate-500 h-full flex items-center justify-center py-12 text-center">
                    Click "Send Request" to inspect status code, Location headers, and JSON payload!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(lastResponse.headers).map(([k, v]) => (
                      <div key={k} className="text-cyan-300 break-all">
                        <span className="text-slate-400">{k}:</span> {v}
                      </div>
                    ))}
                    <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 overflow-x-auto">
                      {lastResponse.body ? JSON.stringify(lastResponse.body, null, 2) : '// 204 No Content (Empty Body)'}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-1.5">
              <div className="font-bold text-amber-300">How CreatedAtRoute Generates Links:</div>
              <p className="text-slate-300">
                By chaining <code className="text-cyan-300">.WithName("GetDish")</code> onto <code className="text-slate-200">MapGet("/dishes/&#123;dishId:guid&#125;")</code>, our POST handler calls <code className="text-emerald-300">TypedResults.CreatedAtRoute(dishDto, "GetDish", new &#123; dishId = dishDto.Id &#125;)</code> to automatically populate the <code className="text-cyan-300">Location</code> header!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MapGroup Hierarchy Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-amber-400" />
          Organizing Shared Prefixes with <code className="text-amber-300">MapGroup()</code>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Instead of repeating <code className="text-slate-200">/dishes/&#123;dishId:guid&#125;</code> on every endpoint, we build nested route groups that inherit prefixes, route constraints, authorization rules, and OpenAPI tags!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30">
            <div className="text-amber-400 font-bold mb-2">1. dishesEndpoints</div>
            <div className="text-slate-400 mb-2">app.MapGroup("/dishes")</div>
            <ul className="space-y-1 text-slate-200">
              <li>• MapGet("", GetDishesAsync)</li>
              <li>• MapGet("/&#123;dishName&#125;", GetDishByNameAsync)</li>
              <li>• MapPost("", CreateDishAsync)</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-orange-500/30">
            <div className="text-orange-400 font-bold mb-2">2. dishWithGuidIdEndpoints</div>
            <div className="text-slate-400 mb-2">dishesEndpoints.MapGroup("/&#123;dishId:guid&#125;")</div>
            <ul className="space-y-1 text-slate-200">
              <li>• MapGet("", GetDishByIdAsync).WithName("GetDish")</li>
              <li>• MapPut("", UpdateDishAsync)</li>
              <li>• MapDelete("", DeleteDishAsync)</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30">
            <div className="text-rose-400 font-bold mb-2">3. ingredientsEndpoints</div>
            <div className="text-slate-400 mb-2">dishWithGuidIdEndpoints.MapGroup("/ingredients")</div>
            <ul className="space-y-1 text-slate-200">
              <li>• MapGet("", GetIngredientsAsync)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Module5Architecture = () => {
  const [structStage, setStructStage] = useState(3);
  const [logMode, setLogMode] = useState('structured');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* .NET 10 Built-In Validation Deep Dive */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              New in .NET 10!
            </span>
            <h3 className="text-lg font-bold text-white mt-2">
              Built-in Data Annotation Validation (<code className="text-pink-300">builder.Services.AddValidation()</code>)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              In older ASP.NET Core versions, Minimal APIs lacked built-in validation. Now in .NET 10, calling <code className="text-pink-300">AddValidation()</code> automatically validates incoming DTOs before your handler code ever runs!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CodeWindow
            title="DishForCreationDto.cs — Compiler vs Runtime Check"
            highlightLines={[3, 4, 5]}
            code={`public class DishForCreationDto
{
    [Required] // <-- Runtime Check: Inspected by AddValidation() on HTTP requests
    [StringLength(200, MinimumLength = 2)]
    public required string Name { get; set; } // <-- Compiler Check: C# required modifier
}`}
          />
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-white text-sm mb-2">Why Use Both <code className="text-pink-300">[Required]</code> and <code className="text-violet-300">required</code>?</h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <span><strong>C# <code className="font-mono">required</code> keyword:</strong> Enforces at compile-time that your own C# code initializes the property when constructing the object.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <span><strong><code className="font-mono">[Required]</code> & <code className="font-mono">[StringLength]</code> attributes:</strong> Inspected at runtime by <code className="font-mono">AddValidation()</code> before the route handler executes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Short-Circuiting:</strong> If validation fails, ASP.NET Core immediately returns a <code className="font-mono">400 Bad Request</code> ProblemDetails response—your handler never executes!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 3-Stage Architecture Refactoring Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-pink-400" />
              Structuring Minimal APIs for Scale (3-Stage Evolution)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Click through the 3 refactoring stages from Page 29–31 to see how we transform a cluttered <code className="text-slate-200">Program.cs</code> into a clean, unit-testable architecture!
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { stage: 1, label: "Stage 1: Local Functions" },
              { stage: 2, label: "Stage 2: Static Handler Classes" },
              { stage: 3, label: "Stage 3: IEndpointRouteBuilder Extensions" }
            ].map((s) => (
              <button
                key={s.stage}
                onClick={() => setStructStage(s.stage)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  structStage === s.stage
                    ? 'bg-pink-600 text-white shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {structStage === 1 && (
          <CodeWindow
            title="Stage 1: Extracting Lambdas to Local Functions inside Program.cs"
            code={`// Program.cs — Easier to read map calls, but everything is still trapped in one file!
dishesEndpoints.MapGet("", GetDishesAsync);

static async Task<Ok<IEnumerable<DishDto>>> GetDishesAsync(DishesDbContext db, string? name) {
    return TypedResults.Ok((await db.Dishes
        .Where(d => name == null || d.Name.Contains(name))
        .ToListAsync()).ToDishDtoList());
}`}
          />
        )}

        {structStage === 2 && (
          <CodeWindow
            title="Stage 2: EndpointHandlers/DishesHandlers.cs (Testable Static Classes)"
            code={`namespace DishesAPI.EndpointHandlers;

public static class DishesHandlers
{
    public static async Task<Ok<IEnumerable<DishDto>>> GetDishesAsync(
        DishesDbContext dishesDbContext,
        ClaimsPrincipal claimsPrincipal,
        ILogger<DishDto> logger,
        string? name)
    {
        logger.LogInformation("User authenticated? {IsAuthenticated}", 
            claimsPrincipal.Identity?.IsAuthenticated);

        return TypedResults.Ok((await dishesDbContext.Dishes
            .Where(d => name == null || d.Name.Contains(name))
            .ToListAsync()).ToDishDtoList());
    }
}`}
          />
        )}

        {structStage === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CodeWindow
              title="Extensions/EndpointRouteBuilderExtensions.cs"
              code={`public static class EndpointRouteBuilderExtensions
{
    public static void RegisterDishesEndpoints(this IEndpointRouteBuilder app)
    {
        var dishes = app.MapGroup("/dishes").RequireAuthorization();
        var dishById = dishes.MapGroup("/{dishId:guid}");

        dishes.MapGet("", DishesHandlers.GetDishesAsync);
        dishes.MapGet("/{dishName}", DishesHandlers.GetDishByNameAsync)
              .AllowAnonymous();
        dishById.MapGet("", DishesHandlers.GetDishByIdAsync).WithName("GetDish");
        dishes.MapPost("", DishesHandlers.CreateDishAsync);
        dishById.MapPut("", DishesHandlers.UpdateDishAsync);
        dishById.MapDelete("", DishesHandlers.DeleteDishAsync);
    }
}`}
            />
            <CodeWindow
              title="Program.cs (Ultra-Clean Final Result!)"
              highlightLines={[8, 9]}
              code={`var app = builder.Build();

if (!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler();
}
app.UseStatusCodePages();
app.UseHttpsRedirection();

app.RegisterDishesEndpoints();
app.RegisterIngredientsEndpoints();

app.Run();`}
            />
          </div>
        )}
      </div>

      {/* Structured Logging vs String Interpolation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            Structured Logging with <code className="text-cyan-300">ILogger&lt;DishDto&gt;</code>
          </h3>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setLogMode('structured')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                logMode === 'structured' ? 'bg-emerald-600 text-white' : 'text-slate-400'
              }`}
            >
              Structured Template (Best)
            </button>
            <button
              onClick={() => setLogMode('interpolated')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                logMode === 'interpolated' ? 'bg-rose-600 text-white' : 'text-slate-400'
              }`}
            >
              String Interpolation (Anti-Pattern)
            </button>
          </div>
        </div>

        {logMode === 'structured' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            <CodeWindow
              title="Structured Message Template"
              code={`// Preserves {IsAuthenticated} as a queryable key-value property!
logger.LogInformation(
    "Is user authenticated? {IsAuthenticated}", 
    claimsPrincipal.Identity?.IsAuthenticated);`}
            />
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 font-mono text-xs space-y-1">
              <div className="text-emerald-400 font-bold">info: DishesAPI.Models.DishDto[0]</div>
              <div className="text-slate-200">      Is user authenticated? False</div>
              <div className="text-slate-400 pt-2">
                Parsed JSON Property in App Insights / Seq: <code className="text-cyan-300">&#123; "IsAuthenticated": false &#125;</code>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            <CodeWindow
              title="String Interpolation Destroys Structured Fields"
              code={`// BAD: Bakes value into raw string; log aggregators cannot filter by field!
Console.WriteLine($"User authenticated? {claimsPrincipal.Identity?.IsAuthenticated}");`}
            />
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200">
              ❌ Avoid <code className="font-mono">Console.WriteLine</code> or <code className="font-mono">$"..."</code> in <code className="font-mono">ILogger</code> calls. It bypasses log levels in <code className="font-mono">appsettings.json</code> and prevents structured querying!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Module6Security = () => {
  const [hasToken, setHasToken] = useState(true);
  const [audience, setAudience] = useState('menu-api');
  const [roleClaim, setRoleClaim] = useState('admin');
  const [countryClaim, setCountryClaim] = useState('Belgium');
  const [testEndpoint, setTestEndpoint] = useState('POST_DISH');

  const evaluateAccess = () => {
    if (testEndpoint === 'GET_BY_NAME') {
      return {
        code: 200,
        status: "200 OK (AllowAnonymous)",
        reason: "This endpoint has .AllowAnonymous(), overriding the group's .RequireAuthorization() rule!"
      };
    }
    if (!hasToken || audience !== 'menu-api') {
      return {
        code: 401,
        status: "401 Unauthorized",
        reason: !hasToken 
          ? "No Bearer token was provided in the Authorization header."
          : `Token audience '${audience}' does not match ValidAudience 'menu-api' in appsettings.json!`
      };
    }
    if (testEndpoint === 'GET_ALL') {
      return {
        code: 200,
        status: "200 OK (Authenticated)",
        reason: "Valid JWT Bearer token! GET /dishes only requires an authenticated user, not the RequireAdminFromBelgium policy."
      };
    }
    // POST_DISH requires RequireAdminFromBelgium policy
    if (roleClaim !== 'admin' || countryClaim !== 'Belgium') {
      return {
        code: 403,
        status: "403 Forbidden",
        reason: `We know who you are (401 passed), but policy 'RequireAdminFromBelgium' failed! Required role='admin' (got '${roleClaim}') AND claim country='Belgium' (got '${countryClaim}').`
      };
    }
    return {
      code: 201,
      status: "201 Created (Policy Satisfied!)",
      reason: "Token is valid AND satisfies both .RequireRole(\"admin\") and .RequireClaim(\"country\", \"Belgium\")!"
    };
  };

  const result = evaluateAccess();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Interactive dotnet user-jwts CLI + Policy Tester */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-purple-400" />
          Interactive <code className="text-purple-300">dotnet user-jwts</code> & Authorization Policy Lab
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Configure your test JWT claims below and test how ASP.NET Core distinguishes between <strong>401 Unauthorized</strong> (Authentication failure), <strong>403 Forbidden</strong> (Authorization policy failure), and <strong>200/201 Success</strong>!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Token Builder Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Key className="w-4 h-4" />
                  1. Configure Test JWT Token
                </span>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasToken}
                    onChange={(e) => setHasToken(e.target.checked)}
                    className="accent-purple-500"
                  />
                  <span className="text-slate-200">Include Bearer Token</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">--audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    disabled={!hasToken}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  >
                    <option value="menu-api">menu-api (Valid)</option>
                    <option value="wrong-api">wrong-api (Invalid)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">--role</label>
                  <select
                    value={roleClaim}
                    onChange={(e) => setRoleClaim(e.target.value)}
                    disabled={!hasToken}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  >
                    <option value="admin">admin</option>
                    <option value="visitor">visitor (No Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">--claim country=...</label>
                  <select
                    value={countryClaim}
                    onChange={(e) => setCountryClaim(e.target.value)}
                    disabled={!hasToken}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  >
                    <option value="Belgium">Belgium</option>
                    <option value="Netherlands">Netherlands</option>
                  </select>
                </div>
              </div>

              {/* CLI Command Preview */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-purple-300">
                $ dotnet user-jwts create --audience {audience}
                {roleClaim === 'admin' ? ' --role admin' : ''}
                {countryClaim ? ` --claim country=${countryClaim}` : ''}
              </div>
            </div>

            {/* Decoded jwt.io Payload */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
              <div className="text-slate-400 mb-2 flex items-center justify-between">
                <span>Decoded JWT Payload (jwt.io preview)</span>
                <span className="text-purple-400">HS256 Bearer</span>
              </div>
              <pre className="text-emerald-300 overflow-x-auto">
{hasToken ? JSON.stringify({
  sub: "Kevin",
  aud: audience,
  role: roleClaim,
  country: countryClaim,
  iss: "dotnet-user-jwts",
  exp: 1893456000
}, null, 2) : "// No Authorization: Bearer <token> header sent"}
              </pre>
            </div>
          </div>

          {/* Right: Endpoint Policy Evaluator */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  2. Select Endpoint to Call
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'POST_DISH', name: 'POST /dishes', rule: '.RequireAuthorization("RequireAdminFromBelgium")' },
                    { id: 'GET_ALL', name: 'GET /dishes', rule: '.RequireAuthorization() (Any valid token)' },
                    { id: 'GET_BY_NAME', name: 'GET /dishes/Rendang', rule: '.AllowAnonymous() (Public override)' }
                  ].map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => setTestEndpoint(ep.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        testEndpoint === ep.id
                          ? 'bg-purple-500/20 border-purple-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="font-mono text-xs font-bold">{ep.name}</span>
                      <span className="font-mono text-[11px] text-purple-300">{ep.rule}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Evaluation Result Box */}
              <div className={`p-5 rounded-xl border ${
                result.code === 200 || result.code === 201
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : result.code === 401
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold font-mono flex items-center gap-2">
                    {result.code < 300 ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-rose-400" />}
                    {result.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">{result.reason}</p>
              </div>
            </div>

            <CodeWindow
              title="Program.cs — Policy Registration"
              code={`builder.Services.AddAuthentication().AddJwtBearer();
builder.Services.AddAuthorization();
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("RequireAdminFromBelgium", policy =>
        policy
            .RequireRole("admin")
            .RequireClaim("country", "Belgium"));`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Module7OpenApi = () => {
  const [enableMetadata, setEnableMetadata] = useState(true);
  const [enableTransformer, setEnableTransformer] = useState(true);
  const [activeScalarEndpoint, setActiveScalarEndpoint] = useState('POST');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Interactive Scalar OpenAPI Documentation Previewer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Interactive Scalar OpenAPI UI Explorer (<code className="text-cyan-300">/scalar/v1</code>)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              ASP.NET Core 10 replaces Swashbuckle with built-in <code className="text-cyan-300">Microsoft.AspNetCore.OpenApi</code> + <code className="text-cyan-300">Scalar.AspNetCore</code>. Toggle Endpoint Metadata and the Document Transformer below to watch the live Scalar UI update!
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-2 rounded-xl border border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={enableMetadata}
                onChange={(e) => setEnableMetadata(e.target.checked)}
                className="accent-cyan-400"
              />
              <span className="text-slate-200 font-medium">.WithTags() / .WithSummary() / .ProducesValidationProblem()</span>
            </label>
            <label className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-2 rounded-xl border border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={enableTransformer}
                onChange={(e) => setEnableTransformer(e.target.checked)}
                className="accent-purple-400"
              />
              <span className="text-slate-200 font-medium">AddDocumentTransformer (Bearer Security)</span>
            </label>
          </div>
        </div>

        {/* Simulated Scalar UI Browser Window */}
        <div className="rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 px-3 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300">
                https://localhost:7290/scalar/v1
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">Source: /openapi/v1.json</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Scalar Sidebar */}
            <div className="lg:col-span-4 border-r border-slate-800 p-5 space-y-5 bg-slate-950/60">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-base">
                    {enableTransformer ? 'Dishes API' : 'DishesAPI | v1'}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
                    OAS 3.1.0
                  </span>
                </div>
                {enableTransformer && (
                  <p className="text-xs text-slate-400 mt-1">
                    An API for managing dishes and their ingredients (Injected via Document Transformer).
                  </p>
                )}
              </div>

              {enableTransformer && (
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-2">
                  <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Authentication: Bearer (JWT)
                  </div>
                  <input
                    type="text"
                    readOnly
                    value="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] font-mono text-slate-300"
                  />
                </div>
              )}

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {enableMetadata ? 'TAG: Dishes' : 'Default Group'}
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: 'GET', verb: 'GET', path: '/dishes', summary: 'Get all dishes' },
                    { id: 'GET_ID', verb: 'GET', path: '/dishes/{dishId}', summary: 'Get a dish by ID' },
                    { id: 'POST', verb: 'POST', path: '/dishes', summary: 'Create a dish' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveScalarEndpoint(item.id)}
                      className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                        activeScalarEndpoint === item.id
                          ? 'bg-cyan-500/20 border border-cyan-500/40 text-white'
                          : 'hover:bg-slate-900 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-medium truncate">
                        {enableMetadata ? item.summary : item.path}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        item.verb === 'POST' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {item.verb}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scalar Endpoint Detail Pane */}
            <div className="lg:col-span-8 p-6 space-y-4">
              {activeScalarEndpoint === 'POST' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">POST</span>
                    <span className="font-mono text-sm text-white">/dishes</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {enableMetadata ? 'Create a dish' : 'POST /dishes'}
                  </h4>
                  {enableMetadata && (
                    <p className="text-xs text-slate-300">
                      Creates a new dish in the database. Requires the RequireAdminFromBelgium policy.
                    </p>
                  )}

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Documented Responses (Inferred from TypedResults + Metadata)
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <span className="font-mono text-emerald-400 font-bold">201 Created</span>
                      <span className="font-mono text-slate-300">application/json (Schema: DishDto) — Inferred from CreatedAtRoute&lt;DishDto&gt;</span>
                    </div>
                    {enableMetadata ? (
                      <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/40 flex items-center justify-between text-xs">
                        <span className="font-mono text-rose-400 font-bold">400 Bad Request</span>
                        <span className="font-mono text-slate-300">application/problem+json (HttpValidationProblemDetails) — Added via .ProducesValidationProblem()!</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                        ⚠️ Missing 400 Bad Request in docs! Enable <code className="font-mono">.ProducesValidationProblem()</code> above to document validation errors.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeScalarEndpoint !== 'POST' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">GET</span>
                    <span className="font-mono text-sm text-white">
                      {activeScalarEndpoint === 'GET' ? '/dishes' : '/dishes/{dishId}'}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {enableMetadata 
                      ? (activeScalarEndpoint === 'GET' ? 'Get all dishes' : 'Get a dish by ID') 
                      : 'Endpoint Details'}
                  </h4>
                  <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                    200 OK — Schema: {activeScalarEndpoint === 'GET' ? 'DishDto[]' : 'DishDto'} (Automatically inferred from TypedResults!)
                  </div>
                  {activeScalarEndpoint === 'GET_ID' && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-xs font-mono text-amber-300">
                      404 Not Found — Inferred from Task&lt;Results&lt;NotFound, Ok&lt;DishDto&gt;&gt;&gt;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Final Decision Matrix: Minimal APIs vs Controller-Based APIs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          Course Wrap-Up: Minimal APIs vs. Controller-Based APIs Decision Matrix
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Both approaches share the exact same underlying ASP.NET Core routing engine, DI container, configuration, and Auth middleware—and you can even mix both in the same project!
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4">Capability / Feature</th>
                <th className="py-3 px-4 text-violet-300">ASP.NET Core 10 Minimal APIs</th>
                <th className="py-3 px-4 text-indigo-300">ASP.NET Core MVC Controllers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              <tr>
                <td className="py-3 px-4 font-semibold">Routing & Constraints</td>
                <td className="py-3 px-4 text-emerald-300">✅ First-class (<code className="font-mono">MapGet</code>, <code className="font-mono">MapGroup</code>, <code className="font-mono">:guid</code>)</td>
                <td className="py-3 px-4 text-emerald-300">✅ Attribute Routing (<code className="font-mono">[HttpGet]</code>, <code className="font-mono">[Route]</code>)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Input Validation</td>
                <td className="py-3 px-4 text-emerald-300">✅ Built-in in .NET 10 via <code className="font-mono">AddValidation()</code></td>
                <td className="py-3 px-4 text-emerald-300">✅ Built-in via <code className="font-mono">[ApiController]</code> & ModelState</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Content Negotiation (XML/CSV)</td>
                <td className="py-3 px-4 text-amber-300">⚠️ JSON-first (Ignores <code className="font-mono">Accept: application/xml</code> unless using Carter)</td>
                <td className="py-3 px-4 text-emerald-300">✅ Full OutputFormatter Content Negotiation pipeline</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Filter Pipeline</td>
                <td className="py-3 px-4 text-amber-300">⚠️ Endpoint Filters (<code className="font-mono">IEndpointFilter</code>) — lightweight</td>
                <td className="py-3 px-4 text-emerald-300">✅ Full Action, Resource, Result & Exception Filter pipeline</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Security & OpenAPI</td>
                <td className="py-3 px-4 text-emerald-300">✅ Full JWT Bearer, Policies, <code className="font-mono">TypedResults</code> + Scalar UI</td>
                <td className="py-3 px-4 text-emerald-300">✅ Full JWT Bearer, Policies & OpenAPI</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [completedModules, setCompletedModules] = useState(['intro']);
  const [dishes, setDishes] = useState(INITIAL_DISHES);

  const currentModule = MODULES[activeModuleIdx];

  const handleSelectModule = (idx) => {
    setActiveModuleIdx(idx);
    const modId = MODULES[idx].id;
    if (!completedModules.includes(modId)) {
      setCompletedModules(prev => [...prev, modId]);
    }
  };

  const resetDatabase = () => {
    setDishes(INITIAL_DISHES);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-violet-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-white tracking-tight">
                  ASP.NET Core 10 Minimal APIs
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Interactive Course Companion
                </span>
              </div>
              <p className="text-xs text-slate-400">
                44-Page Transcript Transformed into 7 Hands-on Labs • DishesAPI Project
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <div className="text-xs text-slate-400">
                Explored <span className="text-white font-bold">{completedModules.length}</span> of {MODULES.length} Modules
              </div>
              <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${(completedModules.length / MODULES.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-8 py-6">
        {/* Sidebar Module Navigation */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-3">
            Course Modules (Pages 1–44)
          </div>
          {MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            const isActive = idx === activeModuleIdx;
            const isDone = completedModules.includes(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => handleSelectModule(idx)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  isActive
                    ? 'bg-slate-900 border-violet-500/60 shadow-lg shadow-violet-500/10'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${mod.color} text-white shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-mono text-slate-400">{mod.badge}</span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                  <div className={`text-xs sm:text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {mod.number}. {mod.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {mod.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Active Interactive Lab Area */}
        <main className="lg:col-span-9 flex flex-col justify-between space-y-6">
          <div>
            {/* Module Header Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-violet-500/20 text-violet-300">
                    MODULE {currentModule.number}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{currentModule.badge}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {currentModule.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectModule(Math.max(0, activeModuleIdx - 1))}
                  disabled={activeModuleIdx === 0}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
                  title="Previous Module"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSelectModule(Math.min(MODULES.length - 1, activeModuleIdx + 1))}
                  disabled={activeModuleIdx === MODULES.length - 1}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                >
                  <span>Next Module</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dynamic Module View */}
            {currentModule.id === 'intro' && <Module1Intro />}
            {currentModule.id === 'routing' && <Module2Routing />}
            {currentModule.id === 'responses' && <Module3Responses />}
            {currentModule.id === 'crud' && (
              <Module4CrudLab 
                dishes={dishes} 
                setDishes={setDishes} 
                resetDatabase={resetDatabase} 
              />
            )}
            {currentModule.id === 'architecture' && <Module5Architecture />}
            {currentModule.id === 'security' && <Module6Security />}
            {currentModule.id === 'openapi' && <Module7OpenApi />}
          </div>

          {/* Bottom Module Pagination Bar */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => handleSelectModule(Math.max(0, activeModuleIdx - 1))}
              disabled={activeModuleIdx === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Lesson
            </button>
            <div className="text-xs text-slate-500 font-mono">
              Module {activeModuleIdx + 1} of {MODULES.length} • "You're ready to be awesome!"
            </div>
            <button
              onClick={() => handleSelectModule(Math.min(MODULES.length - 1, activeModuleIdx + 1))}
              disabled={activeModuleIdx === MODULES.length - 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-semibold text-white shadow-lg disabled:opacity-40"
            >
              Next Lesson
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}