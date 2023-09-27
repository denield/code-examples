import request from 'supertest';
import { app } from '../src/app';

describe('GET /random-url', () => {
  it('should return 404', async () => {
    await request(app).get('/reset').expect(404);
  });
});

describe('GET /healthz', () => {
  it('should return HTTP 200 with "healthy"', async () => {
    const response = await request(app).get('/api/healthz').set("accept", "application/json").expect(200);
    expect(response.body).toEqual({"health": "ok"});
  });
});
