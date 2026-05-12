import { redirect } from "next/navigation";

export default function DemoRedirect() {
  // The live AI panel now lives on the home page (the actual product surface).
  // Keep this route alive so older links don't 404; just bounce to home.
  redirect("/");
}
