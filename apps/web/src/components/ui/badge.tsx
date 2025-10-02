import { cn } from "@logoicon/util";
import { ComponentProps } from "react";

export function Badge(props: ComponentProps<"span">) {
  const { className, ...z } = props;
  return (
    <span
      className={cn(
        "bg-hero-200 inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
        className
      )}
      {...z}
    />
  );
}
