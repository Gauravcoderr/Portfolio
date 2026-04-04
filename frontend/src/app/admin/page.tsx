"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/profile");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-[var(--text-secondary)]">Redirecting...</p>
    </div>
  );
}
