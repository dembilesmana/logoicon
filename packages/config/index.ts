const configurations = {
  development: {
    url: {
      web: "http://localhost:3000",
      docs: "http://localhost:4321",
      api: "http://localhost:8000/api",
    },
    logLevel: "debug",
  },
  staging: {
    url: {
      web: "",
      docs: "",
      api: "",
    },
    logLevel: "info",
  },
  production: {
    url: {
      web: "https://logoicon.vercel.app",
      docs: "https://dembilesmana.github.io/logoicon",
      api: "https://api.domainanda.com",
    },
    logLevel: "error",
  },
} as const;

export type AppEnvironment = keyof typeof configurations;
export type AppConfig = (typeof configurations)[AppEnvironment];

const environment = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || "development";

export const config: AppConfig =
  configurations[environment as AppEnvironment] || configurations.development;
