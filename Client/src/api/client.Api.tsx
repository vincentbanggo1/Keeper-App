const API_URL = 'http://localhost:8000/api/notes';

type Note = {
  id: number;
  title: string;
  content: string;
};

type NoteInput = {
  title: string;
  content?: string;
};

type NoteUpdates = Partial<Pick<Note, 'title' | 'content'>>;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Request failed';
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const data: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof data.message === 'string'
        ? data.message
        : 'Request failed',
    );
  }

  return data as T;
}

export async function getNotes(): Promise<Note[]> {
  const response = await fetch(API_URL);
  return handleResponse<Note[]>(response);
}

export async function createNote({ title, content = '' }: NoteInput): Promise<Note> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  });

  return handleResponse<Note>(response);
}

export async function updateNote(id: number, updates: NoteUpdates): Promise<Note> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  return handleResponse<Note>(response);
}

export async function deleteNote(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  await handleResponse<void>(response);
}

export { getErrorMessage };