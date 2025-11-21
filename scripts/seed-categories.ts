import "dotenv/config";
import { db } from "../src/db";
import { garbageCategories } from "../src/db/schemas/garbage";
import garbageCategoriesData from "../src/components/garbage-data/garbage_categories.json";

async function seedCategories() {
  try {
    console.log("Starting to seed garbage categories...");

    await db.insert(garbageCategories).values(garbageCategoriesData);

    console.log(
      `✓ Successfully inserted ${garbageCategoriesData.length} categories`
    );
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
