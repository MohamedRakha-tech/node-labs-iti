exports.parsePagination = (query, defaults = { page: 1, limit: 10, maxLimit: 50 }) => {
  const { page = defaults.page, limit = defaults.limit, maxLimit = defaults.maxLimit } = defaults;
  return {
    page: Math.max(1, parseInt(query.page) || page),
    limit: Math.min(maxLimit, Math.max(1, parseInt(query.limit) || limit)),
  };
};

exports.paginatedResponse = (data, total, page, limit) => ({
  status: 'success',
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
  },
});

exports.successResponse = (data, statusCode = 200) => ({
  status: 'success',
  data,
});
