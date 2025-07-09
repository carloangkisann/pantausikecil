import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../config/db';
import { users, pregnancies, userConnections, reminder } from '../db/schema';
import { AppError } from '../middleware/errorHandler';
import { 
  UserProfile, 
  UpdateProfileRequest, 
  CreatePregnancyRequest, 
  UpdatePregnancyRequest,
  PregnancyData,
  CreateConnectionRequest,
  UserConnection,
  CreateReminderRequest,
  UserReminder
} from '../types/user';

export class UserService {
  static async getUserProfile(userId: number): Promise<UserProfile> {
    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        profileImage: users.profileImage,
        age: users.age,
        isVegetarian: users.isVegetarian,
        financialStatus: users.financialStatus,
        allergy: users.allergy,
        medicalCondition: users.medicalCondition,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      throw new AppError('User not found', 404);
    }

    return userResult[0] as UserProfile;
  }

  static async updateUserProfile(userId: number, updateData: UpdateProfileRequest): Promise<UserProfile> {
    await this.getUserProfile(userId);

    const updatedUser = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        profileImage: users.profileImage,
        age: users.age,
        isVegetarian: users.isVegetarian,
        financialStatus: users.financialStatus,
        allergy: users.allergy,
        medicalCondition: users.medicalCondition,
      });

    if (updatedUser.length === 0) {
      throw new AppError('Failed to update profile', 500);
    }

    return updatedUser[0] as UserProfile;
  }

  static async createPregnancy(userId: number, pregnancyData: CreatePregnancyRequest): Promise<PregnancyData> {
    await this.getUserProfile(userId);

    const existingPregnancy = await db
      .select()
      .from(pregnancies)
      .where(
        and(
          eq(pregnancies.userId, userId),
          eq(pregnancies.pregnancyNumber, pregnancyData.pregnancyNumber)
        )
      )
      .limit(1);

    if (existingPregnancy.length > 0) {
      throw new AppError('Pregnancy with this number already exists', 409);
    }

    const finalBabyGender = pregnancyData.babyGender || 'Tidak Diketahui';
    const newPregnancy = await db
      .insert(pregnancies)
      .values({
        userId,
        pregnancyNumber: pregnancyData.pregnancyNumber,
        startDate: pregnancyData.startDate,
        babyGender: finalBabyGender,
      })
      .returning({
        id: pregnancies.id,
        userId: pregnancies.userId,
        pregnancyNumber: pregnancies.pregnancyNumber,
        startDate: pregnancies.startDate,
        endDate: pregnancies.endDate,
        babyGender: pregnancies.babyGender,
        createdAt: pregnancies.createdAt,
        updatedAt: pregnancies.updatedAt,
      });

    if (newPregnancy.length === 0) {
      throw new AppError('Failed to create pregnancy record', 500);
    }

    return {
      id: newPregnancy[0].id,
      userId: newPregnancy[0].userId || undefined,
      pregnancyNumber: newPregnancy[0].pregnancyNumber,
      startDate: newPregnancy[0].startDate,
      endDate: newPregnancy[0].endDate || undefined,
      babyGender: newPregnancy[0].babyGender || undefined,
      createdAt: newPregnancy[0].createdAt,
      updatedAt: newPregnancy[0].updatedAt,
    } as PregnancyData;
  }

  static async getUserPregnancies(userId: number): Promise<PregnancyData[]> {
    await this.getUserProfile(userId);

    const userPregnancies = await db
      .select({
        id: pregnancies.id,
        userId: pregnancies.userId,
        pregnancyNumber: pregnancies.pregnancyNumber,
        startDate: pregnancies.startDate,
        endDate: pregnancies.endDate,
        babyGender: pregnancies.babyGender,
        createdAt: pregnancies.createdAt,
        updatedAt: pregnancies.updatedAt,
      })
      .from(pregnancies)
      .where(eq(pregnancies.userId, userId));

    return userPregnancies.map(pregnancy => ({
      id: pregnancy.id,
      userId: pregnancy.userId || undefined,
      pregnancyNumber: pregnancy.pregnancyNumber,
      startDate: pregnancy.startDate,
      endDate: pregnancy.endDate || undefined,
      babyGender: pregnancy.babyGender || undefined,
      createdAt: pregnancy.createdAt,
      updatedAt: pregnancy.updatedAt,
    })) as PregnancyData[];
  }

  static async updatePregnancy(
    userId: number, 
    pregnancyId: number, 
    updateData: UpdatePregnancyRequest
  ): Promise<PregnancyData> {
    await this.getUserProfile(userId);

    const existingPregnancy = await db
      .select()
      .from(pregnancies)
      .where(
        and(
          eq(pregnancies.id, pregnancyId),
          eq(pregnancies.userId, userId)
        )
      )
      .limit(1);

    if (existingPregnancy.length === 0) {
      throw new AppError('Pregnancy record not found', 404);
    }

    const updatedPregnancy = await db
      .update(pregnancies)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(pregnancies.id, pregnancyId))
      .returning({
        id: pregnancies.id,
        userId: pregnancies.userId,
        pregnancyNumber: pregnancies.pregnancyNumber,
        startDate: pregnancies.startDate,
        endDate: pregnancies.endDate,
        babyGender: pregnancies.babyGender,
        createdAt: pregnancies.createdAt,
        updatedAt: pregnancies.updatedAt,
      });

    if (updatedPregnancy.length === 0) {
      throw new AppError('Failed to update pregnancy record', 500);
    }

    return {
      id: updatedPregnancy[0].id,
      userId: updatedPregnancy[0].userId || undefined,
      pregnancyNumber: updatedPregnancy[0].pregnancyNumber,
      startDate: updatedPregnancy[0].startDate,
      endDate: updatedPregnancy[0].endDate || undefined,
      babyGender: updatedPregnancy[0].babyGender || undefined,
      createdAt: updatedPregnancy[0].createdAt,
      updatedAt: updatedPregnancy[0].updatedAt,
    } as PregnancyData;
  }

  static async getActivePregnancy(userId: number): Promise<PregnancyData | null> {
    const activePregnancies = await db
      .select({
        id: pregnancies.id,
        userId: pregnancies.userId,
        pregnancyNumber: pregnancies.pregnancyNumber,
        startDate: pregnancies.startDate,
        endDate: pregnancies.endDate,
        babyGender: pregnancies.babyGender,
        createdAt: pregnancies.createdAt,
        updatedAt: pregnancies.updatedAt,
      })
      .from(pregnancies)
      .where(
        and(
          eq(pregnancies.userId, userId),
          // Check for null end date to find active pregnancy
          isNull(pregnancies.endDate)
        )
      )
      .limit(1);

    if (activePregnancies.length === 0) {
      return null;
    }

    return {
      id: activePregnancies[0].id,
      userId: activePregnancies[0].userId || undefined,
      pregnancyNumber: activePregnancies[0].pregnancyNumber,
      startDate: activePregnancies[0].startDate,
      endDate: activePregnancies[0].endDate || undefined,
      babyGender: activePregnancies[0].babyGender || undefined,
      createdAt: activePregnancies[0].createdAt,
      updatedAt: activePregnancies[0].updatedAt,
    } as PregnancyData;
  }

  static async getUserConnections(userId: number): Promise<UserConnection[]> {
    await this.getUserProfile(userId);

    const connections = await db
      .select({
        id: userConnections.id,
        connectionEmail: userConnections.connectionEmail,
        connectionName: userConnections.connectionName,
        relationshipType: userConnections.relationshipType,
      })
      .from(userConnections)
      .where(eq(userConnections.userId, userId));

    return connections as UserConnection[];
  }

  static async createUserConnection(userId: number, connectionData: CreateConnectionRequest): Promise<UserConnection> {
    await this.getUserProfile(userId);

    const existingConnection = await db
      .select()
      .from(userConnections)
      .where(
        and(
          eq(userConnections.userId, userId),
          eq(userConnections.connectionEmail, connectionData.connectionEmail)
        )
      )
      .limit(1);

    if (existingConnection.length > 0) {
      throw new AppError('Connection with this email already exists', 409);
    }

    const newConnection = await db
      .insert(userConnections)
      .values({
        userId,
        connectionEmail: connectionData.connectionEmail,
        connectionName: connectionData.connectionName,
        relationshipType: connectionData.relationshipType,
      })
      .returning({
        id: userConnections.id,
        connectionEmail: userConnections.connectionEmail,
        connectionName: userConnections.connectionName,
        relationshipType: userConnections.relationshipType,
      });

    if (newConnection.length === 0) {
      throw new AppError('Failed to create connection', 500);
    }

    return newConnection[0] as UserConnection;
  }

  static async deleteUserConnection(userId: number, connectionId: number): Promise<void> {
    await this.getUserProfile(userId);

    const existingConnection = await db
      .select()
      .from(userConnections)
      .where(
        and(
          eq(userConnections.id, connectionId),
          eq(userConnections.userId, userId)
        )
      )
      .limit(1);

    if (existingConnection.length === 0) {
      throw new AppError('Connection not found', 404);
    }

    await db
      .delete(userConnections)
      .where(eq(userConnections.id, connectionId));
  }

  static async createReminder(userId: number, reminderData: CreateReminderRequest): Promise<UserReminder> {
    await this.getUserProfile(userId);

    const newReminder = await db
      .insert(reminder)
      .values({
        userId,
        title: reminderData.title,
        description: reminderData.description,
        reminderDate: reminderData.reminderDate,
        startTime: reminderData.startTime,
        endTime: reminderData.endTime,
      })
      .returning({
        id: reminder.id,
        title: reminder.title,
        description: reminder.description,
        reminderDate: reminder.reminderDate,
        startTime: reminder.startTime,
        endTime: reminder.endTime,
      });

    if (newReminder.length === 0) {
      throw new AppError('Failed to create reminder', 500);
    }

    return newReminder[0] as UserReminder;
  }
}