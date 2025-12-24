import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/api/axios';
import { toast } from '@/hooks/use-toast';
import { LaundryEntry, Student } from '@/types';

export default function Laundry() {
  const [entries, setEntries] = useState<LaundryEntry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('December');
  const [selectedYear, setSelectedYear] = useState('2024');

  const [formData, setFormData] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    numberOfClothes: '',
    dhobiName: '',
    costPerCloth: '15',
  });

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  useEffect(() => {
    fetchStudents();
    fetchEntries();
  }, [selectedMonth, selectedYear]);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/admin/students');
      if (data.status) {
        setStudents(data.data.map((s: any) => ({
          id: String(s.id),
          studentId: s.studentId || s.student_code,
          name: s.name,
          class: s.class,
          section: s.section || '',
          status: s.status === 1 ? 'active' : 'inactive',
        })));
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to fetch students', variant: 'destructive' });
    }
  };

  const fetchEntries = async () => {
    try {
      const monthIndex = months.indexOf(selectedMonth) + 1; // 1-based month
      const { data } = await api.get(`/admin/laundry?month=${monthIndex}&year=${selectedYear}`);
      if (data.status) {
        setEntries(data.data.map((e: any) => ({
          id: String(e.id),
          studentId: String(e.studentId),
          studentName: e.studentName,
          date: e.date,
          numberOfClothes: Number(e.numberOfClothes),
          dhobiName: e.dhobiName,
          costPerCloth: Number(e.costPerCloth),
          totalAmount: Number(e.totalAmount),
        })));
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to fetch laundry entries', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      date: new Date().toISOString().split('T')[0],
      numberOfClothes: '',
      dhobiName: '',
      costPerCloth: '15',
    });
  };

  const handleAddEntry = async () => {
    if (!formData.studentId || !formData.numberOfClothes || !formData.dhobiName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        numberOfClothes: Number(formData.numberOfClothes),
        costPerCloth: Number(formData.costPerCloth),
        totalAmount: Number(formData.numberOfClothes) * Number(formData.costPerCloth),
      };
      const { data } = await api.post('/admin/laundry', payload);
      if (data.status) {
        toast({ title: 'Success', description: 'Laundry entry recorded.' });
        setIsDialogOpen(false);
        resetForm();
        fetchEntries();
      } else {
        toast({ title: 'Error', description: data.message || 'Failed to add entry', variant: 'destructive' });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to add laundry entry.', variant: 'destructive' });
    }
  };

  // Filtered summaries
  const filteredEntries = entries;
  const studentSummary = students
    .filter((s) => s.status === 'active')
    .map((student) => {
      const studentEntries = filteredEntries.filter((e) => e.studentId === student.id);
      const totalClothes = studentEntries.reduce((sum, e) => sum + e.numberOfClothes, 0);
      const totalCost = studentEntries.reduce((sum, e) => sum + e.totalAmount, 0);
      return { ...student, totalClothes, totalCost, entryCount: studentEntries.length };
    })
    .filter((s) => s.entryCount > 0);

  const entryColumns = [
    { key: 'date', header: 'Date' },
    { key: 'studentName', header: 'Student' },
    {
      key: 'numberOfClothes',
      header: 'Clothes',
      render: (e: LaundryEntry) => <span className="font-semibold">{e.numberOfClothes}</span>,
    },
    { key: 'dhobiName', header: 'Dhobi' },
    {
      key: 'costPerCloth',
      header: 'Rate',
      render: (e: LaundryEntry) => `Rs. ${e.costPerCloth}`,
    },
    {
      key: 'totalAmount',
      header: 'Total',
      render: (e: LaundryEntry) => <span className="font-semibold text-secondary">Rs. {e.totalAmount.toLocaleString()}</span>,
    },
  ];

  const studentSummaryColumns = [
    { key: 'studentId', header: 'Student ID' },
    { key: 'name', header: 'Name' },
    { key: 'class', header: 'Class' },
    {
      key: 'totalClothes',
      header: 'Total Clothes',
      render: (s: any) => <span className="font-semibold">{s.totalClothes}</span>,
    },
    {
      key: 'totalCost',
      header: 'Total Cost',
      render: (s: any) => <span className="font-semibold text-secondary">Rs. {s.totalCost.toLocaleString()}</span>,
    },
    { key: 'entryCount', header: 'Entries' },
  ];

  return (
    <MainLayout>
      <PageHeader title="Laundry Management" description="Track clothes washing records and costs">
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{months.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>{['2023','2024','2025'].map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}><Plus className="w-4 h-4 mr-2"/>Add Entry</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Log Laundry Entry</DialogTitle>
                <DialogDescription>Record clothes given for washing.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Label>Select Student *</Label>
                <Select value={formData.studentId} onValueChange={(v) => setFormData({ ...formData, studentId: v })}>
                  <SelectTrigger><SelectValue placeholder="Choose a student" /></SelectTrigger>
                  <SelectContent>
                    {students.filter(s => s.status==='active').map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.studentId})</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Date *</Label><Input type="date" value={formData.date} onChange={(e)=>setFormData({...formData,date:e.target.value})}/></div>
                  <div><Label>Number of Clothes *</Label><Input type="number" value={formData.numberOfClothes} onChange={(e)=>setFormData({...formData,numberOfClothes:e.target.value})}/></div>
                </div>
                <div><Label>Dhobi / Staff *</Label><Input value={formData.dhobiName} onChange={(e)=>setFormData({...formData,dhobiName:e.target.value})} placeholder="Enter dhobi name"/></div>
                <div><Label>Cost per Cloth (Rs.)</Label><Input type="number" value={formData.costPerCloth} onChange={(e)=>setFormData({...formData,costPerCloth:e.target.value})}/></div>
                {formData.numberOfClothes && formData.costPerCloth && (
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-bold text-foreground">Rs. {(Number(formData.numberOfClothes)*Number(formData.costPerCloth)).toLocaleString()}</p>
                  </div>
                )}
                <Button onClick={handleAddEntry} className="w-full">Log Entry</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries">Daily Entries</TabsTrigger>
          <TabsTrigger value="student-summary">By Student</TabsTrigger>
        </TabsList>
        <TabsContent value="entries">
          <DataTable data={filteredEntries} columns={entryColumns} searchPlaceholder="Search entries..." searchKey="studentName"/>
        </TabsContent>
        <TabsContent value="student-summary">
          <DataTable data={studentSummary} columns={studentSummaryColumns} searchPlaceholder="Search students..." searchKey="name"/>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
