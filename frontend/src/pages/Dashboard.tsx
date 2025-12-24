import { Users, Wallet, Shirt, TrendingUp, Banknote } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import {
  mockDashboardStats,
  monthlyPocketMoneyData,
  monthlyLaundryData,
} from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function Dashboard() {
  const formatCurrency = (value: number) => `Rs. ${value.toLocaleString()}`;

  return (
    <MainLayout>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your school management system."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={mockDashboardStats.totalStudents}
          subtitle="Active students"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Pocket Money Given"
          value={formatCurrency(mockDashboardStats.pocketMoneyGivenThisMonth)}
          subtitle="This month"
          icon={Wallet}
          variant="secondary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Money Remaining"
          value={formatCurrency(mockDashboardStats.pocketMoneyRemaining)}
          subtitle="To be distributed"
          icon={Banknote}
          variant="warning"
        />
        <StatCard
          title="Clothes Washed"
          value={mockDashboardStats.clothesWashedThisMonth}
          subtitle="This month"
          icon={Shirt}
          variant="default"
        />
        <StatCard
          title="Laundry Cost"
          value={formatCurrency(mockDashboardStats.monthlyLaundryCost)}
          subtitle="This month"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pocket Money Chart */}
        <div className="bg-card rounded-xl border border-border p-6 card-shadow animate-fade-in">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Pocket Money Overview
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPocketMoneyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`Rs. ${value}`, '']}
                />
                <Legend />
                <Bar
                  dataKey="given"
                  name="Given"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="remaining"
                  name="Remaining"
                  fill="hsl(var(--warning))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Laundry Chart */}
        <div className="bg-card rounded-xl border border-border p-6 card-shadow animate-fade-in">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Monthly Laundry Summary
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyLaundryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="clothes"
                  name="Clothes"
                  fill="hsl(var(--secondary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="cost"
                  name="Cost (Rs.)"
                  fill="hsl(var(--info))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard
          title="Add New Student"
          description="Register a new student in the system"
          href="/students"
        />
        <QuickActionCard
          title="Record Pocket Money"
          description="Add pocket money transaction"
          href="/pocket-money"
        />
        <QuickActionCard
          title="Log Laundry Entry"
          description="Record clothes for washing"
          href="/laundry"
        />
      </div>
    </MainLayout>
  );
}

function QuickActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group bg-card rounded-xl border border-border p-5 card-shadow hover:border-primary/50 hover:shadow-lg transition-all duration-200 animate-fade-in"
    >
      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
        {title}
      </h4>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </a>
  );
}
