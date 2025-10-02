import { cn } from "@logoicon/util";
import { HTMLProps } from "react";

export function Card({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-hero-100 dark:bg-hero-700 flex flex-col gap-6 rounded-xl border shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return (
    <div className={cn("leading-none font-semibold", className)} {...props} />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export function CardAction({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}
