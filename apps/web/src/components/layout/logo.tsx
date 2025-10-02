import { cn } from "@logoicon/util";
import { ComponentProps } from "react";

export function Logo(props: ComponentProps<"svg">) {
  const { className } = props;
  return (
    <svg
      className={cn(
        className,
        "fill-green-800 drop-shadow transition-colors duration-300"
      )}
      viewBox="0 0 24 12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m1.0908 0v4.3633h4.3639v1.0914h1.0908v-5.4547zm10.909 0v5.4547h1.0908v-5.4547zm6.5456 0v1.0908h-4.3633v1.0908h4.3633v3.2731h1.0908v-5.4547zm-10.909 1.0908v3.2725h3.2725v-3.2725zm13.091 0v3.2725h3.2731v-3.2725zm-6.545 2.1817v1.0908h3.2725v-1.0908zm-8.7272 3.2731v1.0908h-2.1822v3.2725h2.1822v1.0908h1.0908v-5.4542zm6.545 0v1.0908h-4.3633v3.2725h4.3633v1.0908h1.0908v-5.4542zm6.5456 0v5.4542h1.0908v-5.4542zm-18.545 1.0908v3.2725h2.1817v-3.2725zm14.182 0v3.2725h3.2725v-3.2725zm6.545 0v4.3633h3.2731v-4.3633z" />
    </svg>
  );
}
