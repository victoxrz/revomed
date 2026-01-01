"use server";
import { cookies } from "next/headers";
import { tryCatch } from "./try-catch";

// TODO: rethink so that it will include also field errors by fluentValidation
type FetchResponse<T> =
  | { data: T | null; message: null }
  | { data: null; message: string };
// | { data: null; message: null };

type FetchOptions = RequestInit & {
  withAuth?: boolean;
};

export async function get<T = null>(
  endpoint: string,
  options?: FetchOptions,
): Promise<FetchResponse<T>> {
  return fetchWrapped<T>(endpoint, { ...options, method: "GET" });
}

export async function post<T = null>(
  endpoint: string,
  body: any,
  options?: FetchOptions,
): Promise<FetchResponse<T>> {
  const headers = new Headers(options?.headers);
  if (!headers.get("Content-Type")) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  return fetchWrapped<T>(endpoint, {
    ...options,
    method: "POST",
    headers: headers,
    body: body,
  });
}

export async function put<T = null>(
  endpoint: string,
  body: any,
  options?: FetchOptions,
): Promise<FetchResponse<T>> {
  const headers = new Headers(options?.headers);
  if (!headers.get("Content-Type")) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  return fetchWrapped<T>(endpoint, {
    ...options,
    method: "PUT",
    headers: headers,
    body: body,
  });
}

export async function remove<T = null>(
  endpoint: string,
  // body: any,
  options?: FetchOptions,
): Promise<FetchResponse<T>> {
  return fetchWrapped(endpoint, { ...options, method: "DELETE" });
}

export async function fetchWrapped<T = null>(
  endpoint: string,
  options?: FetchOptions,
): Promise<FetchResponse<T>> {
  if (options?.withAuth) {
    const headers = new Headers(options.headers);
    const apiKey = (await cookies()).get(process.env.AUTH_TOKEN_NAME!);

    if (!apiKey)
      return { data: null, message: "Authentication token is missing." };

    headers.set("Authorization", apiKey.value);
    options.headers = headers;
  }

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL!}${endpoint}`,
      options,
    );

    if (!response.ok) {
      // TODO: rethink
      const text = await response.text();
      if (text) return JSON.parse(text);

      return {
        data: null,
        message: "Oops. Something went wrong!",
      };
      // return { data: null, message: null };
    }

    if (response.status === (201 | 204)) return { data: null, message: null };

    const { data } = await tryCatch<T>(response.json());

    return { data: data, message: null };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      data: null,
      message: "Oops. Something went wrong!",
    };
  }
}
