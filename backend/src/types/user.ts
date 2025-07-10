export interface UserProfile {
  id: number;
  email: string;
  fullName?: string;
  profileImage?: string;
  age?: number;
  isVegetarian?: boolean;
  financialStatus?: 'Rendah' | 'Menengah' | 'Tinggi';
  allergy?: string;
  medicalCondition?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  profileImage?: string;
  age?: number;
  isVegetarian?: boolean;
  financialStatus?: 'Rendah' | 'Menengah' | 'Tinggi';
  allergy?: string;
  medicalCondition?: string;
}

export interface CreatePregnancyRequest {
  pregnancyNumber: number;
  startDate: string; // YYYY-MM-DD format
  babyGender?: 'Laki-laki' | 'Perempuan' | 'Tidak Diketahui';
}

export interface UpdatePregnancyRequest {
  endDate?: string;
  babyGender?: 'Laki-laki' | 'Perempuan' | 'Tidak Diketahui';
}

export interface PregnancyData {
  id: number;
  userId?: number;
  pregnancyNumber: number;
  startDate: string;
  endDate?: string | null;
  babyGender?: 'Laki-laki' | 'Perempuan' | 'Tidak Diketahui';
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

export interface CreateConnectionRequest {
  connectionEmail: string;
  connectionName: string;
  relationshipType: 'Suami' | 'Lainnya';
}

export interface UserConnection {
  id: number;
  connectionEmail: string;
  connectionName: string;
  relationshipType: 'Suami' | 'Lainnya';
}

export interface CreateReminderRequest {
  title: string;
  description?: string;
  reminderDate: string;
  startTime?: string;
  endTime?: string;
}

export interface UserReminder {
  id: number;
  title: string;
  description?: string;
  reminderDate: string;
  startTime?: string;
  endTime?: string;
}