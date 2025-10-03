import { logger } from "@logoicon/logger";
import { cssParser } from "./cssparser";

export interface ElementNode {
  type: "Element" | "Text" | "Class";
  name?: string;
  attributes?: Record<string, string>;
  children?: ElementNode[];
  value?: string;
}

function convertNode(name: string, node: any): ElementNode {
  // Jika node primitive → Text Node
  if (typeof node !== "object" || node === null) {
    return { type: "Text", value: String(node) };
  }

  const attributes: Record<string, string> = {};
  const children: ElementNode[] = [];

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("@_")) {
      // Attribute
      attributes[key.slice(2)] = String(value);
    } else if (key === "style" && name === "defs") {
      // Parse CSS text
      const cssText = Array.isArray(value)
        ? value.map((v) => (typeof v === "string" ? v : "")).join("\n")
        : typeof value === "string"
          ? value
          : "";

      try {
        const parsedCss = cssParser(cssText);

        // Simpan hasil parse sebagai child node khusus
        children.push({
          type: "Element",
          name: key,
          attributes: {},
          children: Object.entries(parsedCss).map(([className, rules]) => ({
            type: "Class",
            name: className,
            attributes: { ...rules },
            children: [],
          })),
        });
      } catch (error) {
        logger.debug(error, "Failed to parse CSS:");
      }
    } else {
      // Child element
      if (Array.isArray(value)) {
        value.forEach((v) => children.push(convertNode(key, v)));
      } else {
        children.push(convertNode(key, value));
      }
    }
  }

  return { type: "Element", name, attributes, children };
}

export function converter(fxp: any): ElementNode {
  const [name, rawNode] = Object.entries(fxp)[0] as [any, any];
  const convertion = convertNode(name, rawNode as any);
  return convertion;
}
