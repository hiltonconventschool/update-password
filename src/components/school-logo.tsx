
"use client";

import Image from "next/image";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function SchoolLogo({
  className,
  ...props
}: Omit<ComponentProps<"div">, "children">) {
  return (
    <div
      className={cn(
        "relative mx-auto h-16 w-16",
        className
      )}
      {...props}
    >
      <Image
        src="/hcsss.png"
        alt="HCSSS Logo"
        fill
        className="object-contain"
      />
    </div>
  );
}
