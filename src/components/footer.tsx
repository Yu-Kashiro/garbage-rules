import { CITY_OFFICE_NAME } from "@/lib/city";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="sticky top-full border-t border-border bg-background py-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <p className="text-center text-sm text-muted-foreground">
          © 2026 {CITY_OFFICE_NAME}. All rights reserved.
        </p>
        <Link
          href="/credit"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          クレジット
        </Link>
      </div>
    </footer>
  );
};
