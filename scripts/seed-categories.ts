import "dotenv/config";
import { db } from "../src/db";
import { garbageCategories } from "../src/db/schemas/garbage";
import garbageCategoriesData from "../src/components/garbage-data/garbage_categories.json";

async function seedCategories() {
  try {
    console.log("Starting to seed garbage categories...");

    for (const category of garbageCategoriesData) {
      await db
        .insert(garbageCategories)
        .values(category)
        .onConflictDoUpdate({
          target: garbageCategories.id,
          set: {
            name: category.name,
            color: category.color,
            updatedAt: new Date(),
          },
        });
    }

    console.log(
      `✓ Successfully seeded ${garbageCategoriesData.length} categories`
    );
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
