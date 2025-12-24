import { useState } from 'react';
import { Plus, Eye, Edit2, MoreVertical, Trash2, Phone, MapPin } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockDhobis } from '@/data/mockData';
import { Dhobi } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function DhobiManagement() {
  const [dhobis, setDhobis] = useState<Dhobi[]>(mockDhobis);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDhobi, setSelectedDhobi] = useState<Dhobi | null>(null);
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

  const handleAddDhobi = () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in name and phone number.',
        variant: 'destructive',
      });
      return;
    }

    const newDhobi: Dhobi = {
      id: String(Date.now()),
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      costPerCloth: Number(formData.costPerCloth) || 15,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setDhobis([...dhobis, newDhobi]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: 'Success',
      description: 'Dhobi added successfully.',
    });
  };

  const handleEditDhobi = () => {
    if (!selectedDhobi) return;

    const updatedDhobis = dhobis.map((d) =>
      d.id === selectedDhobi.id
        ? {
            ...d,
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            costPerCloth: Number(formData.costPerCloth) || d.costPerCloth,
            status: formData.status,
          }
        : d
    );

    setDhobis(updatedDhobis);
    setIsViewDialogOpen(false);
    setIsEditMode(false);
    toast({
      title: 'Success',
      description: 'Dhobi updated successfully.',
    });
  };

  const handleDeleteDhobi = () => {
    if (!selectedDhobi) return;

    setDhobis(dhobis.filter((d) => d.id !== selectedDhobi.id));
    setIsDeleteDialogOpen(false);
    setSelectedDhobi(null);
    toast({
      title: 'Deleted',
      description: 'Dhobi has been removed.',
    });
  };

  const openViewDialog = (dhobi: Dhobi) => {
    setSelectedDhobi(dhobi);
    setFormData({
      name: dhobi.name,
      phone: dhobi.phone,
      address: dhobi.address,
      costPerCloth: String(dhobi.costPerCloth),
      status: dhobi.status,
    });
    setIsViewDialogOpen(true);
    setIsEditMode(false);
  };

  const openDeleteDialog = (dhobi: Dhobi) => {
    setSelectedDhobi(dhobi);
    setIsDeleteDialogOpen(true);
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'costPerCloth',
      header: 'Rate per Cloth',
      render: (dhobi: Dhobi) => `Rs. ${dhobi.costPerCloth}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (dhobi: Dhobi) => (
        <Badge variant={dhobi.status === 'active' ? 'default' : 'secondary'}>
          {dhobi.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (dhobi: Dhobi) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openViewDialog(dhobi)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openViewDialog(dhobi);
                setIsEditMode(true);
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDeleteDialog(dhobi)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
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
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Dhobi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Add New Dhobi</DialogTitle>
              <DialogDescription>
                Enter the dhobi details below.
              </DialogDescription>
            </DialogHeader>
            <DhobiForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddDhobi}
              submitLabel="Add Dhobi"
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Total Dhobis</p>
          <p className="text-2xl font-bold text-foreground">{dhobis.length}</p>
        </div>
        <div className="bg-secondary/10 rounded-xl border border-secondary/20 p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-secondary">
            {dhobis.filter((d) => d.status === 'active').length}
          </p>
        </div>
        <div className="bg-muted rounded-xl border border-border p-4 card-shadow">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="text-2xl font-bold text-muted-foreground">
            {dhobis.filter((d) => d.status === 'inactive').length}
          </p>
        </div>
      </div>

      <DataTable
        data={dhobis}
        columns={columns}
        searchPlaceholder="Search dhobis..."
        searchKey="name"
      />

      {/* View/Edit Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Dhobi' : 'Dhobi Details'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Update the dhobi information below.'
                : 'View dhobi details and records.'}
            </DialogDescription>
          </DialogHeader>
          {isEditMode ? (
            <DhobiForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleEditDhobi}
              submitLabel="Save Changes"
            />
          ) : (
            <div className="space-y-4">
              <ProfileField label="Name" value={selectedDhobi?.name} />
              <ProfileField
                label="Phone"
                value={
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {selectedDhobi?.phone}
                  </span>
                }
              />
              <ProfileField
                label="Address"
                value={
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {selectedDhobi?.address || '-'}
                  </span>
                }
              />
              <ProfileField
                label="Rate per Cloth"
                value={`Rs. ${selectedDhobi?.costPerCloth}`}
              />
              <ProfileField
                label="Status"
                value={
                  <Badge
                    variant={
                      selectedDhobi?.status === 'active' ? 'default' : 'secondary'
                    }
                  >
                    {selectedDhobi?.status}
                  </Badge>
                }
              />
              <ProfileField label="Added On" value={selectedDhobi?.createdAt} />
              <div className="pt-4">
                <Button onClick={() => setIsEditMode(true)} className="w-full">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Dhobi
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dhobi</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedDhobi?.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDhobi}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}

function DhobiForm({
  formData,
  setFormData,
  onSubmit,
  submitLabel,
}: {
  formData: {
    name: string;
    phone: string;
    address: string;
    costPerCloth: string;
    status: 'active' | 'inactive';
  };
  setFormData: (data: typeof formData) => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="03001234567"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Enter address"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="costPerCloth">Rate per Cloth (Rs.)</Label>
          <Input
            id="costPerCloth"
            type="number"
            value={formData.costPerCloth}
            onChange={(e) =>
              setFormData({ ...formData, costPerCloth: e.target.value })
            }
            placeholder="15"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'active' | 'inactive') =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={onSubmit} className="w-full">
        {submitLabel}
      </Button>
    </div>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
