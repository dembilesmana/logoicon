import { LogoiconLogo } from "@logoicon/react";
import { ImageResponse } from "next/og";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <LogoiconLogo />
    </div>,
    { width: 24, height: 24 },
  );
}
