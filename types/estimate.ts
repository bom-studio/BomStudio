export type EstimateStep1Field = "company" | "contact" | "phone" | "email";

export interface EstimateStep1Data {
  company: string;
  contact: string;
  phone: string;
  email: string;
}

export type EstimateStep1Errors = Partial<Record<EstimateStep1Field, string>>;

export type EstimateStep1Touched = Partial<Record<EstimateStep1Field, boolean>>;

export const INITIAL_STEP1_DATA: EstimateStep1Data = {
  company: "",
  contact: "",
  phone: "",
  email: "",
};
