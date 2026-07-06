import { headers } from "next/headers";
import { auth } from "./auth";

/** Resolves the current logged-in user's session inside a Route Handler. */
export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}
