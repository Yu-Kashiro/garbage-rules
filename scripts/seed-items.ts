import "dotenv/config";
import garbageItemsData from "../src/components/garbage-data/garbage_items.json";
import { db } from "../src/db";
import { garbageItems } from "../src/db/schemas/garbage";

async function seedItems() {
  try {
    console.log("Starting to seed garbage items...");

    for (const item of garbageItemsData) {
      await db
        .insert(garbageItems)
        .values(item)
        .onConflictDoUpdate({
          target: garbageItems.id,
          set: {
            name: item.name,
            garbageCategory: item.garbageCategory,
            note: item.note,
            search: item.search,
            updatedAt: new Date(),
          },
        });
    }

    console.log(`Successfully seeded ${garbageItemsData.length} garbage items`);
  } catch (error) {
    console.error("Error seeding items:", error);
    process.exit(1);
  }
}

seedItems();
