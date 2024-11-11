import { TestFactory } from './factory';
import HTTP_STATUS from '../utils/http-status';

const url = '/api/v1/shorten';
const exampleUrl = 'https://www.example.com';

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
      url: 'invalid-url', // Invalid URL format
    });

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.url).toBe('Invalid URL format. URL must start with http or https');
  });

  it('It returns a 400 error when the URL is not provided', async () => {
    const response = await factory.app
      .post(`${url}`)
      .send({ url: 'https://www.youtube.com/watch?v=xZLKALpvdBE', customName: ' ' });
    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.customName).toBe('Must be at least 5 letters');
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

  // it.todo('It returns a 400 error when the URL is not valid');
  // it.todo('It returns a 400 error when the URL is not provided');
  // it.todo('It returns a 400 error when the custom name is not valid');
  // it.todo('It returns a 400 error when the URL already exists');
});
