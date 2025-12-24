import { useState } from 'react';
import { FileText, Download, Printer } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: typeof FileText;
  category: 'pocket-money' | 'laundry' | 'general';
}

const reports: ReportCard[] = [
  {
    id: 'pocket-money-monthly',
    title: 'Pocket Money Report',
    description: 'Monthly summary of pocket money distributed to all students',
    icon: FileText,
    category: 'pocket-money',
  },
  {
    id: 'pocket-money-outstanding',
    title: 'Outstanding Balance Report',
    description: 'Students with remaining pocket money balance',
    icon: FileText,
    category: 'pocket-money',
  },
  {
    id: 'laundry-monthly',
    title: 'Laundry Report',
    description: 'Monthly laundry summary for all students',
    icon: FileText,
    category: 'laundry',
  },
  {
    id: 'laundry-cost',
    title: 'Laundry Cost Report',
    description: 'Total laundry costs breakdown per month',
    icon: FileText,
    category: 'laundry',
  },
  {
    id: 'dhobi-summary',
    title: 'Dhobi Performance Report',
    description: 'Summary of work done by each laundry staff member',
    icon: FileText,
    category: 'laundry',
  },
  {
    id: 'student-full',
    title: 'Student Complete Report',
    description: 'Full report including pocket money and laundry per student',
    icon: FileText,
    category: 'general',
  },
];

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState('December');
  const [selectedYear, setSelectedYear] = useState('2024');

  const handleExport = (reportId: string, format: 'pdf' | 'excel') => {
    toast({
      title: 'Export Initiated',
      description: `Generating ${format.toUpperCase()} report for ${selectedMonth} ${selectedYear}...`,
    });
    // API-ready: This would trigger the actual export
  };

  const handlePrint = (reportId: string) => {
    toast({
      title: 'Print Preview',
      description: `Opening print preview for ${selectedMonth} ${selectedYear}...`,
    });
    // API-ready: This would open print preview
  };

  const getCategoryColor = (category: ReportCard['category']) => {
    switch (category) {
      case 'pocket-money':
        return 'bg-secondary/10 border-secondary/20 hover:border-secondary/40';
      case 'laundry':
        return 'bg-primary/10 border-primary/20 hover:border-primary/40';
      case 'general':
        return 'bg-muted border-border hover:border-muted-foreground/40';
    }
  };

  const getCategoryBadge = (category: ReportCard['category']) => {
    switch (category) {
      case 'pocket-money':
        return (
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium">
            Pocket Money
          </span>
        );
      case 'laundry':
        return (
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
            Laundry
          </span>
        );
      case 'general':
        return (
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
            General
          </span>
        );
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Reports"
        description="Generate and export detailed reports"
      >
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['2023', '2024', '2025'].map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-5 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">6</p>
              <p className="text-sm text-muted-foreground">Available Reports</p>
            </div>
          </div>
        </div>
        <div className="bg-secondary/10 rounded-xl border border-secondary/20 p-5 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-sm text-muted-foreground">Pocket Money Reports</p>
            </div>
          </div>
        </div>
        <div className="bg-primary/10 rounded-xl border border-primary/20 p-5 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Laundry Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card
            key={report.id}
            className={`transition-all duration-200 ${getCategoryColor(report.category)} animate-fade-in`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-border">
                  <report.icon className="w-5 h-5 text-foreground" />
                </div>
                {getCategoryBadge(report.category)}
              </div>
              <CardTitle className="text-lg mt-3">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleExport(report.id, 'pdf')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleExport(report.id, 'excel')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Excel
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePrint(report.id)}
                >
                  <Printer className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-muted/50 rounded-xl p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-2">Report Information</h3>
        <p className="text-sm text-muted-foreground mb-4">
          All reports are generated based on the selected month and year. Export
          buttons will generate downloadable files ready for printing or sharing.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-muted-foreground">
              Pocket Money reports include transaction history and balances
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">
              Laundry reports include costs and staff performance
            </span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
