export const defaultStatuses = {
  inactive: 0,
  active: 1,
} as const;

type ObjectValues<T> = T[keyof T];

export type DefaultStatus = ObjectValues<typeof defaultStatuses>;

export const serializeStatus = (status: DefaultStatus) => {
  switch (status) {
    case 0:
      return "inactive";
    case 1:
      return "active";

    default:
      throw new Error("Invalid to serialize the status");
  }
};

export const kebabCase = (s: string) =>
  s
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
