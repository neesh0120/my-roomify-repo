export type GenerateRequest = {
  roomType: string | null;
  styles: string[];
  image: string | null; // base64 data URL
};

export type Design = {
  id: string;
  style: string;
  image: string;
  confidence: number;
  description: string;
  liked?: boolean;
  saved?: boolean;
};

export async function generateDesigns(params: GenerateRequest): Promise<Design[]> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const message = await safeParseError(response);
    throw new Error(message || 'Failed to generate designs');
  }

  const data = await response.json();
  return data.designs as Design[];
}

async function safeParseError(res: Response): Promise<string | undefined> {
  try {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      return json.error || text;
    } catch {
      return text;
    }
  } catch {
    return undefined;
  }
}

export type Project = {
  id: string;
  name: string;
  roomType: string | null;
  styles: string[];
  createdAt: string;
  designs: Design[];
};

export async function createProject(
  token: string,
  payload: { name?: string; roomType: string | null; styles: string[]; designs: Design[] }
): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.project as Project;
}

export async function listProjects(token: string): Promise<Project[]> {
  const res = await fetch('/api/projects', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.projects as Project[];
}

export async function toggleLike(token: string, projectId: string, designId: string): Promise<boolean> {
  const res = await fetch(`/api/projects/${projectId}/designs/${designId}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return !!data.liked;
}

export async function toggleSave(token: string, projectId: string, designId: string): Promise<boolean> {
  const res = await fetch(`/api/projects/${projectId}/designs/${designId}/save`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return !!data.saved;
}



