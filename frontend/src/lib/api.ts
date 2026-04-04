import { PortfolioData } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchPortfolio(): Promise<PortfolioData> {
  const res = await fetch(`${BASE_URL}/portfolio`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch portfolio data");
  return res.json();
}

export async function fetchPortfolioClient(): Promise<PortfolioData> {
  const res = await fetch(`${BASE_URL}/portfolio`);
  if (!res.ok) throw new Error("Failed to fetch portfolio data");
  return res.json();
}

export async function submitContact(data: {
  name: string;
  email: string;
  message: string;
}) {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

// Admin helpers
function adminHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function uploadResume(file: File): Promise<string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE_URL}/admin/resume/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }
  const data = await res.json();
  return data.url as string;
}

export async function updateProfile(data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/admin/profile`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export async function getAdminExperience() {
  const res = await fetch(`${BASE_URL}/admin/experience`, {
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch experience");
  return res.json();
}

export async function createExperience(data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/admin/experience`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create experience");
  return res.json();
}

export async function updateExperience(
  id: string,
  data: Record<string, unknown>
) {
  const res = await fetch(`${BASE_URL}/admin/experience/${id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update experience");
  return res.json();
}

export async function deleteExperience(id: string) {
  const res = await fetch(`${BASE_URL}/admin/experience/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete experience");
  return res.json();
}

export async function getAdminProjects() {
  const res = await fetch(`${BASE_URL}/admin/projects`, {
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function createProject(data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/admin/projects`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
}

export async function updateProject(
  id: string,
  data: Record<string, unknown>
) {
  const res = await fetch(`${BASE_URL}/admin/projects/${id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
}

export async function deleteProject(id: string) {
  const res = await fetch(`${BASE_URL}/admin/projects/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete project");
  return res.json();
}

export async function getAdminSkills() {
  const res = await fetch(`${BASE_URL}/admin/skills`, {
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch skills");
  return res.json();
}

export async function createSkillCategory(data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/admin/skills`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create skill category");
  return res.json();
}

export async function updateSkillCategory(
  id: string,
  data: Record<string, unknown>
) {
  const res = await fetch(`${BASE_URL}/admin/skills/${id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update skill category");
  return res.json();
}

export async function deleteSkillCategory(id: string) {
  const res = await fetch(`${BASE_URL}/admin/skills/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete skill category");
  return res.json();
}

export async function updateTheme(data: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/admin/theme`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update theme");
  return res.json();
}

export async function getAdminMessages() {
  const res = await fetch(`${BASE_URL}/admin/messages`, {
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function markMessageRead(id: string) {
  const res = await fetch(`${BASE_URL}/admin/messages/${id}/read`, {
    method: "PUT",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to mark as read");
  return res.json();
}

export async function deleteMessage(id: string) {
  const res = await fetch(`${BASE_URL}/admin/messages/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete message");
  return res.json();
}
