export type ActionState<T = unknown, TError = string> =
  | { status: "idle" }
  | { status: "success"; data: T }
  | { status: "error"; error: TError };

export const initialActionState: ActionState<void, never> = {
  status: "idle",
};

export const ok = <T>(data: T = {} as T): ActionState<T, never> => ({
  status: "success",
  data,
});

export const fail = <TError>(error: TError): ActionState<never, TError> => ({
  status: "error",
  error,
});
