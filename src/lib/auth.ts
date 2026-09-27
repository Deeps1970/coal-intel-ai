// Demo-only session. No real authentication — lets judges explore without credentials.
const KEY = "coalintel.demo-session";

export const DEMO_USER = {
  name: "Demo User",
  email: "demo@coalintel.ai",
  role: "Data Intelligence Analyst",
};
export const DEMO_PASSWORD = "demo1234";

export function signIn(email: string, password: string) {
  if (email.trim().toLowerCase() !== DEMO_USER.email || password !== DEMO_PASSWORD) return false;
  localStorage.setItem(KEY, "1");
  return true;
}
export function signInDemo() {
  localStorage.setItem(KEY, "1");
}
export function signOut() {
  localStorage.removeItem(KEY);
}
export function isSignedIn() {
  return typeof window !== "undefined" && localStorage.getItem(KEY) === "1";
}
