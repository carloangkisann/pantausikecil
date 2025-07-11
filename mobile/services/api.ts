import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  UserProfile,
  AuthResponse,
  ApiResponse,
  UpdateProfileRequest,
  LoginRequest,
  RegisterRequest,
  CreatePregnancyRequest,
  UpdatePregnancyRequest,
  PregnancyData,
  CreateConnectionRequest,
  UserConnection,
  CreateReminderRequest,
  UserReminder,
  NutritionalNeeds,
  DailyNutritionSummary,
  FoodItem,
  AddMealRequest,
  AddWaterRequest,
  ActivityItem,
  AddUserActivityRequest,
  UserActivitySummary,
  EmergencyRequest,
} from "../types";

// Base configuration - menggunakan localhost karena Anda menjalankan dari localhost
const API_BASE_URL = "http://localhost:5001/api";

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // ===== TOKEN MANAGEMENT =====
  private async getToken(): Promise<string | null> {
    try {
      // return await AsyncStorage.getItem("auth_token");
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYXBpLXRlc0BnbWFpbC5jb20iLCJpYXQiOjE3NTIxNTI1ODYsImV4cCI6MTc1MjIzODk4Nn0.26JGPi5jweq_T60owXRLVh4QTd_lbIZOr0Lfyf_kk_g";
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  private async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem("auth_token", token);
    } catch (error) {
      console.error("Error setting token:", error);
    }
  }

  private async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem("auth_token");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  }

  // Generic request method with token
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getToken();

      const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        return data; // Return error response
      }

      return data;
    } catch (error) {
      console.error("Network error:", error);
      return {
        success: false,
        message: "Network error - pastikan backend berjalan",
      };
    }
  }

  // ===== AUTH METHODS =====
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log("Making login request to:", `${this.baseURL}/auth/login`);
      console.log("Login credentials:", {
        email: credentials.email,
        password: "***",
      });

      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Login response data:", data);

      // Simpan token jika login berhasil
      if (data.success && data.data?.token) {
        await this.setToken(data.data.token);
        console.log("Token saved:", data.data.token);
      }

      // Jika login berhasil, dapatkan profile lengkap
      if (data.success && data.data?.user) {
        try {
          const profileResponse = await this.makeRequest<UserProfile>(
            `/users/${data.data.user.id}/profile`
          );

          if (profileResponse.success) {
            // Merge user data dengan profile data
            data.data.user = { ...data.data.user, ...profileResponse.data };
            console.log("Merged user data with profile:", data.data.user);
          }
        } catch (profileError) {
          console.error("Error fetching profile:", profileError);
          // Tetap lanjutkan meskipun gagal fetch profile
        }
      }

      return data;
    } catch (error) {
      console.error("Login API error:", error);
      return {
        success: false,
        message: "Network error - pastikan backend berjalan di port 5001",
      };
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log(
        "Making register request to:",
        `${this.baseURL}/auth/register`
      );
      console.log("Register data:", { email: userData.email, password: "***" });

      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("Register response status:", response.status);

      const data = await response.json();
      console.log("Register response data:", data);

      return data;
    } catch (error) {
      console.error("Register API error:", error);
      return {
        success: false,
        message: "Network error - pastikan backend berjalan di port 5001",
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      await this.removeToken();
    }
  }

  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest("/auth/me");
  }

  // ===== USER PROFILE METHODS =====
  async getUserProfile(userId: number): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest(`/users/${userId}/profile`);
  }

  async updateUserProfile(
    userId: number,
    profileData: UpdateProfileRequest
  ): Promise<ApiResponse<UserProfile>> {
    console.log(
      "Making update profile request to:",
      `${this.baseURL}/users/${userId}/profile`
    );
    console.log("Profile data:", profileData);

    return this.makeRequest(`/users/${userId}/profile`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // ===== PREGNANCY METHODS =====
  async createPregnancy(
    userId: number,
    pregnancyData: CreatePregnancyRequest
  ): Promise<ApiResponse<PregnancyData>> {
    return this.makeRequest(`/users/${userId}/pregnancies`, {
      method: "POST",
      body: JSON.stringify(pregnancyData),
    });
  }

  async getUserPregnancies(
    userId: number
  ): Promise<ApiResponse<PregnancyData[]>> {
    return this.makeRequest(`/users/${userId}/pregnancies`);
  }

  async updatePregnancy(
    userId: number,
    pregnancyId: number,
    pregnancyData: UpdatePregnancyRequest
  ): Promise<ApiResponse<PregnancyData>> {
    return this.makeRequest(`/users/${userId}/pregnancies/${pregnancyId}`, {
      method: "PUT",
      body: JSON.stringify(pregnancyData),
    });
  }

  // ===== CONNECTION METHODS =====
  async getUserConnections(
    userId: number
  ): Promise<ApiResponse<UserConnection[]>> {
    return this.makeRequest(`/users/${userId}/connections`);
  }

  async createConnection(
    userId: number,
    connectionData: CreateConnectionRequest
  ): Promise<ApiResponse<UserConnection>> {
    return this.makeRequest(`/users/${userId}/connections`, {
      method: "POST",
      body: JSON.stringify(connectionData),
    });
  }

  async deleteConnection(
    userId: number,
    connectionId: number
  ): Promise<ApiResponse<void>> {
    return this.makeRequest(`/users/${userId}/connections/${connectionId}`, {
      method: "DELETE",
    });
  }

  // ===== REMINDER METHODS =====
  async createReminder(
    userId: number,
    reminderData: CreateReminderRequest
  ): Promise<ApiResponse<UserReminder>> {
    return this.makeRequest(`/users/${userId}/reminders`, {
      method: "POST",
      body: JSON.stringify(reminderData),
    });
  }

  async getUserReminders(
    userId: number,
    date?: string
  ): Promise<ApiResponse<UserReminder[]>> {
    const url = date
      ? `/users/${userId}/reminders?date=${date}`
      : `/users/${userId}/reminders`;
    return this.makeRequest(url);
  }

  async getUpcomingReminders(
    userId: number
  ): Promise<ApiResponse<UserReminder[]>> {
    return this.makeRequest(`/users/${userId}/reminders/upcoming`);
  }

  async deleteReminder(
    userId: number,
    reminderId: number
  ): Promise<ApiResponse<void>> {
    return this.makeRequest(`/users/${userId}/reminders/${reminderId}`, {
      method: "DELETE",
    });
  }

  // ===== DASHBOARD METHODS =====
  async getDashboardData(userId: number): Promise<ApiResponse<any>> {
    return this.makeRequest(`/users/${userId}/dashboard`);
  }

  async getWeeklySummary(userId: number): Promise<ApiResponse<any>> {
    return this.makeRequest(`/users/${userId}/dashboard/weekly`);
  }

  async getNutritionProgress(userId: number): Promise<ApiResponse<any>> {
    return this.makeRequest(`/users/${userId}/dashboard/nutrition-progress`);
  }

  // ===== NUTRITION METHODS =====
  async getNutritionalNeeds(
    userId: number
  ): Promise<ApiResponse<NutritionalNeeds>> {
    return this.makeRequest(`/users/${userId}/nutrition/needs`);
  }

  async getTodayNutrition(
    userId: number
  ): Promise<ApiResponse<DailyNutritionSummary>> {
    return this.makeRequest(`/users/${userId}/nutrition/today`);
  }

  async getNutritionSummary(
    userId: number,
    date: string
  ): Promise<ApiResponse<DailyNutritionSummary>> {
    return this.makeRequest(`/users/${userId}/nutrition/summary?date=${date}`);
  }

  async getUserMeals(
    userId: number,
    date?: string
  ): Promise<ApiResponse<any[]>> {
    const url = date
      ? `/users/${userId}/nutrition/meals?date=${date}`
      : `/users/${userId}/nutrition/meals`;
    return this.makeRequest(url);
  }

  async addMeal(
    userId: number,
    mealData: AddMealRequest
  ): Promise<ApiResponse<any>> {
    return this.makeRequest(`/users/${userId}/nutrition/meals`, {
      method: "POST",
      body: JSON.stringify(mealData),
    });
  }

  async removeMeal(userId: number, mealId: number): Promise<ApiResponse<void>> {
    return this.makeRequest(`/users/${userId}/nutrition/meals/${mealId}`, {
      method: "DELETE",
    });
  }

  async addWaterIntake(
    userId: number,
    waterData: AddWaterRequest
  ): Promise<ApiResponse<any>> {
    return this.makeRequest(`/users/${userId}/nutrition/water`, {
      method: "POST",
      body: JSON.stringify(waterData),
    });
  }

  async getAllFood(): Promise<ApiResponse<FoodItem[]>> {
    return this.makeRequest("/nutrition/food");
  }

  async getFoodDetails(foodId: number): Promise<ApiResponse<FoodItem>> {
    return this.makeRequest(`/nutrition/food/${foodId}`);
  }

  // ===== ACTIVITY METHODS =====
  async getTodayActivities(
    userId: number
  ): Promise<ApiResponse<UserActivitySummary>> {
    return this.makeRequest(`/users/${userId}/activities/today`);
  }

  async getActivitySummary(
    userId: number,
    date: string
  ): Promise<ApiResponse<UserActivitySummary>> {
    return this.makeRequest(`/users/${userId}/activities/summary?date=${date}`);
  }

  async getRecommendedActivities(
    userId: number
  ): Promise<ApiResponse<ActivityItem[]>> {
    return this.makeRequest(`/users/${userId}/activities/recommended`);
  }

  async getActivityHistory(userId: number): Promise<ApiResponse<any[]>> {
    return this.makeRequest(`/users/${userId}/activities/history`);
  }

  async addActivity(
    userId: number,
    activityData: AddUserActivityRequest
  ): Promise<ApiResponse<any>> {
    return this.makeRequest(`/users/${userId}/activities`, {
      method: "POST",
      body: JSON.stringify(activityData),
    });
  }

  async removeActivity(
    userId: number,
    activityId: number
  ): Promise<ApiResponse<void>> {
    return this.makeRequest(`/users/${userId}/activities/${activityId}`, {
      method: "DELETE",
    });
  }

  async getAllActivities(): Promise<ApiResponse<ActivityItem[]>> {
    return this.makeRequest("/activities");
  }

  async getActivityDetails(
    activityId: number
  ): Promise<ApiResponse<ActivityItem>> {
    return this.makeRequest(`/activities/${activityId}`);
  }

  async calculateCalories(data: {
    weight: number;
    duration: number;
    activityType: string;
  }): Promise<ApiResponse<{ calories: number }>> {
    return this.makeRequest("/activities/calculate-calories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ===== EMERGENCY METHODS =====
  async sendEmergencyNotification(
    userId: number,
    emergencyData: EmergencyRequest
  ): Promise<ApiResponse<any>> {
    return this.makeRequest(`/users/${userId}/emergency`, {
      method: "POST",
      body: JSON.stringify(emergencyData),
    });
  }

  async testEmailConfiguration(): Promise<ApiResponse<any>> {
    return this.makeRequest("/emergency/test-email");
  }

  // ===== UTILITY METHODS =====
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseURL.replace("/api", "")}/api/health`
      );
      const data = await response.json();
      console.log("Health check response:", data);
      return data.success;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  // Utility method untuk check apakah user sudah login
  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  async chatWithBot(
    message: string
  ): Promise<ApiResponse<{ reply: string; user_id?: number }>> {
    return this.makeRequest("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
