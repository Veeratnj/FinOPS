import { useMemo, useState, useEffect } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatCurrencyExact, formatCompactCurrency } from "@/utils/format";
import { Cpu, Database, Layers, Lightbulb, Search, Sparkles, TrendingUp, Users } from "lucide-react";



const optimizedPrompt = `Optimize the following prompt for token efficiency while preserving meaning. Use concise wording and remove duplicates.`;
const currentPrompt = `Write a detailed marketing plan for a new AI platform. Include target audience, budget, channels, messaging, timelines, KPIs, and metrics. Repeat important details and include examples.`;

const colors = ["#16a34a", "#0ea5e9", "#f97316", "#8b5cf6", "#ec4899", "#facc15"];

function tokenFormatter(value: number) {
  return value.toLocaleString();
}

export default function TokenOPS() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/fakedata.json');
        const allData = await response.json();
        setData(allData.tokenOps);
      } catch (err) {
        setError('Failed to load TokenOPS data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");
  const [promptValue, setPromptValue] = useState(currentPrompt);
  const [optimizedValue] = useState(optimizedPrompt);

  const tabData = useMemo(() => {
    if (!data) return [];
    const map = {
      users: data.topConsumers.users,
      projects: data.topConsumers.projects,
      agents: data.topConsumers.agents,
      apiKeys: data.topConsumers.apiKeys,
    } as const;
    return map[activeTab as keyof typeof map] || [];
  }, [activeTab, data]);

  const filteredTabData = tabData.filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading Token Analytics...</div>;
  }
  if (error || !data) {
    return <div className="flex items-center justify-center h-full text-red-500">{error || 'No data found'}</div>;
  }

  const {
    summaryCards, usageTrend, distribution, providerData, modelComparison,
    promptAnalysis, contextStats, cacheStats, recommendations,
    forecastData, anomalyCards, alerts, costBreakdown, ragAnalysis, apiUsage
  } = data;


  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-background/70 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Token-OPS</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Analyze, optimize, and reduce AI token usage across all providers.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_auto]">
            <div className="relative">
              <Input
                placeholder="Search user, project, agent, api key..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button variant="secondary">Export CSV</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="border border-border/60 bg-background/80">
            <CardHeader className="flex items-start justify-between gap-3 pb-2">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                <p className="mt-2 text-2xl font-semibold">{card.value}</p>
              </div>
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <card.icon size={18} />
              </div>
            </CardHeader>
            <CardContent>
              <p className={card.delta.startsWith("+") ? "text-emerald-500" : "text-rose-500"}>{card.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Token Usage Trend</CardTitle>
            <CardDescription>Daily prompt, completion, and total token trends.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageTrend} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="prompt" stroke="#14b8a6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="completion" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Distribution</CardTitle>
            <CardDescription>Prompt, completion, embedding, and cache share.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} innerRadius={55} paddingAngle={4}>
                  {distribution.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Provider Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providerData.map((row) => (
                    <TableRow key={row.provider}>
                      <TableCell className="font-medium">{row.provider}</TableCell>
                      <TableCell>{row.requests.toLocaleString()}</TableCell>
                      <TableCell>{row.tokens.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrencyExact(row.cost)}</TableCell>
                      <TableCell>{row.latency} ms</TableCell>
                      <TableCell>{row.success}</TableCell>
                      <TableCell className={row.trend.startsWith("+") ? "text-emerald-500" : "text-rose-500"}>{row.trend}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Prompt Tokens</TableHead>
                    <TableHead>Completion Tokens</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Quality</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelComparison.map((model) => (
                    <TableRow key={model.model}>
                      <TableCell className="font-medium">{model.model}</TableCell>
                      <TableCell>{model.requests.toLocaleString()}</TableCell>
                      <TableCell>{model.prompt.toLocaleString()}</TableCell>
                      <TableCell>{model.completion.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrency(model.cost)}</TableCell>
                      <TableCell>{model.latency} ms</TableCell>
                      <TableCell>{model.quality}/100</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Token Consumers</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="users">Top Users</TabsTrigger>
                <TabsTrigger value="projects">Top Projects</TabsTrigger>
                <TabsTrigger value="agents">Top Agents</TabsTrigger>
                <TabsTrigger value="apiKeys">Top API Keys</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>
                <div className="grid gap-3">
                  {filteredTabData.map((row) => (
                    <div key={row.name} className="rounded-xl border border-border/60 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold">{row.name}</p>
                          <p className="text-xs text-muted-foreground">Last active {row.active}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{row.requests.toLocaleString()} req</p>
                          <p>{row.tokens.toLocaleString()} tok</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt Analysis</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {promptAnalysis.map((item) => (
              <div key={item.label} className="rounded-xl border border-border/60 p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Context Window Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contextStats.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{item.label}</span><span>{item.value}</span></div>
                {item.label === "Usage %" ? <Progress value={58} /> : <Progress value={Math.min(100, Number(item.value.replace(/\D/g, "")))} />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cache Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cacheStats.map((item) => (
              <div key={item.label} className="rounded-xl border border-border/60 p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Optimization Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Prompt</p>
                <div className="rounded-xl border border-border/60 bg-muted p-3 text-sm leading-6">{promptValue}</div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Optimized Prompt</p>
                <div className="rounded-xl border border-border/60 bg-background p-3 text-sm leading-6">{optimizedValue}</div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-sm text-muted-foreground">Savings</p>
                  <p className="mt-1 text-xl font-semibold">55%</p>
                </div>
                <div className="rounded-xl border border-border/60 p-3">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="mt-1 text-xl font-semibold">91/100</p>
                </div>
              </div>
              <Button onClick={() => setPromptValue(optimizedPrompt)}>Apply Optimized Prompt</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Optimization Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recommendations.map((item) => (
              <div key={item.title} className="flex flex-col gap-3 rounded-xl border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Estimated Savings {item.savings}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs">Priority {item.priority}</span>
                  <Button variant="outline" size="sm">Apply</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Forecast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tickFormatter={(value) => `${value / 1000}K`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(value: number) => formatCompactCurrency(value)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="tokens" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid gap-3">
              {forecastData.map((item) => (
                <div key={item.date} className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{item.date}</span>
                  <span>{formatCompactCurrency(item.cost)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.rule} className="rounded-xl border border-border/60 p-4">
                <p className="font-medium">{alert.rule}</p>
                <p className="text-xs text-muted-foreground">Channel: {alert.channel}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anomaly Detection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {anomalyCards.map((item) => (
              <div key={item.title} className="rounded-xl border border-border/60 p-4">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">Severity: {item.severity}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={costBreakdown} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>RAG Token Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ragAnalysis.map((item) => (
              <div key={item.label} className="rounded-xl border border-border/60 p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>API Key</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Errors</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiUsage.map((item) => (
                    <TableRow key={item.key}>
                      <TableCell className="font-medium">{item.key}</TableCell>
                      <TableCell>{item.requests.toLocaleString()}</TableCell>
                      <TableCell>{item.tokens.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrency(item.cost)}</TableCell>
                      <TableCell>{item.errors}</TableCell>
                      <TableCell>{item.rateLimit}</TableCell>
                      <TableCell>{item.latency} ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
