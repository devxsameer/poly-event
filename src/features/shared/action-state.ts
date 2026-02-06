export type ActionState<T = void, TError = string> =
  | { status: "idle" }
  | { status: "success"; data?: T }
  | { status: "error"; error: TError };

export const initialActionState: ActionState<void, never> = { status: "idle" };

export const ok = <T>(data?: T): ActionState<T, never> => ({
  status: "success",
  data,
});

export const fail = <TError>(error: TError): ActionState<void, TError> => ({
  status: "error",
  error,
});
