import { db } from "../config/db";
import { food, activity, nutritionalAndWaterNeeds } from "../db/schema";
import * as fs from 'fs';
import * as path from 'path';

async function seedNutritionalNeeds() {
  console.log("🌱 Seeding nutritional needs...");

  const nutritionalData = [
    {
      trimesterNumber: 1,
      waterNeedsMl: 1600,
      proteinNeeds: 61,
      folicAcidNeeds: 400,
      ironNeeds: 9,
      calciumNeeds: 1000,
      vitaminDNeeds: 600,
      omega3Needs: 650,
      fiberNeeds: 35,
      iodineNeeds: 220,
      fatNeeds: 67.3,
      vitaminBNeeds: 0,
    },
    {
      trimesterNumber: 2,
      waterNeedsMl: 1600,
      proteinNeeds: 70,
      folicAcidNeeds: 400,
      ironNeeds: 18,
      calciumNeeds: 1000,
      vitaminDNeeds: 600,
      omega3Needs: 650,
      fiberNeeds: 36,
      iodineNeeds: 220,
      fatNeeds: 67.3,
      vitaminBNeeds: 0,
    },
    {
      trimesterNumber: 3,
      waterNeedsMl: 1600,
      proteinNeeds: 90,
      folicAcidNeeds: 400,
      ironNeeds: 18,
      calciumNeeds: 1000,
      vitaminDNeeds: 600,
      omega3Needs: 650,
      fiberNeeds: 36,
      iodineNeeds: 220,
      fatNeeds: 67.3,
      vitaminBNeeds: 0,
    },
  ];
  await db.insert(nutritionalAndWaterNeeds).values(nutritionalData);
  console.log("✅ Nutritional needs seeded successfully");
}

