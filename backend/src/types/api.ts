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

// Nutrition Types
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

// Activity Types
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
  activities: Array<{
    id: number;
    activityName: string;
    durationMinutes: number;
    totalCalories: number;
  }>;
}

// Emergency Types
export interface EmergencyRequest {
  message?: string;
}