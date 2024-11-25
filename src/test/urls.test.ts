import HTTP_STATUS from '../utils/http-status';
import TestFactory from './factory';
import Url from '../models/url';
import logger from '../logs/logger';
import { notFoundMsg } from '../constants/messages';

const url = '/api/v1/shorten';
const exampleUrl = 'https://www.example.com';
const shortUrl = 'short.ly/example';
const endpoint = '/api/v1/urls';
const customName = 'existing-name';

describe('POST /shorten', () => {
  const factory = new TestFactory();

  beforeEach((done) => {
    factory.init().then(done);
  });

  afterEach((done) => {
    factory.close().then(done);
  });

  it('It creates a short URL successfully', async () => {
    const response = await factory.app.post(url).send({
      url: 'https://www.google.com/search?q=google+url+shortener&oq=google+url+shortener&aqs=chrome..69i57j0l5.3808j0j7&sourceid=chrome&ie',
    });

    expect(response.status).toBe(HTTP_STATUS.CREATED);
    expect(response.body.message).toBe('Url shortened successfully');
    expect(response.body.data).toHaveProperty('shortUrl');
  });

  it('It returns a 400 error when the URL is not valid', async () => {
    const response = await factory.app.post(`${url}`).send({
      url: 'invalid-url',
    });

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.url).toBe('Invalid URL format. URL must start with http or https');
  });

  it('It returns a 400 error when the URL is not provided', async () => {
    const response = await factory.app.post(`${url}`).send({ customName: ' ' });
    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.url).toBe('Url is required.');
  });

  it('It returns a 400 error when the custom name is not valid', async () => {
    const res1 = await factory.app
      .post(`${url}`)
      .send({ url: 'https://www.youtube.com/watch?v=xZLKALpvdBE', customName: 'cast' });
    expect(res1.status).toBe(HTTP_STATUS.BAD_REQUEST);
    // expect(res1.body.errors).toBeDefined(); // Check that errors is defined
    expect(res1.body.customName).toBe('Must be at least 5 letters');
  });

  it('It returns a 400 error when the URL already exists', async () => {
    await factory.app.post(`${url}`).send({
      url: exampleUrl,
    });

    const response = await factory.app.post(`${url}`).send({
      url: exampleUrl,
    });

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.message).toBe('Url already exists!');
  });
});

describe('GET /urls', () => {
  const factory = new TestFactory();

  beforeEach(async () => {
    await factory.init();
    await Url.deleteMany({}); // Clear the database before each test
  });

  afterEach(async () => {
    await factory.close();
  });

  it('should return an empty array of urls', async () => {
    const response = await factory.app.get(endpoint);
    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body).toEqual([]);
  });

  it('should return an array of urls', async () => {
    await Url.create({
      originalUrl: exampleUrl,
      shortUrl,
    });

    const response = await factory.app.get(endpoint);
    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('originalUrl', exampleUrl);
  });
});

describe('GET /urls/:id', () => {
  const factory = new TestFactory();

  beforeEach(async () => {
    await factory.init();
  });

  afterEach(async () => {
    await factory.close();
  });

  it('should return a single url', async () => {
    const res = await factory.app.post(url).send({
      url: exampleUrl,
    });

    const createdUrl = res.body.data;
    expect(createdUrl).toBeDefined(); // Check that createdUrl is defined

    if (!createdUrl) {
      logger.error('URL creation failed, no data returned.');
      throw new Error('URL creation failed, no data returned.');
    }

    const { _id } = createdUrl;
    expect(_id).toBeDefined();

    const response = await factory.app.get(`${endpoint}/${_id}`);

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body).toHaveProperty('originalUrl', exampleUrl);
  });

  it('should return an error if the url does not exist', async () => {
    const response = await factory.app.get(`${endpoint}/67430d07035777a545e2f79b`);

    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(response.body.message).toBe('No Url found!');
  });
});

describe('PUT /urls/:id', () => {
  const factory = new TestFactory();

  beforeEach((done) => {
    factory.init().then(done);
  });

  afterEach((done) => {
    factory.close().then(done);
  });
  it('should update a single url', async () => {
    const responsePost = await factory.app.post(url).send({
      url: exampleUrl,
    });
    const { _id } = responsePost.body.data;

    const newUrl = 'https://www.updated-example.com';
    const response = await factory.app.put(`${endpoint}/${_id}`).send({
      url: newUrl,
    });

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.message).toBe('Url updated successfully');
    expect(response.body.successResponse).toHaveProperty('originalUrl', newUrl);
  });

  it('should return an error if the url id does not exist', async () => {
    const response = await factory.app.put(`${endpoint}/67430d07035777a545e2f79b`).send({
      url: exampleUrl,
    });
    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(response.body.message).toBe(notFoundMsg);
  });

  it('should return an error if the request body is invalid', async () => {
    const responsePost = await factory.app.post(url).send({
      url: exampleUrl,
    });
    const { _id } = responsePost.body.data;

    const response = await factory.app.put(`${endpoint}/${_id}`).send({
      url: 'invalid-url', // Invalid URL format
    });
    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.url).toBe('Invalid URL format. URL must start with http or https');
  });

  it('should return an error if the custom name already exists', async () => {
    await factory.app.post(url).send({
      url: exampleUrl,
      customName,
    });

    const responsePost = await factory.app.post(url).send({
      url: 'https://different-example.com',
    });

    const { _id } = responsePost.body.data;
    const response = await factory.app.put(`${endpoint}/${_id}`).send({
      url: exampleUrl,
      customName,
    });

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body).toHaveProperty('successResponse');
    expect(response.body.successResponse).toHaveProperty('customName', customName);
  });
});

describe('DELETE /urls/:id', () => {
  const factory = new TestFactory();

  beforeEach((done) => {
    factory.init().then(done);
  });

  afterEach((done) => {
    factory.close().then(done);
  });
  it('should delete a single url', async () => {
    const responsePost = await factory.app.post(url).send({
      url: exampleUrl,
    });
    const { _id } = responsePost.body.data;

    const response = await factory.app.delete(`${endpoint}/${_id}`);
    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.body.message).toBe('Url deleted successfully');
  });

  it('should return an error if the url id does not exist', async () => {
    const response = await factory.app.delete(`${endpoint}/67430d07035777a545e2f79b`);
    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(response.body.message).toBe(notFoundMsg);
  });
});
