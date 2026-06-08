const { parsePagination, paginatedResponse, successResponse } = require('../utils/helpers');

describe('parsePagination', () => {
  it('uses defaults when no query provided', () => {
    const result = parsePagination({});
    expect(result).toEqual({ page: 1, limit: 10 });
  });

  it('parses page and limit from query', () => {
    const result = parsePagination({ page: '3', limit: '25' });
    expect(result).toEqual({ page: 3, limit: 25 });
  });

  it('clamps limit to maxLimit', () => {
    const result = parsePagination({ limit: '999' }, { maxLimit: 50 });
    expect(result.limit).toBe(50);
  });

  it('ensures minimum page is 1', () => {
    const result = parsePagination({ page: '0' });
    expect(result.page).toBe(1);
  });

  it('handles custom defaults', () => {
    const result = parsePagination({}, { page: 2, limit: 20, maxLimit: 100 });
    expect(result).toEqual({ page: 2, limit: 20 });
  });
});

describe('paginatedResponse', () => {
  it('builds correct structure', () => {
    const result = paginatedResponse([1, 2], 20, 1, 10);
    expect(result).toEqual({
      status: 'success',
      data: [1, 2],
      pagination: { page: 1, limit: 10, total: 20, totalPages: 2 },
    });
  });

  it('returns 0 totalPages for empty data', () => {
    const result = paginatedResponse([], 0, 1, 10);
    expect(result.pagination.totalPages).toBe(0);
  });
});

describe('successResponse', () => {
  it('wraps data in standard format', () => {
    const result = successResponse({ id: 1 });
    expect(result).toEqual({ status: 'success', data: { id: 1 } });
  });
});
