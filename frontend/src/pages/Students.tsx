import { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, MoreVertical } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/api/axios';
import { toast } from '@/hooks/use-toast';
import { Student } from '@/types';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    studentId: '',
    name: '',
    class: '',
    section: '',
    parentName: '',
    monthlyPocketMoney: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/admin/students');
      if (data.status) {
        const studentsData: Student[] = data.data.map((s: any) => ({
          id: String(s.id),
          studentId: s.studentId || s.student_code,
          name: s.name,
          class: s.class,
          section: s.section || '',
          parentName: s.parentName || s.parent_name,
          monthlyPocketMoney: Number(s.monthlyPocketMoney || s.monthly_pocket_money),
          status: s.status === 1 ? 'active' : 'inactive',
          createdAt: s.created_at,
        }));
        setStudents(studentsData);
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to fetch students', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      studentId: '',
      name: '',
      class: '',
      section: '',
      parentName: '',
      monthlyPocketMoney: '',
      status: 'active',
    });
  };

  const handleAddStudent = async () => {
  if (!formData.studentId || !formData.name || !formData.class) {
    toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
    return;
  }

  try {
    const { data } = await api.post('/admin/students', {
      ...formData,
      monthlyPocketMoney: Number(formData.monthlyPocketMoney) || 0,
    });

    if (data.status) {
      toast({ title: 'Success', description: 'Student added successfully.' });
      setIsAddDialogOpen(false);
      resetForm();
      await fetchStudents(); // 🔹 Re-fetch after add
    } else {
      toast({ title: 'Error', description: data.message || 'Failed to add student', variant: 'destructive' });
    }
  } catch (err) {
    console.error(err);
    toast({ title: 'Error', description: 'Failed to add student.', variant: 'destructive' });
  }
};

const handleEditStudent = async () => {
  if (!selectedStudent) return;

  try {
    const { data } = await api.put(`/admin/students/${selectedStudent.id}`, {
      ...formData,
      monthlyPocketMoney: Number(formData.monthlyPocketMoney) || 0,
    });

    if (data.status) {
      toast({ title: 'Success', description: 'Student updated successfully.' });
      setIsViewDialogOpen(false);
      setIsEditMode(false);
      await fetchStudents(); // 🔹 Re-fetch after edit
    } else {
      toast({ title: 'Error', description: data.message || 'Failed to update student', variant: 'destructive' });
    }
  } catch (err) {
    console.error(err);
    toast({ title: 'Error', description: 'Failed to update student.', variant: 'destructive' });
  }
};


  const openViewDialog = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      id: student.id,
      studentId: student.studentId,
      name: student.name,
      class: student.class,
      section: student.section,
      parentName: student.parentName,
      monthlyPocketMoney: String(student.monthlyPocketMoney),
      status: student.status,
    });
    setIsViewDialogOpen(true);
    setIsEditMode(false);
  };

  const columns = [
    { key: 'studentId', header: 'Student ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'class',
      header: 'Class',
      render: (student: Student) => `${student.class} - ${student.section}`,
    },
    { key: 'parentName', header: 'Parent Name' },
    {
      key: 'monthlyPocketMoney',
      header: 'Monthly Allowance',
      render: (student: Student) => `Rs. ${student.monthlyPocketMoney.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (student: Student) => (
        <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>{student.status}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (student: Student) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openViewDialog(student)}>
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openViewDialog(student);
                setIsEditMode(true);
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader title="Students" description="Manage student records and profiles">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Enter the student details below.</DialogDescription>
            </DialogHeader>
            <StudentForm formData={formData} setFormData={setFormData} onSubmit={handleAddStudent} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <DataTable data={students} columns={columns} searchPlaceholder="Search students..." searchKey="name" />

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Student' : 'Student Profile'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Update the student information below.' : 'View student details and records.'}
            </DialogDescription>
          </DialogHeader>
          {isEditMode ? (
            <StudentForm formData={formData} setFormData={setFormData} onSubmit={handleEditStudent} />
          ) : (
            <div className="space-y-4">
              <ProfileField label="Student ID" value={selectedStudent?.studentId} />
              <ProfileField label="Name" value={selectedStudent?.name} />
              <ProfileField label="Class" value={`${selectedStudent?.class} - ${selectedStudent?.section}`} />
              <ProfileField label="Parent Name" value={selectedStudent?.parentName} />
              <ProfileField label="Monthly Pocket Money" value={`Rs. ${selectedStudent?.monthlyPocketMoney.toLocaleString()}`} />
              <ProfileField
                label="Status"
                value={<Badge variant={selectedStudent?.status === 'active' ? 'default' : 'secondary'}>{selectedStudent?.status}</Badge>}
              />
              <div className="pt-4">
                <Button onClick={() => setIsEditMode(true)} className="w-full">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Student
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

function StudentForm({ formData, setFormData, onSubmit }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID *</Label>
          <Input id="studentId" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} placeholder="STU001" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter name" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="class">Class *</Label>
          <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
            <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
            <SelectContent>{['6','7','8','9','10','11','12'].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="section">Section</Label>
          <Select value={formData.section} onValueChange={(value) => setFormData({ ...formData, section: value })}>
            <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
            <SelectContent>{['A','B','C','D'].map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="parentName">Parent Name</Label>
        <Input id="parentName" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} placeholder="Enter parent name" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyPocketMoney">Monthly Allowance (Rs.)</Label>
          <Input id="monthlyPocketMoney" type="number" value={formData.monthlyPocketMoney} onChange={(e) => setFormData({ ...formData, monthlyPocketMoney: e.target.value })} placeholder="2000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={onSubmit} className="w-full">{formData.id ? 'Save Changes' : 'Add Student'}</Button>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
