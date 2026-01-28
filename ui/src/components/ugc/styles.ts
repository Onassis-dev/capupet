import { StylesTypes } from "./types";
const defineStyles = (styles: Record<StylesTypes, string>, style: string) => {
  return styles[style as StylesTypes];
};

export function titleStyle(style: string) {
  return defineStyles(
    {
      modern: "text-5xl  font-medium mb-4",
      minimalist: "text-5xl font-medium mb-4",
      friendly: "text-5xl font-bold mb-4",
    },
    style
  );
}

export function containerStyle(style: string) {
  return defineStyles(
    {
      modern: "w-full max-w-5xl mx-auto px-4 pt-16 pb-24",
      minimalist: "w-full max-w-3xl mx-auto px-4 pt-16 pb-24",
      friendly: "w-full max-w-5xl mx-auto px-4 pt-16 pb-24",
    },
    style
  );
}

export function listStyle(style: string) {
  return defineStyles(
    {
      modern: "grid grid-cols-1 @xsm:grid-cols-2 @xmd:grid-cols-3 gap-6",
      minimalist: "grid grid-cols-1 @xsm:grid-cols-2 gap-8",
      friendly: "grid grid-cols-1 @xsm:grid-cols-2 @xmd:grid-cols-3 gap-6",
    },
    style
  );
}

export function cardStyle(style: string) {
  return defineStyles(
    {
      modern: "bg-neutral-100 p-4 rounded-2xl",
      minimalist: "",
      friendly: "rounded-2xl border overflow-hidden",
    },
    style
  );
}

export function listedInformationStyle(style: string) {
  return defineStyles(
    {
      modern: "p-4 border rounded-2xl flex items-center gap-3 font-semibold",
      minimalist:
        "p-4 border rounded-2xl flex items-center gap-3 font-semibold",
      friendly:
        "p-4 bg-neutral-100 rounded-2xl flex items-center gap-3 font-semibold",
    },
    style
  );
}

export function cardImageStyle(style: string) {
  return defineStyles(
    {
      modern: "rounded-lg",
      minimalist: "rounded-xl",
      friendly: "",
    },
    style
  );
}

export function cardContentStyle(style: string) {
  return defineStyles(
    {
      modern: "pt-2 px-1 pb-1",
      minimalist: "pt-2 px-0.5",
      friendly: "p-4 pb-5",
    },
    style
  );
}

export function buttonStyle(style: string) {
  return defineStyles(
    {
      modern: "border px-3 py-1 rounded-lg font-normal cursor-pointer",
      minimalist:
        "border px-3 py-1 rounded-lg font-normal text-sm cursor-pointer",
      friendly:
        "bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg font-medium cursor-pointer",
    },
    style
  );
}

export function buttonColor(color: string) {
  return {
    black: "bg-neutral-700! text-white!",
    red: "bg-red-500! text-white!",
    green: "bg-emerald-500! text-white!",
    blue: "bg-blue-500! text-white!",
    yellow: "bg-yellow-500! text-white!",
    purple: "bg-purple-500! text-white!",
    orange: "bg-orange-500! text-white!",
    pink: "bg-pink-500! text-white!",
  }[color];
}

export function iconColor(color: string) {
  return {
    black: "text-neutral-700! size-5",
    red: "text-red-500! size-5",
    green: "text-emerald-500! size-5",
    blue: "text-blue-500! size-5",
    yellow: "text-yellow-500! size-5",
    purple: "text-purple-500! size-5",
    orange: "text-orange-500! size-5",
    pink: "text-pink-500! size-5",
  }[color];
}
