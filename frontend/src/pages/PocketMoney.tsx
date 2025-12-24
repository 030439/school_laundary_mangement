import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '@/api/axios';
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
import { toast } from '@/hooks/use-toast';

const months = [
  'January','February','March','April','May','June','July','August','September','October','November','December',
];

export default function PocketMoney() {
  const [students, setStudents] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [studentSummary, setStudentSummary] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('December');
  const [selectedYear, setSelectedYear] = useState('2025');

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

  /* ---------------- API CALLS ---------------- */

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/admin/pocket-money-transactions', {
        params: { month: selectedMonth, year: selectedYear },
      });
      setTransactions(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentSummary = async () => {
    try {
      const res = await api.get('/admin/pocket-money/student-summary', {
        params: { month: selectedMonth, year: selectedYear },
      });
      setStudentSummary(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchTransactions();
    fetchStudentSummary();
  }, [selectedMonth, selectedYear]);

  /* ---------------- ADD TRANSACTION ---------------- */

  const handleAddTransaction = async () => {
    if (!formData.studentId || !formData.amountGiven) {
      toast({
        title: 'Validation Error',
        description: 'Please select a student and enter an amount.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.post('/admin/pocket-money-transactions', {
        student_id: formData.studentId,
        amount_given: Number(formData.amountGiven),
        date: formData.date,
        notes: formData.notes,
      });

      toast({ title: 'Success', description: 'Pocket money transaction recorded.' });
      setIsDialogOpen(false);
      resetForm();
      fetchTransactions();
      fetchStudentSummary();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to add transaction.', variant: 'destructive' });
    }
  };

  /* ---------------- COLUMNS ---------------- */

 const transactionColumns = [
  { key: 'date', header: 'Date' },
  { key: 'studentName', header: 'Student' },
  { key: 'assigned', header: 'Assigned', render: (t: any) => `Rs. ${t.assigned.toLocaleString()}` },
  { key: 'given', header: 'Given', render: (t: any) => <span className="font-semibold text-secondary">Rs. {Number(t.given).toLocaleString()}</span> },
  { key: 'notes', header: 'Notes', render: (t: any) => <span className="text-muted-foreground">{t.notes || '-'}</span> },
];


  const summaryColumns = [
    { key: 'studentId', header: 'Student ID' },
    { key: 'name', header: 'Name' },
    { key: 'class', header: 'Class' },
    { key: 'assigned', header: 'Assigned', render: (s: any) => `Rs. ${s.assigned.toLocaleString()}` },
    { key: 'given', header: 'Given', render: (s: any) => <span className="font-semibold text-secondary">Rs. {s.given.toLocaleString()}</span> },
    { key: 'remaining', header: 'Remaining', render: (s: any) => (
        <Badge variant={s.remaining > 0 ? 'default' : 'secondary'}>Rs. {s.remaining.toLocaleString()}</Badge>
      ) },
    { key: 'transactionCount', header: 'Transactions', render: (s: any) => s.transactionCount },
  ];

  /* ---------------- FILTERED DATA ---------------- */

  const filteredTransactions = transactions;

  /* ---------------- TOTALS FOR SUMMARY CARDS ---------------- */

  const totalAssigned = studentSummary.reduce((sum, s) => sum + s.assigned, 0);
  const totalGiven = studentSummary.reduce((sum, s) => sum + s.given, 0);
  const totalRemaining = studentSummary.reduce((sum, s) => sum + s.remaining, 0);

  return (
    <MainLayout>
      <PageHeader title="Pocket Money" description="Track and manage student pocket money transactions">
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>{['2023','2024','2025'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}><Plus className="w-4 h-4 mr-2" />Add Transaction</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Record Pocket Money</DialogTitle>
                <DialogDescription>Add a new pocket money transaction for a student.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Label>Select Student *</Label>
                <Select value={formData.studentId} onValueChange={(v) => setFormData({ ...formData, studentId: v })}>
                  <SelectTrigger><SelectValue placeholder="Choose a student" /></SelectTrigger>
                  <SelectContent>
                    {students.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name} ({s.studentId})</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="number" placeholder="Amount" value={formData.amountGiven}
                    onChange={(e) => setFormData({ ...formData, amountGiven: e.target.value })} />
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <Textarea placeholder="Notes (optional)" value={formData.notes} rows={2} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                <Button onClick={handleAddTransaction} className="w-full">Record Transaction</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Total Assigned</p>
          <p className="text-2xl font-bold text-foreground">Rs. {totalAssigned.toLocaleString()}</p>
        </div>
        <div className="bg-secondary/10 rounded-xl border border-secondary/20 p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Total Given</p>
          <p className="text-2xl font-bold text-secondary">Rs. {totalGiven.toLocaleString()}</p>
        </div>
        <div className="bg-warning/10 rounded-xl border border-warning/20 p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Total Remaining</p>
          <p className="text-2xl font-bold text-warning">Rs. {totalRemaining.toLocaleString()}</p>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Monthly Summary</TabsTrigger>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <DataTable data={studentSummary} columns={summaryColumns} searchKey="name" searchPlaceholder="Search students..." />
        </TabsContent>
        <TabsContent value="transactions">
          <DataTable data={filteredTransactions} columns={transactionColumns} searchKey="studentName" searchPlaceholder="Search transactions..." />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
