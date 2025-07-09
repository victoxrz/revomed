export type FormState<TErrors, TInputs> =
  | {
      inputs: TInputs | null;
      errors: TErrors;
      message?: never;
    }
  | {
      inputs: TInputs | null;
      errors?: never;
      message: string;
    };
