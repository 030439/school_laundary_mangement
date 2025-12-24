export interface Student {
  id: string;
  studentId: string;
  name: string;
  class: string;
  section: string;
  parentName: string;
  monthlyPocketMoney: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface PocketMoneyTransaction {
  id: string;
  studentId: string;
  studentName: string;
  month: string;
  year: number;
  amountAssigned: number;
  amountGiven: number;
  date: string;
  notes?: string;
}

export interface LaundryEntry {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  numberOfClothes: number;
  dhobiName: string;
  costPerCloth: number;
  totalAmount: number;
}

export interface Dhobi {
  id: string;
  name: string;
  phone: string;
  address: string;
  costPerCloth: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  pocketMoneyGivenThisMonth: number;
  pocketMoneyRemaining: number;
  clothesWashedThisMonth: number;
  monthlyLaundryCost: number;
}
