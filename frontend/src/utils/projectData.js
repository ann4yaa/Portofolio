let cachedProjects;
let cachedHomeProjects;

export async function fetchPublicProjects({ signal } = {}) {
  if (cachedProjects) return cachedProjects;

  const response = await fetch('/projects.json', { signal });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const projects = await response.json();
  if (!Array.isArray(projects)) {
    throw new Error('Data project tidak valid');
  }

  cachedProjects = projects;
  return cachedProjects;
}

export async function fetchHomeProjects({ signal } = {}) {
  if (cachedHomeProjects) return cachedHomeProjects;

  try {
    const [recentResponse, countResponse] = await Promise.all([
      fetch('/api/projects/recent', { signal }),
      fetch('/api/projects/count', { signal }),
    ]);

    if (!recentResponse.ok || !countResponse.ok) {
      throw new Error(
        `Project API returned ${recentResponse.status}/${countResponse.status}`
      );
    }

    const isJson = (response) =>
      /^application\/(?:[\w.+-]*\+)?json\b/i.test(
        response.headers.get('content-type') || ''
      );
    if (!isJson(recentResponse) || !isJson(countResponse)) {
      throw new Error('Project API returned a non-JSON response');
    }

    const [projects, count] = await Promise.all([
      recentResponse.json(),
      countResponse.json(),
    ]);
    if (!Array.isArray(projects) || !Number.isInteger(count?.total) || count.total < 0) {
      throw new Error('Data project terbaru tidak valid');
    }

    cachedHomeProjects = { projects, total: count.total };
    return cachedHomeProjects;
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.warn('Project API unavailable; using the static project export.', error);
  }

  const projects = await fetchPublicProjects({ signal });
  cachedHomeProjects = { projects: projects.slice(0, 3), total: projects.length };
  return cachedHomeProjects;
}
