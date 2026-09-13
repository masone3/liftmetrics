export function parseError(err, fallback = "Something went wrong") {
  const errorData = err?.body?.error;

  if (Array.isArray(errorData)) {
    return errorData.map((issue) => issue.message).join(", ");
  }

  if (typeof errorData === "string") {
    return errorData;
  }

  return err?.message || fallback;
}