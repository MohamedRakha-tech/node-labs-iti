const APIError = require('../utils/APIERROR');

describe('APIError', () => {
  it('sets statusCode and message', () => {
    const err = new APIError(404, 'Not found');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Not found');
    expect(err).toBeInstanceOf(Error);
  });

  it('captures stack trace', () => {
    const err = new APIError(500, 'Server error');
    expect(err.stack).toBeDefined();
  });
});