async function seedFoodData() {
  console.log("🌱 Seeding food data...");

  try {
    // Read food data from JSON file (file sejajar dengan seedData.ts)
    const foodJsonPath = path.join(__dirname, 'food.json');
    // Alternatif path jika __dirname tidak bekerja:
    // const foodJsonPath = './food.json';
    const foodJsonData = fs.readFileSync(foodJsonPath, 'utf8');
    const foodArray = JSON.parse(foodJsonData);

    // Transform the data to match the database schema
    const foodData = foodArray.map((item: any) => ({
      foodName: item.food_name,
      description: item.description,
      priceCategory: item.price_category.charAt(0).toUpperCase() + item.price_category.slice(1) as "Rendah" | "Menengah" | "Tinggi",
      tips: item.tips,
      protein: item.protein,
      folicAcid: item.folic_acid,
      iron: item.iron,
      calcium: item.calcium,
      vitaminD: item.vitamin_d,
      omega3: item.omega_3,
      fiber: item.fiber,
      iodine: item.iodine,
      fat: item.fat,
      vitaminB: item.vitamin_b,
    }));

    await db.insert(food).values(foodData);
    console.log(`✅ Food data seeded successfully - ${foodData.length} items inserted`);
  } catch (error) {
    console.error("❌ Error reading or parsing food.json:", error);
    throw error;
  }
}
async function seedActivityData() {
  console.log("🌱 Seeding activity data...");

  const activityData = [
    // Light Activities
    {
      activityName: "Jalan Santai",
      description: "Berjalan kaki dengan kecepatan santai di area yang aman",
      estimatedDuration: 30,
      caloriesPerHour: 200,
      level: "Ringan" as const,
      videoUrl: "https://example.com/jalan-santai",
      thumbnailUrl: "https://example.com/thumb-jalan-santai.jpg",
      tips: "Pilih sepatu yang nyaman. Berjalan di permukaan yang rata. Bawa air minum.",
    },
    {
      activityName: "Peregangan Ringan",
      description: "Gerakan peregangan lembut untuk mengurangi ketegangan otot",
      estimatedDuration: 15,
      caloriesPerHour: 100,
      level: "Ringan" as const,
      videoUrl: "https://example.com/peregangan",
      thumbnailUrl: "https://example.com/thumb-peregangan.jpg",
      tips: "Jangan memaksakan gerakan. Tahan peregangan selama 15-30 detik.",
    },
    {
      activityName: "Yoga Prenatal",
      description:
        "Gerakan yoga yang aman dan dirancang khusus untuk ibu hamil",
      estimatedDuration: 45,
      caloriesPerHour: 150,
      level: "Ringan" as const,
      videoUrl: "https://example.com/yoga-prenatal",
      thumbnailUrl: "https://example.com/thumb-yoga.jpg",
      tips: "Ikuti instruktur berpengalaman. Hindari pose telentang setelah trimester pertama.",
    },
    {
      activityName: "Berenang Santai",
      description: "Berenang dengan gerakan lembut di kolam renang",
      estimatedDuration: 30,
      caloriesPerHour: 250,
      level: "Ringan" as const,
      videoUrl: "https://example.com/berenang-santai",
      thumbnailUrl: "https://example.com/thumb-berenang.jpg",
      tips: "Pastikan kolam bersih. Hindari air yang terlalu panas. Berenang dengan gaya yang nyaman.",
    },
    {
      activityName: "Senam Kegel",
      description: "Latihan otot panggul untuk persiapan persalinan",
      estimatedDuration: 10,
      caloriesPerHour: 50,
      level: "Ringan" as const,
      videoUrl: "https://example.com/senam-kegel",
      thumbnailUrl: "https://example.com/thumb-kegel.jpg",
      tips: "Kontraksikan otot panggul selama 3-5 detik. Lakukan 10-15 repetisi.",
    },

    // Moderate Activities
    {
      activityName: "Jalan Cepat",
      description: "Berjalan dengan kecepatan sedang untuk kardio ringan",
      estimatedDuration: 30,
      caloriesPerHour: 300,
      level: "Sedang" as const,
      videoUrl: "https://example.com/jalan-cepat",
      thumbnailUrl: "https://example.com/thumb-jalan-cepat.jpg",
      tips: "Jaga detak jantung tidak terlalu tinggi. Berhenti jika merasa lelah.",
    },
    {
      activityName: "Senam Hamil",
      description: "Senam aerobik low impact yang aman untuk ibu hamil",
      estimatedDuration: 45,
      caloriesPerHour: 220,
      level: "Sedang" as const,
      videoUrl: "https://example.com/senam-hamil",
      thumbnailUrl: "https://example.com/thumb-senam-hamil.jpg",
      tips: "Ikuti instruktur bersertifikat. Minum air yang cukup. Hindari gerakan melompat.",
    },
    {
      activityName: "Bersepeda Statis",
      description:
        "Bersepeda menggunakan sepeda statis dengan intensitas sedang",
      estimatedDuration: 30,
      caloriesPerHour: 350,
      level: "Sedang" as const,
      videoUrl: "https://example.com/sepeda-statis",
      thumbnailUrl: "https://example.com/thumb-sepeda.jpg",
      tips: "Atur posisi sepeda yang nyaman. Mulai dengan intensitas rendah.",
    },
    {
      activityName: "Pilates Prenatal",
      description: "Latihan pilates yang dimodifikasi untuk ibu hamil",
      estimatedDuration: 45,
      caloriesPerHour: 200,
      level: "Sedang" as const,
      videoUrl: "https://example.com/pilates-prenatal",
      thumbnailUrl: "https://example.com/thumb-pilates.jpg",
      tips: "Fokus pada penguatan core yang aman. Hindari pose telentang lama.",
    },

    // Heavy Activities (untuk ibu hamil yang sudah terbiasa olahraga)
    {
      activityName: "Jogging Ringan",
      description: "Lari santai untuk ibu hamil yang sudah terbiasa berlari",
      estimatedDuration: 20,
      caloriesPerHour: 400,
      level: "Berat" as const,
      videoUrl: "https://example.com/jogging-ringan",
      thumbnailUrl: "https://example.com/thumb-jogging.jpg",
      tips: "Hanya untuk yang sudah terbiasa berlari sebelum hamil. Kurangi intensitas dari biasanya.",
    },
    {
      activityName: "Latihan Beban Ringan",
      description: "Angkat beban ringan dengan fokus pada bentuk yang benar",
      estimatedDuration: 30,
      caloriesPerHour: 300,
      level: "Berat" as const,
      videoUrl: "https://example.com/beban-ringan",
      thumbnailUrl: "https://example.com/thumb-beban.jpg",
      tips: "Gunakan beban yang lebih ringan dari biasanya. Hindari gerakan yang berbaring telentang.",
    },
  ];

  await db.insert(activity).values(activityData);
  console.log("✅ Activity data seeded successfully");
}

async function main() {
  try {
    console.log("🌱 Starting database seeding...");

    await seedNutritionalNeeds();
    await seedFoodData();
    // await seedActivityData();

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding
if (require.main === module) {
  main();
}
