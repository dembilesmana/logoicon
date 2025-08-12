export function normalize(text: string): string {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // Pisahkan huruf besar yang berada di tengah kata (camel/Pascal → spasi)
    .replace(/[\s-_]+/g, " ") // Ganti pemisah non-huruf/angka (kebab, snake) jadi spasi
    .trim()
    .toLowerCase();
}

export function capitalize(text: string): string {
  text = normalize(text);
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function camelCase(text: string): string {
  text = normalize(text);
  return text
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (_, c) => c.toLowerCase());
}

export function pascalCase(text: string): string {
  text = normalize(text);
  return text
    .toLowerCase()
    .replace(/(?:^|[\s-_])(\w)/g, (_, c) => c.toUpperCase());
}

// type CaseType = "pascal" | "camel" | "kebab" | "snake";
//
// export function convertCase(text: string, type: CaseType): string {
//   const words = normalize(text).split(" ");
//   switch (type) {
//     case "pascal":
//       return words.map((w) => w[0].toUpperCase() + w.slice(1)).join("");
//     case "camel":
//       return words
//         .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
//         .join("");
//     case "kebab":
//       return words.join("-");
//     case "snake":
//       return words.join("_");
//   }
// }
