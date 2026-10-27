const jsonResponse = (body) => ({
  ok: true,
  status: 200,
  headers: { get: () => 'application/json; charset=utf-8' },
  json: async () => body,
});

const htmlResponse = () => ({
  ok: true,
  status: 200,
  headers: { get: () => 'text/html; charset=utf-8' },
  json: async () => {
    throw new SyntaxError('Unexpected token <');
  },
});

describe('fetchHomeProjects', () => {
  beforeEach(() => {
    jest.resetModules();
    global.fetch = jest.fn();
  });

  it('uses the static export when the hosted API returns HTML with status 200', async () => {
    const staticProjects = [{ id: 7 }, { id: 6 }, { id: 5 }, { id: 4 }];
    global.fetch
      .mockResolvedValueOnce(htmlResponse())
      .mockResolvedValueOnce(htmlResponse())
      .mockResolvedValueOnce(jsonResponse(staticProjects));
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { fetchHomeProjects } = require('./projectData');

    await expect(fetchHomeProjects()).resolves.toEqual({
      projects: staticProjects.slice(0, 3),
      total: staticProjects.length,
    });
    expect(global.fetch).toHaveBeenNthCalledWith(3, '/projects.json', {
      signal: undefined,
    });

    warn.mockRestore();
  });

  it('uses API data when both hosted API responses contain valid JSON', async () => {
    const recentProjects = [{ id: 7 }, { id: 6 }];
    global.fetch
      .mockResolvedValueOnce(jsonResponse(recentProjects))
      .mockResolvedValueOnce(jsonResponse({ total: 7 }));
    const { fetchHomeProjects } = require('./projectData');

    await expect(fetchHomeProjects()).resolves.toEqual({
      projects: recentProjects,
      total: 7,
    });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
