import { CITY_OFFICE_NAME } from "@/lib/city";

export const Footer = () => {
  return (
    <footer className="sticky top-full border-t bg-background py-4">
      <p className="text-center text-sm text-muted-foreground">
        © 2025 {CITY_OFFICE_NAME}. All rights reserved.
      </p>
    </footer>
  );
};
