import {
  pgTable,
  serial,
  integer,
  varchar,
  boolean,
  text,
  timestamp,
  date,
  time,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const financialStatusEnum = pgEnum('financial_status', ['Rendah', 'Menengah', 'Tinggi']);
export const babyGenderEnum = pgEnum('baby_gender', ['Laki-laki', 'Perempuan', 'Tidak Diketahui']);
export const relationshipTypeEnum = pgEnum('relationship_type', ['Suami', 'Lainnya']);
export const priceCategoryEnum = pgEnum('price_category', ['Rendah', 'Menengah', 'Tinggi']);
export const mealCategoryEnum = pgEnum('meal_category', ['Sarapan', 'Makan Siang', 'Makan Malam', 'Cemilan']);
export const activityLevelEnum = pgEnum('activity_level', ['Ringan', 'Sedang', 'Berat']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  fullName: varchar('full_name', { length: 256 }),
  profileImage: varchar('profile_image', { length: 256 }),
  age: integer('age'),
  isVegetarian: boolean('is_vegetarian'),
  financialStatus: financialStatusEnum('financial_status'),
  allergy: text('allergy'),
  medicalCondition: text('medical_condition'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('update_at', { withTimezone: true }).defaultNow(),
});

export const pregnancies = pgTable('pregnancies', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  pregnancyNumber: integer('pregnancy_number').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  babyGender: babyGenderEnum('baby_gender'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const userConnections = pgTable('user_connections', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  connectionEmail: varchar('connection_email', { length: 256 }).notNull(),
  connectionName: varchar('connection_name', { length: 256 }).notNull(),
  relationshipType: relationshipTypeEnum('relationship_type'),
});

export const food = pgTable('food', {
  id: serial('id').primaryKey(),
  foodName: varchar('food_name', { length: 256 }).notNull(),
  description: text('description'),
  priceCategory: priceCategoryEnum('price_category'),
  tips: text('tips'),
  protein: integer('protein'),
  folicAcid: integer('folic_acid'),
  iron: integer('iron'),
  calcium: integer('calcium'),
  vitaminD: integer('vitamin_d'),
  omega3: integer('omega_3'),
  fiber: integer('fiber'),
  iodine: integer('iodine'),
  fat: integer('fat'),
  vitaminB: integer('vitamin_b'),
});

export const userMeal = pgTable('user_meal', {
    userId: integer('user_id').notNull().references(() => users.id),
    foodId: integer('food_id').notNull().references(() => food.id),
    consumptionDate: date('consumption_date'),
    mealCategory: mealCategoryEnum('meal_category'),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.foodId] })
    };
  }
);


export const activity = pgTable('activity', {
  id: serial('id').primaryKey(),
  activityName: varchar('activity_name', { length: 256 }).notNull(),
  description: text('description'),
  estimatedDuration: integer('estimated_duration'),
  caloriesPerHour: integer('calories_per_hour'),
  level: activityLevelEnum('level'),
  videoUrl: varchar('video_url', { length: 256 }),
  thumbnailUrl: varchar('thumbnail_url', { length: 256 }),
  tips: text('tips'),
});

export const userActivities = pgTable('user_activities', {
    userId: integer('user_id').notNull().references(() => users.id),
    activityId: integer('activity_id').notNull().references(() => activity.id),
    activityDate: date('activity_date'),
    durationMinutes: integer('duration_minutes'),
    totalCalories: integer('total_calories'),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.activityId] })
    };
  }
);


export const reminder = pgTable('reminder', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  reminderDate: date('reminder_date'),
  startTime: time('start_time'),
  endTime: time('end_time'),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  pregnancies: many(pregnancies),
  userConnections: many(userConnections),
  userMeal: many(userMeal),
  userActivities: many(userActivities),
  reminder: many(reminder),
}));

export const pregnanciesRelations = relations(pregnancies, ({ one }) => ({
  user: one(users, {
    fields: [pregnancies.userId],
    references: [users.id],
  }),
}));

export const userConnectionsRelations = relations(userConnections, ({ one }) => ({
  user: one(users, {
    fields: [userConnections.userId],
    references: [users.id],
  }),
}));

export const userMealRelations = relations(userMeal, ({ one }) => ({
  user: one(users, {
    fields: [userMeal.userId],
    references: [users.id],
  }),
  food: one(food, {
    fields: [userMeal.foodId],
    references: [food.id],
  }),
}));

export const userActivitiesRelations = relations(userActivities, ({ one }) => ({
  user: one(users, {
    fields: [userActivities.userId],
    references: [users.id],
  }),
  activity: one(activity, {
    fields: [userActivities.activityId],
    references: [activity.id],
  }),
}));

export const reminderRelations = relations(reminder, ({ one }) => ({
  user: one(users, {
    fields: [reminder.userId],
    references: [users.id],
  }),
}));

// Food doesn't have any 'one' relations from other tables
export const foodRelations = relations(food, ({ many }) => ({
  userMeal: many(userMeal),
}));

// Activity doesn't have any 'one' relations from other tables
export const activityRelations = relations(activity, ({ many }) => ({
  userActivities: many(userActivities),
}));