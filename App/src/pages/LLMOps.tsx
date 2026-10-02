import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Summary = {
  requests: number;
  tokens: number;
  cost: number;
  successRate: number;
  avgLatency: number;
};

type Kpi = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
};

type TrendPoint = {
  month: string;
  cost: number;
};

type ProviderUsage = {
  name: string;
  requests: number;
  cost: number;
  latency: number;
  share: number;
};

type Execution = {
  id: string;
  name: string;
  status: string;
  duration: string;
  cost: string;
};

type ToolRegistryItem = {
  name: string;
  status: string;
  latency: string;
};

type Guardrail = {
  name: string;
  value: number;
  tone: string;
};

type RagStat = {
  name: string;
  value: string;
};

type QuickAction = {
  title: string;
  description: string;
  action: string;
};

type LLMOpsPayload = {
  summary: Summary;
  kpis: Kpi[];
  costTrend: TrendPoint[];
  providerUsage: ProviderUsage[];
  recentExecutions: Execution[];
  toolRegistry: ToolRegistryItem[];
  guardrails: Guardrail[];
  ragStats: RagStat[];
  quickActions: QuickAction[];
};

const API_URL = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:8000" : "")) + "/dashboard/llm-ops";


const COLORS = ["#16a34a", "#0ea5e9", "#f97316", "#8b5cf6", "#ec4899"];

const toneClasses: Record<string, string> = {
  warning: "text-amber-500",
  info: "text-sky-500",
  critical: "text-rose-500",
};

export default function LLMOps() {
  const [data, setData] = useState<LLMOpsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        try {
          const response = await fetch(API_URL);

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          const json = (await response.json()) as LLMOpsPayload;

          if (mounted) {
            setData(json);
            setError(null);
          }
        } catch {
          // Fallback to mock data from fakedata.json
          const response = await fetch("/fakedata.json");
          if (!response.ok) {
            throw new Error("Failed to load mock data");
          }
          const allData = await response.json();
          const llmOpsData = allData.llmOps as LLMOpsPayload;
          
          if (mounted) {
            setData(llmOpsData);
            setError(null);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unable to load LLM Ops data");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const summaryCards = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      { label: "Requests", value: data.summary.requests.toLocaleString(), helper: "Total requests" },
      { label: "Tokens", value: data.summary.tokens.toLocaleString(), helper: "Prompt + completion tokens" },
      { label: "Cost", value: `$${data.summary.cost.toFixed(2)}`, helper: "Monthly spend" },
      { label: "Success rate", value: `${data.summary.successRate}%`, helper: "Successful completions" },
      { label: "Avg latency", value: `${data.summary.avgLatency}ms`, helper: "Average response time" },
    ];
  }, [data]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-xl border border-border/60 bg-background/70 p-4 shadow-sm sm:p-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">LLM Ops</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Live view of your LLM operations, costs, and reliability.
        </p>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading LLM Ops data…</p>}
      {error && <p className="text-sm text-rose-500">{error}</p>}

      {!loading && data && (
        <>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {summaryCards.map((card) => (
              <Card key={card.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{card.value}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{card.helper}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Key performance indicators</CardTitle>
                <CardDescription>Operational highlights across usage and quality.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {data.kpis.map((kpi) => (
                  <div key={kpi.label} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <span className={kpi.trend === "up" ? "text-emerald-500" : "text-sky-500"}>{kpi.delta}</span>
                    </div>
                    <div className="mt-2 text-2xl font-semibold">{kpi.value}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
                <CardDescription>Useful next steps for the team.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.quickActions.map((action) => (
                  <div key={action.title} className="rounded-lg border p-3">
                    <p className="font-medium">{action.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cost trend</CardTitle>
                <CardDescription>Monthly spend over the last six months.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.costTrend.map((point) => (
                  <div key={point.month}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>{point.month}</span>
                      <span>${(point.cost / 1000).toFixed(1)}K</span>
                    </div>
                    <Progress value={(point.cost / 218900) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Provider usage</CardTitle>
                <CardDescription>Requests, cost, and latency by provider.</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.providerUsage}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="share"
                    >
                      {data.providerUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(value: number, name: string, props: any) => [
                        `${value}% ($${props.payload.cost})`,
                        props.payload.name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent executions</CardTitle>
                <CardDescription>Most recent LLM runs and outcomes.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentExecutions.map((execution) => (
                      <TableRow key={execution.id}>
                        <TableCell>{execution.id}</TableCell>
                        <TableCell>{execution.name}</TableCell>
                        <TableCell>{execution.status}</TableCell>
                        <TableCell>{execution.duration}</TableCell>
                        <TableCell>{execution.cost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tool registry</CardTitle>
                <CardDescription>Service health and latency for core tools.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.toolRegistry.map((tool) => (
                  <div key={tool.name} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-sm text-muted-foreground">{tool.latency}</p>
                    </div>
                    <span className="text-sm font-medium">{tool.status}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Guardrails</CardTitle>
                <CardDescription>Safety and policy monitoring signals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.guardrails.map((guardrail) => (
                  <div key={guardrail.name} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{guardrail.name}</p>
                      <span className={`text-sm font-medium ${toneClasses[guardrail.tone] || "text-muted-foreground"}`}>
                        {guardrail.value}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RAG insights</CardTitle>
                <CardDescription>Retrieval quality and grounding measures.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.ragStats.map((stat) => (
                  <div key={stat.name} className="flex items-center justify-between rounded-lg border p-3">
                    <p className="font-medium">{stat.name}</p>
                    <span className="text-sm text-muted-foreground">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
