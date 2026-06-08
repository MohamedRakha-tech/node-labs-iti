const http = require('http');
const express = require('express');
const errorHandler = require('../middlewares/errorHandler');
const APIError = require('../utils/APIERROR');

const createApp = (routeHandler) => {
  const app = express();
  app.get('/test', routeHandler);
  app.use(errorHandler);
  return app;
};

const request = (app) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      http.get(`http://localhost:${port}/test`, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          server.close();
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        });
      }).on('error', (err) => {
        server.close();
        reject(err);
      });
    });
  });
};

describe('Error Handler', () => {
  it('handles APIError with statusCode', async () => {
    const app = createApp((req, res, next) => {
      next(new APIError(400, 'Bad request'));
    });
    const res = await request(app);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ status: 'error', message: 'Bad request', data: null });
  });

  it('handles ValidationError (Mongoose)', async () => {
    const app = createApp((req, res, next) => {
      const err = new Error('Validation failed');
      err.name = 'ValidationError';
      next(err);
    });
    const res = await request(app);
    expect(res.status).toBe(400);
  });

  it('handles CastError (Mongoose)', async () => {
    const app = createApp((req, res, next) => {
      const err = new Error('Invalid ObjectId');
      err.name = 'CastError';
      next(err);
    });
    const res = await request(app);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid ID format');
  });

  it('handles MulterError', async () => {
    const app = createApp((req, res, next) => {
      const err = new Error('File too large');
      err.name = 'MulterError';
      next(err);
    });
    const res = await request(app);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('File too large');
  });

  it('handles unknown errors with 500', async () => {
    const app = createApp((req, res, next) => {
      next(new Error('Something broke'));
    });
    const res = await request(app);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('something went wrong');
  });
});
