import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '@/api/axios';
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
import { toast } from '@/hooks/use-toast';

export default function Laundry() {
  const [entries, setEntries] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [dhobis, setDhobis] = useState<any[]>([]);
  const [studentSummary, setStudentSummary] = useState<any[]>([]);
  const [dhobiSummary, setDhobiSummary] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState('12'); // Month as number string
  const [selectedYear, setSelectedYear] = useState('2025');

  const [formData, setFormData] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    numberOfClothes: '',
    dhobiId: '',
    costPerCloth: '15',
  });

  /* ---------------- API LOADERS ---------------- */
  const fetchStudents = async () => {
    const res = await api.get('/admin/students');
    setStudents(res.data.data);
  };

  const fetchDhobis = async () => {
    const res = await api.get('/admin/laundry-staff'); // Assuming /laundry-staff returns dhobis
    setDhobis(res.data.data);
  };

  const fetchEntries = async () => {
    const res = await api.get('/admin/laundry', {
      params: { month: selectedMonth, year: selectedYear },
    });
    setEntries(res.data.data);
  };

  const fetchStudentSummary = async () => {
    const res = await api.get('/admin/reports/student-laundry-summary', {
      params: { month: selectedMonth, year: selectedYear },
    });
    setStudentSummary(res.data.data);
  };

  const fetchDhobiSummary = async () => {
    const res = await api.get('/admin/reports/laundry/dhobi-summary', {
      params: { month: selectedMonth, year: selectedYear },
    });
    setDhobiSummary(res.data.data);
  };

  useEffect(() => {
    fetchStudents();
    fetchDhobis();
  }, []);

  useEffect(() => {
    fetchEntries();
    fetchStudentSummary();
    fetchDhobiSummary();
  }, [selectedMonth, selectedYear]);

  /* ---------------- AUTO UPDATE COST PER CLOTH ON DHOBI SELECT ---------------- */
  useEffect(() => {
    const selectedDhobi = dhobis.find(d => d.id === formData.dhobiId);
    if (selectedDhobi) {
      setFormData(prev => ({ ...prev, costPerCloth: String(selectedDhobi.per_cloth_rate || 15) }));
    }
  }, [formData.dhobiId, dhobis]);

  /* ---------------- ADD ENTRY ---------------- */
  const handleAddEntry = async () => {
    if (!formData.studentId || !formData.numberOfClothes || !formData.dhobiId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const selectedDhobi = dhobis.find(d => d.id === formData.dhobiId);

    await api.post('/laundry-entries', {
      student_id: formData.studentId,
      date: formData.date,
      number_of_clothes: Number(formData.numberOfClothes),
      dhobi_name: selectedDhobi?.name,
      cost_per_cloth: Number(formData.costPerCloth),
    });

    toast({ title: 'Success', description: 'Laundry entry recorded.' });

    setIsDialogOpen(false);
    setFormData({
      studentId: '',
      date: new Date().toISOString().split('T')[0],
      numberOfClothes: '',
      dhobiId: '',
      costPerCloth: '15',
    });

    fetchEntries();
    fetchStudentSummary();
    fetchDhobiSummary();
  };

  /* ---------------- COLUMNS ---------------- */
  const entryColumns = [
    { key: 'date', header: 'Date' },
    { key: 'studentName', header: 'Student' },
    { key: 'numberOfClothes', header: 'Clothes' },
    { key: 'dhobiName', header: 'Dhobi' },
    { key: 'costPerCloth', header: 'Rate' },
    { key: 'totalAmount', header: 'Total' },
  ];

  const studentSummaryColumns = [
    { key: 'studentId', header: 'Student ID' },
    { key: 'name', header: 'Name' },
    { key: 'class', header: 'Class' },
    { key: 'totalClothes', header: 'Total Clothes' },
    { key: 'totalCost', header: 'Total Cost' },
    { key: 'entryCount', header: 'Entries' },
  ];

  const dhobiSummaryColumns = [
    { key: 'name', header: 'Dhobi Name' },
    { key: 'totalClothes', header: 'Total Clothes' },
    { key: 'totalCost', header: 'Total Earnings' },
    { key: 'entryCount', header: 'Entries' },
  ];

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  const totalClothes = entries.reduce((sum, e) => sum + e.numberOfClothes, 0);
  const totalCost = entries.reduce((sum, e) => sum + e.totalAmount, 0);

  return (
    <MainLayout>
      <PageHeader title="Laundry Management" description="Track clothes washing records and costs">
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              {months.map((m,index) => (
                <SelectItem key={index} value={(index+1).toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['2023','2024','2025'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Entry</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Log Laundry Entry</DialogTitle>
                <DialogDescription>Record clothes given for washing.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <Label>Select Student *</Label>
                <Select value={formData.studentId} onValueChange={v => setFormData({ ...formData, studentId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {students.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name} ({s.studentId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                <Input type="number" placeholder="Number of Clothes" value={formData.numberOfClothes}
                  onChange={e => setFormData({ ...formData, numberOfClothes: e.target.value })} />

                <Label>Select Dhobi *</Label>
                <Select value={formData.dhobiId} onValueChange={v => setFormData({ ...formData, dhobiId: v })}>
                  <SelectTrigger><SelectValue placeholder="Choose a Dhobi" /></SelectTrigger>
                  <SelectContent>
                    {dhobis.map(d => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name} (Rs.{d.per_cloth_rate || 15})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input type="number" placeholder="Cost per Cloth" value={formData.costPerCloth}
                  onChange={e => setFormData({ ...formData, costPerCloth: e.target.value })} />

                <Button onClick={handleAddEntry} className="w-full">Log Entry</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Total Entries</p>
          <p className="text-2xl font-bold text-foreground">{entries.length}</p>
        </div>
        <div className="bg-secondary/10 rounded-xl border border-secondary/20 p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Total Clothes</p>
          <p className="text-2xl font-bold text-secondary">{totalClothes.toLocaleString()}</p>
        </div>
        <div className="bg-primary/10 rounded-xl border border-primary/20 p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Total Cost</p>
          <p className="text-2xl font-bold text-primary">Rs.{totalCost.toLocaleString()}</p>
        </div>
      </div>

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries">Daily Entries</TabsTrigger>
          <TabsTrigger value="student-summary">By Student</TabsTrigger>
          <TabsTrigger value="dhobi-summary">By Dhobi</TabsTrigger>
        </TabsList>

        <TabsContent value="entries">
          <DataTable data={entries} columns={entryColumns} searchKey="studentName" />
        </TabsContent>

        <TabsContent value="student-summary">
          <DataTable data={studentSummary} columns={studentSummaryColumns} searchKey="name" />
        </TabsContent>

        <TabsContent value="dhobi-summary">
          <DataTable data={dhobiSummary} columns={dhobiSummaryColumns} searchKey="name" />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
