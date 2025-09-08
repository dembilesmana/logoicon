export function cssParser(
  cssText: string,
): Record<string, Record<string, string>> {
  const styles: Record<string, Record<string, string>> = {};

  const rules = cssText.match(/[^{}]+{[^}]+}/g) || [];
  for (const rule of rules) {
    const [selector, body] = rule.split("{") as [string, string];
    const className = selector.trim().replace(/^\./, ""); // hapus titik
    const declarations = body
      .replace("}", "")
      .trim()
      .split(";")
      .filter(Boolean);

    styles[className] = {};
    for (const decl of declarations) {
      const [prop, value] = decl.split(":").map((s) => s.trim());
      if (prop && value) styles[className][prop] = value;
    }
  }

  return styles;
}
