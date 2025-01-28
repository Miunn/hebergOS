import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Container } from "@prisma/client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export default function ContainerGraphs({ container }: { container: Container }) {

    const t = useTranslations("pages.app.container.graphs");

    const [selectedPeriod, setSelectedPeriod] = useState('hour');

    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
    } satisfies ChartConfig

    return (
        <div className="flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>{t('title', { name: container.name })}</CardTitle>
                        <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t('period.label')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t('period.label')}</SelectLabel>
                                    <SelectItem value="hour">{t('period.options.hour')}</SelectItem>
                                    <SelectItem value="4-hours">{t('period.options.4hours')}</SelectItem>
                                    <SelectItem value="day">{t('period.options.day')}</SelectItem>
                                    <SelectItem value="week">{t('period.options.week')}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
            </Card>

            <Card className="py-6">
                    <ChartContainer config={chartConfig} className="min-h-28 max-h-64 w-full">
                        <LineChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Line dataKey={"desktop"} fill="var(--color-desktop)" radius={4} />
                            <Line dataKey={"mobile"} fill="var(--color-mobile)" radius={4} />
                        </LineChart>
                    </ChartContainer>
            </Card>

            <Card>
                <CardContent>

                </CardContent>
            </Card>
        </div>
    )
}