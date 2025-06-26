"use server";
import { cookies } from "next/headers";

type FetchResponse<T> =
  | { data: T | void; message: undefined }
  | { data: undefined; message: string };

type FetchOptions = RequestInit & {
  withAuth?: boolean;
};

export async function fetchGet<T = undefined>(
  endpoint: string,
  options?: FetchOptions
): Promise<FetchResponse<T>> {
  return fetchWrapped<T>(endpoint, { ...options, method: "GET" });
}

export async function fetchPost<T = undefined>(
  endpoint: string,
  body: any,
  options?: FetchOptions
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

export async function fetchPut<T = undefined>(
  endpoint: string,
  body: any,
  options?: FetchOptions
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

export async function fetchRemove<T = undefined>(
  endpoint: string,
  // body: any,
  options?: FetchOptions
): Promise<FetchResponse<T>> {
  return fetchWrapped(endpoint, { ...options, method: "DELETE" });
}

export async function fetchWrapped<T = undefined>(
  endpoint: string,
  options?: FetchOptions
): Promise<FetchResponse<T>> {
  if (options?.withAuth) {
    const headers = new Headers(options.headers);
    headers.set(
      "Authorization",
      `Bearer ${(await cookies()).get(process.env.AUTH_TOKEN_NAME!)?.value}`
    );
    options.headers = headers;
  }

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL!}${endpoint}`,
      options
    );
    console.log("Fetch status:", response.status, response.statusText);

    if (!response.ok) {
      return await response.json();
    }

    if (response.status === 201 || response.status === 204)
      return { data: undefined, message: undefined };

    const data = await response.json();
    return { data: data, message: undefined };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      data: undefined,
      message: "Oops. Something went wrong!",
    };
  }
}
