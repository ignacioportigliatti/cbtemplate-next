import { redirect } from "next/navigation";

export default async function LocationPage() {
  // Redirect to home page since location pages should be specific
  redirect("/");
} 