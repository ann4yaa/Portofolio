export async function fetchPublicProjects() {
  const response = await fetch('/api/projects/public');

  if (response.ok) {
    const projects = await response.json();
    if (!Array.isArray(projects)) {
      throw new Error('Respons API project tidak valid');
    }
    return projects;
  }

  if (response.status !== 404) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const fallbackResponse = await fetch('/assets/data.json');
  if (!fallbackResponse.ok) {
    throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
  }

  const fallbackData = await fallbackResponse.json();
  if (!fallbackData || !Array.isArray(fallbackData.projects)) {
    throw new Error('Data project fallback tidak valid');
  }

  return fallbackData.projects;
}
