// ===== API RESPONSE TYPES =====
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ===== AUTH TYPES =====
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
    token: string;
  };
}

// ===== USER TYPES =====
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
  relationshipType: 'Suami' |'Mertua'|'Saudara Kandung'|'Teman'|'Lainnya';
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

// ===== NUTRITION TYPES =====
export interface NutritionalNeeds {
  trimesterNumber: number;
  waterNeedsMl: number;
  proteinNeeds: number;
  folicAcidNeeds: number;
  ironNeeds: number;
  calciumNeeds: number;
  vitaminDNeeds: number;
  omega3Needs: number;
  fiberNeeds: number;
  iodineNeeds: number;
  fatNeeds: number;
  vitaminBNeeds: number;
}

export interface DailyNutritionSummary {
  date: string;
  totalProtein: number;
  totalFolicAcid: number;
  totalIron: number;
  totalCalcium: number;
  totalVitaminD: number;
  totalOmega3: number;
  totalFiber: number;
  totalIodine: number;
  totalFat: number;
  totalVitaminB: number;
  totalWaterMl: number;
}

export interface FoodItem {
  id: number;
  foodName: string;
  description?: string;
  priceCategory: 'Rendah' | 'Menengah' | 'Tinggi';
  tips?: string;
  protein: number;
  folicAcid: number;
  iron: number;
  calcium: number;
  vitaminD: number;
  omega3: number;
  fiber: number;
  iodine: number;
  fat: number;
  vitaminB: number;
}

export interface AddMealRequest {
  foodId: number;
  consumptionDate: string;
  mealCategory: 'Sarapan' | 'Makan Siang' | 'Makan Malam' | 'Cemilan';
}

export interface AddWaterRequest {
  amountMl: number;
}

// ===== ACTIVITY TYPES =====
export interface ActivityItem {
  id: number;
  activityName: string;
  description?: string;
  estimatedDuration: number;
  caloriesPerHour: number;
  level: 'Ringan' | 'Sedang' | 'Berat';
  videoUrl?: string;
  thumbnailUrl?: string;
  tips?: string;
}

export interface AddUserActivityRequest {
  activityId: number;
  activityDate: string;
  durationMinutes: number;
  totalCalories: number;
}

export interface UserActivitySummary {
  date: string;
  totalDurationMinutes: number;
  totalCalories: number;
  activities: {
    id: number;
    activityName: string;
    durationMinutes: number;
    totalCalories: number;
  }[];
}

// ===== EMERGENCY TYPES =====
export interface EmergencyRequest {
  message?: string;
}

// ===== ALIAS FOR COMPATIBILITY =====
export type User = UserProfile;