import { useState } from 'react';
import { FileText, Download, Printer } from 'lucide-react';
import api from '@/api/axios';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
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
  const [selectedMonth, setSelectedMonth] = useState<number>(12);
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [loading, setLoading] = useState<string | null>(null);

  /* ================= EXPORT ================= */

  const handleExport = async (
    reportId: string,
    format: 'pdf' | 'excel'
  ) => {
    try {
      setLoading(reportId + format);

      const res = await api.get(
        `/admin/reports/${reportId}/export/${format}`,
        {
          params: {
            month: selectedMonth,
            year: selectedYear,
          },
          responseType: 'blob',
        }
      );

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportId}-${selectedMonth}-${selectedYear}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      link.click();

      toast({
        title: 'Report Generated',
        description: `${format.toUpperCase()} downloaded successfully`,
      });
    } catch (e) {
      toast({
        title: 'Export Failed',
        description: 'Unable to generate report',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  /* ================= PRINT ================= */

  const handlePrint = (reportId: string) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/admin/reports/${reportId}/print?month=${selectedMonth}&year=${selectedYear}`;
    window.open(url, '_blank');
  };

  /* ================= UI HELPERS ================= */

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
      <PageHeader title="Reports" description="Generate and export detailed reports">
        <div className="flex items-center gap-2">
          <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={String(m.value)}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['2023', '2024', '2025'].map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

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
                  disabled={loading !== null}
                  onClick={() => handleExport(report.id, 'pdf')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={loading !== null}
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
    </MainLayout>
  );
}
