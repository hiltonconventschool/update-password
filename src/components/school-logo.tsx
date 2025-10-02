"use client";

import Image from "next/image";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function SchoolLogo({
  className,
  ...props
}: Omit<ComponentProps<typeof Image>, "src" | "alt">) {
  return (
    <Image
      src="/hcsss.png"
      alt="Hilton Convent School Logo"
      width={64}
      height={64}
      className={cn("mx-auto", className)}
      {...props}
    />
  );
}
