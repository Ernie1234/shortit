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
    const response = await factory.app.post(`${url}`).send({
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
    expect(response.body.message).toBe('Invalid URL format');
  });

  it('It returns a 400 error when the URL is not provided', async () => {
    const response = await factory.app.post(`${url}`).send({});

    expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.body.message).toBe('URL is required');
  });

  it('It returns a 400 error when the custom name is not valid', async () => {
    const res1 = await factory.app
      .post(`${url}`)
      .send({ url: 'https://www.youtube.com/watch?v=xZLKALpvdBE', customName: 'cast' });
    expect(res1.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(res1.body.errors).toBeDefined(); // Check that errors is defined
    expect(res1.body.errors[0].message).toBe('Must be at least 5 letters'); // Ensure the correct message

    const res2 = await factory.app
      .post(`${url}`)
      .send({ url: 'https://www.youtube.com/watch?v=xZLKALpvdBE', customName: 'inv' });
    expect(res2.status).toBe(HTTP_STATUS.BAD_REQUEST); // Change to BAD_REQUEST
    expect(res2.body.errors).toBeDefined(); // Check that errors is defined
    expect(res2.body.errors[0].message).toBe('Must be at least 5 letters'); // Check the error message
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
