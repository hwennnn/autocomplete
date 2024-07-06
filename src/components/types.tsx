/* eslint-disable @typescript-eslint/no-explicit-any */

// Define a generic constraint for OptionType, which can be either a string or an object with a `label` property
export type OptionType = string | { label: string; [key: string]: any };
