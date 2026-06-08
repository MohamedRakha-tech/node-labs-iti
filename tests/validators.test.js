const authSchemas = require('../validators/auth');
const postSchemas = require('../validators/posts');

const validate = (schema, obj) => {
  const keys = ['body', 'params', 'query', 'headers'];
  const errors = [];
  for (const key of keys) {
    if (schema[key]) {
      const { error } = schema[key].validate(obj[key] || {}, { abortEarly: false });
      if (error) errors.push(...error.details);
    }
  }
  return errors;
};

describe('Auth validators', () => {
  describe('signup', () => {
    it('passes with valid data', () => {
      const errors = validate(authSchemas.signup, {
        body: { name: 'John', email: 'john@test.com', password: '123456', confirmPassword: '123456' },
      });
      expect(errors).toHaveLength(0);
    });

    it('rejects missing fields', () => {
      const errors = validate(authSchemas.signup, { body: {} });
      expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects mismatched passwords', () => {
      const errors = validate(authSchemas.signup, {
        body: { name: 'John', email: 'john@test.com', password: '123456', confirmPassword: '654321' },
      });
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('login', () => {
    it('passes with valid data', () => {
      const errors = validate(authSchemas.login, {
        body: { email: 'john@test.com', password: '123456' },
      });
      expect(errors).toHaveLength(0);
    });

    it('rejects invalid email', () => {
      const errors = validate(authSchemas.login, {
        body: { email: 'not-an-email', password: '123456' },
      });
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('forgotPassword', () => {
    it('passes with valid email', () => {
      const errors = validate(authSchemas.forgotPassword, {
        body: { email: 'john@test.com' },
      });
      expect(errors).toHaveLength(0);
    });
  });

  describe('resetPassword', () => {
    const validToken = 'a'.repeat(64);
    it('passes with valid data', () => {
      const errors = validate(authSchemas.resetPassword, {
        params: { token: validToken },
        body: { password: 'newpass', confirmPassword: 'newpass' },
      });
      expect(errors).toHaveLength(0);
    });

    it('rejects short token', () => {
      const errors = validate(authSchemas.resetPassword, {
        params: { token: 'short' },
        body: { password: 'newpass', confirmPassword: 'newpass' },
      });
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

describe('Post validators', () => {
  describe('createPost', () => {
    it('passes with valid data', () => {
      const errors = validate(postSchemas.createPost, {
        body: { title: 'Valid Title', content: 'Valid content here' },
      });
      expect(errors).toHaveLength(0);
    });

    it('rejects short title', () => {
      const errors = validate(postSchemas.createPost, {
        body: { title: 'Hi', content: 'Valid content here' },
      });
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
