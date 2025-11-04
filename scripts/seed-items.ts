import "dotenv/config";
import garbageItemsData from "../src/components/garbage-data/garbage_items.json";
import { db } from "../src/db";
import { garbageItems } from "../src/db/schemas/garbage";

async function seedItems() {
  try {
    console.log("Starting to seed garbage items...");

    await db.insert(garbageItems).values(garbageItemsData);
  } catch (error) {
    console.error("Error seeding items:", error);
    process.exit(1);
  }
}

seedItems();
