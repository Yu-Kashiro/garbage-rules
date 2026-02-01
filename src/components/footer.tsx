import { CITY_OFFICE_NAME } from "@/lib/city";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="sticky top-full border-t border-border bg-background py-4">
      <div className="container mx-auto flex flex-col items-center gap-2">
        <Link
          href="/credit"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          クレジット
        </Link>
        <p className="text-center text-sm text-muted-foreground">
          © 2025 {CITY_OFFICE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
