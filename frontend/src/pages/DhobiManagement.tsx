import { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, MoreVertical, Trash2, Phone, MapPin } from 'lucide-react';
import api from '@/api/axios'; // your axios instance
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export default function DhobiManagement() {
  const [dhobis, setDhobis] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDhobi, setSelectedDhobi] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    costPerCloth: '',
    status: 'active' as 'active' | 'inactive',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      costPerCloth: '',
      status: 'active',
    });
  };

  /** ---------------- API CALLS ---------------- */

  const fetchDhobis = async () => {
    try {
      const res = await api.get('/admin/laundry-staff'); // GET all dhobis
      setDhobis(res.data.data);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to fetch dhobis', variant: 'destructive' });
    }
  };

  const handleAddDhobi = async () => {
    if (!formData.name || !formData.phone) {
      toast({ title: 'Validation Error', description: 'Please fill in name and phone number.', variant: 'destructive' });
      return;
    }
    try {
      await api.post('/admin/laundry-staff', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        per_cloth_rate: Number(formData.costPerCloth) || 15,
        status: formData.status,
      });
      toast({ title: 'Success', description: 'Dhobi added successfully.' });
      setIsAddDialogOpen(false);
      resetForm();
      fetchDhobis();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to add dhobi.', variant: 'destructive' });
    }
  };

  const handleEditDhobi = async () => {
    if (!selectedDhobi) return;
    try {
      await api.put(`/admin/laundry-staff/${selectedDhobi.id}`, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        per_cloth_rate: Number(formData.costPerCloth),
        status: formData.status,
      });
      toast({ title: 'Success', description: 'Dhobi updated successfully.' });
      setIsViewDialogOpen(false);
      setIsEditMode(false);
      fetchDhobis();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to update dhobi.', variant: 'destructive' });
    }
  };

  const handleDeleteDhobi = async () => {
    if (!selectedDhobi) return;
    try {
      await api.delete(`/admin/laundry-staff/${selectedDhobi.id}`);
      toast({ title: 'Deleted', description: 'Dhobi has been removed.' });
      setIsDeleteDialogOpen(false);
      setSelectedDhobi(null);
      fetchDhobis();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to delete dhobi.', variant: 'destructive' });
    }
  };

  /** ---------------- DIALOGS ---------------- */

  const openViewDialog = (dhobi: any) => {
    setSelectedDhobi(dhobi);
    setFormData({
      name: dhobi.name,
      phone: dhobi.phone,
      address: dhobi.address,
      costPerCloth: String(dhobi.per_cloth_rate),
      status: dhobi.status,
    });
    setIsViewDialogOpen(true);
    setIsEditMode(false);
  };

  const openDeleteDialog = (dhobi: any) => {
    setSelectedDhobi(dhobi);
    setIsDeleteDialogOpen(true);
  };

  useEffect(() => {
    fetchDhobis();
  }, []);

  /** ---------------- TABLE COLUMNS ---------------- */
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'per_cloth_rate', header: 'Rate per Cloth', render: (d: any) => `Rs. ${d.per_cloth_rate}` },
    { key: 'status', header: 'Status', render: (d: any) => <Badge variant={d.status === 'active' ? 'default' : 'secondary'}>{d.status}</Badge> },
    {
      key: 'actions', header: 'Actions', render: (d: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openViewDialog(d)}>
              <Eye className="w-4 h-4 mr-2" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { openViewDialog(d); setIsEditMode(true); }}>
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDeleteDialog(d)} className="text-destructive focus:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader title="Dhobi Management" description="Manage laundry staff records">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}><Plus className="w-4 h-4 mr-2" />Add Dhobi</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Add New Dhobi</DialogTitle>
              <DialogDescription>Enter the dhobi details below.</DialogDescription>
            </DialogHeader>
            <DhobiForm formData={formData} setFormData={setFormData} onSubmit={handleAddDhobi} submitLabel="Add Dhobi" />
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Total Dhobis</p>
          <p className="text-2xl font-bold text-foreground">{dhobis.length}</p>
        </div>
        <div className="bg-secondary/10 rounded-xl border border-secondary/20 p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-secondary">{dhobis.filter(d => d.status === 'active').length}</p>
        </div>
        <div className="bg-muted rounded-xl border border-border p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="text-2xl font-bold text-muted-foreground">{dhobis.filter(d => d.status === 'inactive').length}</p>
        </div>
      </div>

      <DataTable data={dhobis} columns={columns} searchPlaceholder="Search dhobis..." searchKey="name" />

      {/* View/Edit Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Dhobi' : 'Dhobi Details'}</DialogTitle>
            <DialogDescription>{isEditMode ? 'Update the dhobi information below.' : 'View dhobi details and records.'}</DialogDescription>
          </DialogHeader>
          {isEditMode
            ? <DhobiForm formData={formData} setFormData={setFormData} onSubmit={handleEditDhobi} submitLabel="Save Changes" />
            : <DhobiView dhobi={selectedDhobi} setIsEditMode={setIsEditMode} />
          }
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dhobi</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{selectedDhobi?.name}"? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDhobi} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}

function DhobiForm({ formData, setFormData, onSubmit, submitLabel }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-2"><Label htmlFor="name">Full Name *</Label><Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter name" /></div>
      <div className="space-y-2"><Label htmlFor="phone">Phone Number *</Label><Input id="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="03001234567" /></div>
      <div className="space-y-2"><Label htmlFor="address">Address</Label><Input id="address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Enter address" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label htmlFor="costPerCloth">Rate per Cloth (Rs.)</Label><Input id="costPerCloth" type="number" value={formData.costPerCloth} onChange={e => setFormData({ ...formData, costPerCloth: e.target.value })} placeholder="15" /></div>
        <div className="space-y-2"><Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(v: 'active' | 'inactive') => setFormData({ ...formData, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={onSubmit} className="w-full">{submitLabel}</Button>
    </div>
  );
}

function DhobiView({ dhobi, setIsEditMode }: any) {
  return (
    <div className="space-y-4">
      <ProfileField label="Name" value={dhobi?.name} />
      <ProfileField label="Phone" value={<span className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" />{dhobi?.phone}</span>} />
      <ProfileField label="Address" value={<span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" />{dhobi?.address || '-'}</span>} />
      <ProfileField label="Rate per Cloth" value={`Rs. ${dhobi?.per_cloth_rate}`} />
      <ProfileField label="Status" value={<Badge variant={dhobi?.status === 'active' ? 'default' : 'secondary'}>{dhobi?.status}</Badge>} />
      <ProfileField label="Added On" value={dhobi?.created_at || dhobi?.createdAt} />
      <div className="pt-4"><Button onClick={() => setIsEditMode(true)} className="w-full"><Edit2 className="w-4 h-4 mr-2" />Edit Dhobi</Button></div>
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
