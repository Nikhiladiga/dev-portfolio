import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import type { APIRoute } from "astro";
import { createElement } from "react";
import satori from "satori";
import sharp from "sharp";

const require = createRequire(import.meta.url);

export const GET = (async () => {
  const fontPath = require.resolve(
    "@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff",
  );
  const font = await readFile(fontPath);
  const fontData = font.buffer.slice(
    font.byteOffset,
    font.byteOffset + font.byteLength,
  ) as ArrayBuffer;

  const element = createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f2fafc",
        color: "#000000",
        padding: "64px",
        border: "14px solid #000000",
        fontFamily: "Archivo Black",
      },
    },
    createElement(
      "div",
      {
        style: {
          display: "flex",
          alignSelf: "flex-start",
          background: "#04d9ff",
          border: "6px solid #000000",
          padding: "18px 28px",
          fontSize: "30px",
        },
      },
      "SOFTWARE ENGINEER",
    ),
    createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        },
      },
      createElement(
        "div",
        { style: { display: "flex", fontSize: "96px", lineHeight: 1 } },
        "NIKHIL ADIGA",
      ),
      createElement(
        "div",
        {
          style: {
            display: "flex",
            fontSize: "28px",
            fontFamily: "Archivo Black",
          },
        },
        "AI PRODUCTS · DEVELOPER TOOLS · SEARCH SYSTEMS",
      ),
    ),
  );

  const svg = await satori(
    element,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Archivo Black", data: fontData, weight: 400 }],
    },
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}) satisfies APIRoute;
