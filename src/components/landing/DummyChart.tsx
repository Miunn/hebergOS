'use client'

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useFormatter, useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function DummyChart() {

    const t = useTranslations("pages.home.section3");
    const formatter = useFormatter();

    const chartConfig = {
        memory: {
            label: "Memory",
            color: "#60a5fa",
        },
    } satisfies ChartConfig

    const memoryChartData =
        Array.from({ length: 24 }, (_, i) => ({
            timestamp: new Date(Date.now() - (23 - i) * 3600000).getTime(),
            memory: Math.max(0, Math.min(1.5, (Math.sin(i * 0.5) * 10 + Math.random() * 2 + 20) / 30))
        }))

    console.log(memoryChartData)

    return (
        <Card className="pb-4">
            <CardHeader>
                <CardTitle>{t('widgetTitle')}</CardTitle>
            </CardHeader>
            <ChartContainer config={chartConfig} className="min-h-28 max-h-64 w-full pr-6">
                <AreaChart accessibilityLayer data={memoryChartData}>
                    <CartesianGrid />
                    <XAxis
                        dataKey="timestamp"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => formatter.dateTime(value, { hour: "2-digit", minute: "2-digit" }).toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')}
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
    )
}