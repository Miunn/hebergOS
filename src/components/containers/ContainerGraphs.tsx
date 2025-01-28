import { useFormatter, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Container } from "@prisma/client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useCallback, useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { getContainerStats } from "@/actions/containers";

export default function ContainerGraphs({ container }: { container: Container }) {

    const t = useTranslations("pages.app.container.graphs");
    const formatter = useFormatter();

    const [selectedPeriod, setSelectedPeriod] = useState<"hour" | "4hours" | "day" | "week">('hour');

    const [memoryChartData, setMemoryChartData] = useState<{ timestamp: number; memory: number }[]>([]);
    const [cpuChartData, setCpuChartData] = useState<{ timestamp: number; cpu: number }[]>([]);
    const [networkChartData, setNetworkChartData] = useState<{ timestamp: number; netUp: number; netDown: number }[]>([]);
    const [networkDeltaChartData, setNetworkDeltaChartData] = useState<{ timestamp: number; netDeltaUp: number; netDeltaDown: number }[]>([]);

    const fetchChartsData = async () => {
        console.log("Asking period", selectedPeriod);
        let stats = await getContainerStats(container.id, selectedPeriod);

        if (!stats) {
            return;
        }

        if (selectedPeriod === "hour") {
            stats = stats.filter((entry) => entry.timestamp > Date.now() / 1000 - 3600);
        }

        setMemoryChartData(stats.map((entry) => ({
            timestamp: entry.timestamp,
            memory: entry.memory,
        })).sort((a, b) => a.timestamp - b.timestamp));
        setCpuChartData(stats.map((entry) => ({
            timestamp: entry.timestamp,
            cpu: entry.cpu,
        })));
        setNetworkChartData(stats.map((entry) => ({
            timestamp: entry.timestamp,
            netUp: entry.netUp,
            netDown: entry.netDown
        })));
        setNetworkDeltaChartData(stats.map((entry) => ({
            timestamp: entry.timestamp,
            netDeltaUp: entry.netDeltaUp,
            netDeltaDown: entry.netDeltaDown
        })));
    };

    const chartConfig = {
        memory: {
            label: "Memory",
            color: "#60a5fa",
        },
        cpu: {
            label: "CPU",
            color: "#f87171",
        },
        netUp: {
            label: "Network Up",
            color: "#34d399",
        },
        netDown: {
            label: "Network Down",
            color: "#fbbf24",
        },
        netDeltaUp: {
            label: "Network Delta Up",
            color: "#34d399",
        },
        netDeltaDown: {
            label: "Network Delta Down",
            color: "#fbbf24",
        }
    } satisfies ChartConfig

    const datetimeTickFormatter = (value: number) => {
        switch (selectedPeriod) {
            case "hour":
                return formatter.dateTime(value * 1000, { hour: "2-digit", minute: "2-digit" }).toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
            case "4hours":
                return formatter.dateTime(value * 1000, { hour: "2-digit", minute: "2-digit" }).toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
            case "day":
                return formatter.dateTime(value * 1000, { hour: "2-digit", minute: "2-digit" }).toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
            case "week":
            default:
                return formatter.dateTime(value * 1000, { weekday: "short", hour: "2-digit", minute: "2-digit" }).toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
        }
    }

    useEffect(() => {
        fetchChartsData();
    }, [selectedPeriod]);

    return (
        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>{t('title', { name: container.name })}</CardTitle>
                        <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as "hour" | "4hours" | "day" | "week")}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t('period.label')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t('period.label')}</SelectLabel>
                                    <SelectItem value="hour">{t('period.options.hour')}</SelectItem>
                                    <SelectItem value="4hours">{t('period.options.4hours')}</SelectItem>
                                    <SelectItem value="day">{t('period.options.day')}</SelectItem>
                                    <SelectItem value="week">{t('period.options.week')}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
            </Card>

            <Card className="py-6">
                <ChartContainer config={chartConfig} className="min-h-28 max-h-64 w-full pr-6">
                    <AreaChart accessibilityLayer data={memoryChartData}>
                        <CartesianGrid />
                        <XAxis
                            dataKey="timestamp"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => datetimeTickFormatter(value)}
                        />
                        <YAxis
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => formatter.number(value, { style: "decimal", maximumFractionDigits: 2 })}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area dataKey={"memory"} fill="var(--color-memory)" stroke="var(--color-memory)" fillOpacity={0.4} />
                    </AreaChart>
                </ChartContainer>
            </Card>

            <Card className="py-6">
                <ChartContainer config={chartConfig} className="min-h-28 max-h-64 w-full pr-6">
                    <AreaChart accessibilityLayer data={cpuChartData}>
                        <CartesianGrid />
                        <XAxis
                            dataKey="timestamp"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => datetimeTickFormatter(value)}
                        />
                        <YAxis
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => formatter.number(value, { style: "decimal", maximumFractionDigits: 2 })}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area dataKey={"cpu"} fill="var(--color-cpu)" stroke="var(--color-cpu)" fillOpacity={0.4} />
                    </AreaChart>
                </ChartContainer>
            </Card>

            <Card className="py-6">
                <ChartContainer config={chartConfig} className="min-h-28 max-h-64 w-full pr-6">
                    <AreaChart accessibilityLayer data={networkChartData}>
                        <CartesianGrid />
                        <XAxis
                            dataKey="timestamp"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => datetimeTickFormatter(value)}
                        />
                        <YAxis
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => formatter.number(value, { style: "decimal", maximumFractionDigits: 2 })}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area dataKey={"netUp"} fill="var(--color-netUp)" stroke="var(--color-netUp)" fillOpacity={0.4} />
                        <Area dataKey={"netDown"} fill="var(--color-netDown)" stroke="var(--color-netDown)" fillOpacity={0.4} />
                    </AreaChart>
                </ChartContainer>
            </Card>

            <Card className="py-6">
                <ChartContainer config={chartConfig} className="min-h-28 max-h-64 w-full pr-6">
                    <AreaChart accessibilityLayer data={networkDeltaChartData}>
                        <CartesianGrid />
                        <XAxis
                            dataKey="timestamp"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => datetimeTickFormatter(value)}
                        />
                        <YAxis
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => formatter.number(value, { style: "decimal", maximumFractionDigits: 2 })}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area dataKey={"netDeltaUp"} fill="var(--color-netDeltaUp)" stroke="var(--color-netDeltaUp)" fillOpacity={0.4} />
                        <Area dataKey={"netDeltaDown"} fill="var(--color-netDeltaDown)" stroke="var(--color-netDeltaDown)" fillOpacity={0.4} />
                    </AreaChart>
                </ChartContainer>
            </Card>
        </div>
    )
}