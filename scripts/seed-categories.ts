import "dotenv/config";
import { db } from "../src/db";
import { garbageCategories } from "../src/db/schemas/garbages";
import garbageCategoriesData from "../src/components/garbages/garbage_categories.json";

async function seedCategories() {
  try {
    console.log("Starting to seed garbage categories...");

    // Convert JSON data to match the database schema
    const categoriesToInsert = garbageCategoriesData.map((category) => ({
      id: category.id, // Convert numeric id to string
      name: category.name,
    }));

    // Insert categories into the database
    await db.insert(garbageCategories).values(categoriesToInsert);

    console.log(`✓ Successfully inserted ${categoriesToInsert.length} categories`);
    console.log("\nInserted categories:");
    categoriesToInsert.forEach((cat) => {
      console.log(`  - ID: ${cat.id}, Name: ${cat.name}`);
    });
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();