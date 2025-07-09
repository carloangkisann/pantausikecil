import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { users } from '../db/schema';
import { generateToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { AuthUser, LoginRequest, RegisterRequest } from '../types/auth';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static async register(userData: RegisterRequest) {
    const { email, password } = userData;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new AppError('User with this email already exists', 409);
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        email: users.email,
      });

    if (newUser.length === 0) {
      throw new AppError('Failed to create user', 500);
    }

    const user = newUser[0];

    const token = generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
      } as AuthUser,
      token,
    };
  }

  static async login(loginData: LoginRequest) {
    const { email, password } = loginData;

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userResult.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = userResult[0];

    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      } as AuthUser,
      token,
    };
  }

  static async getUserById(userId: number): Promise<AuthUser | null> {
    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return null;
    }

    return userResult[0] as AuthUser;
  }

  static async verifyUser(userId: number): Promise<AuthUser> {
    const user = await this.getUserById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}