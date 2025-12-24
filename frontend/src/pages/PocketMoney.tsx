import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockStudents, mockPocketMoneyTransactions } from '@/data/mockData';
import { PocketMoneyTransaction } from '@/types';
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

export default function PocketMoney() {
  const [transactions, setTransactions] = useState<PocketMoneyTransaction[]>(
    mockPocketMoneyTransactions
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('December');
  const [selectedYear, setSelectedYear] = useState('2024');

  const [formData, setFormData] = useState({
    studentId: '',
    amountGiven: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      studentId: '',
      amountGiven: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const handleAddTransaction = () => {
    if (!formData.studentId || !formData.amountGiven) {
      toast({
        title: 'Validation Error',
        description: 'Please select a student and enter an amount.',
        variant: 'destructive',
      });
      return;
    }

    const student = mockStudents.find((s) => s.id === formData.studentId);
    if (!student) return;

    const newTransaction: PocketMoneyTransaction = {
      id: String(Date.now()),
      studentId: formData.studentId,
      studentName: student.name,
      month: selectedMonth,
      year: Number(selectedYear),
      amountAssigned: student.monthlyPocketMoney,
      amountGiven: Number(formData.amountGiven),
      date: formData.date,
      notes: formData.notes,
    };

    setTransactions([newTransaction, ...transactions]);
    setIsDialogOpen(false);
    resetForm();
    toast({
      title: 'Success',
      description: 'Pocket money transaction recorded.',
    });
  };

  // Calculate student-wise summary
  const studentSummary = mockStudents
    .filter((s) => s.status === 'active')
    .map((student) => {
      const studentTransactions = transactions.filter(
        (t) =>
          t.studentId === student.id &&
          t.month === selectedMonth &&
          t.year === Number(selectedYear)
      );
      const totalGiven = studentTransactions.reduce(
        (sum, t) => sum + t.amountGiven,
        0
      );
      const remaining = student.monthlyPocketMoney - totalGiven;

      return {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        class: `${student.class} - ${student.section}`,
        assigned: student.monthlyPocketMoney,
        given: totalGiven,
        remaining: remaining,
        transactionCount: studentTransactions.length,
      };
    });

  const filteredTransactions = transactions.filter(
    (t) => t.month === selectedMonth && t.year === Number(selectedYear)
  );

  const transactionColumns = [
    { key: 'date', header: 'Date' },
    { key: 'studentName', header: 'Student' },
    {
      key: 'amountAssigned',
      header: 'Assigned',
      render: (t: PocketMoneyTransaction) => `Rs. ${t.amountAssigned.toLocaleString()}`,
    },
    {
      key: 'amountGiven',
      header: 'Given',
      render: (t: PocketMoneyTransaction) => (
        <span className="font-semibold text-secondary">
          Rs. {t.amountGiven.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (t: PocketMoneyTransaction) => (
        <span className="text-muted-foreground">{t.notes || '-'}</span>
      ),
    },
  ];

  const summaryColumns = [
    { key: 'studentId', header: 'Student ID' },
    { key: 'name', header: 'Name' },
    { key: 'class', header: 'Class' },
    {
      key: 'assigned',
      header: 'Assigned',
      render: (s: (typeof studentSummary)[0]) => `Rs. ${s.assigned.toLocaleString()}`,
    },
    {
      key: 'given',
      header: 'Given',
      render: (s: (typeof studentSummary)[0]) => (
        <span className="font-semibold text-secondary">
          Rs. {s.given.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'remaining',
      header: 'Remaining',
      render: (s: (typeof studentSummary)[0]) => (
        <Badge variant={s.remaining > 0 ? 'default' : 'secondary'}>
          Rs. {s.remaining.toLocaleString()}
        </Badge>
      ),
    },
    {
      key: 'transactionCount',
      header: 'Transactions',
      render: (s: (typeof studentSummary)[0]) => s.transactionCount,
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Pocket Money"
        description="Track and manage student pocket money transactions"
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Record Pocket Money</DialogTitle>
                <DialogDescription>
                  Add a new pocket money transaction for a student.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Select Student *</Label>
                  <Select
                    value={formData.studentId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, studentId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents
                        .filter((s) => s.status === 'active')
                        .map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.studentId})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (Rs.) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amountGiven}
                      onChange={(e) =>
                        setFormData({ ...formData, amountGiven: e.target.value })
                      }
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Add any notes..."
                    rows={2}
                  />
                </div>
                <Button onClick={handleAddTransaction} className="w-full">
                  Record Transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Total Assigned</p>
          <p className="text-2xl font-bold text-foreground">
            Rs. {studentSummary.reduce((sum, s) => sum + s.assigned, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-secondary/10 rounded-xl border border-secondary/20 p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Total Given</p>
          <p className="text-2xl font-bold text-secondary">
            Rs. {studentSummary.reduce((sum, s) => sum + s.given, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-warning/10 rounded-xl border border-warning/20 p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Total Remaining</p>
          <p className="text-2xl font-bold text-warning">
            Rs. {studentSummary.reduce((sum, s) => sum + s.remaining, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Monthly Summary</TabsTrigger>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <DataTable
            data={studentSummary}
            columns={summaryColumns}
            searchPlaceholder="Search students..."
            searchKey="name"
          />
        </TabsContent>
        <TabsContent value="transactions">
          <DataTable
            data={filteredTransactions}
            columns={transactionColumns}
            searchPlaceholder="Search transactions..."
            searchKey="studentName"
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
