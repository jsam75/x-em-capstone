import { describe, it } from 'mocha';
import request from 'supertest';
import { expect } from 'chai';

import app from '../app.js';

describe('Events API', () => {

  describe('GET /api/events', () => {

    it('should return all events', async () => {

      const res = await request(app)
        .get('/api/events');

      expect(res.status).to.equal(200);

      expect(res.body).to.be.an('object');

      expect(res.body.data).to.be.an('array');

    });
  });

    describe('PUT /api/events/:id', () => {

        it('should accept a valid update request', async () => {

            const res = await request(app)
            .put('/api/events/23')
            .send({
                name: 'Updated Event Name',
                subjectTags: ['Math']
            });

            expect(res.status).to.equal(200);

            expect(res.body).to.be.an('object');
        })
    });
});