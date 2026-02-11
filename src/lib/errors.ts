export function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "errors" in error) {
    const zodError = error as { errors?: Array<{ message?: string }> };
    if (zodError.errors?.length) {
      return zodError.errors[0]?.message || "Invalid input.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Something went wrong.";
}
