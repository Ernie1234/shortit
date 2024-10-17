import { TestFactory } from './factory';
import HTTP_STATUS from '../utils/http-status';

describe('POST /shorten', () => {
  const factory = new TestFactory();

  beforeEach((done) => {
    factory.init().then(done);
  });

  afterEach((done) => {
    factory.close().then(done);
  });

  it('It creates a short URL successfully', async () => {
    const response = await factory.app.post('api/v1/shorten').send({
      url: 'https://www.google.com/search?q=google+url+shortener&oq=google+url+shortener&aqs=chrome..69i57j0l5.3808j0j7&sourceid=chrome&ie',
    });

    expect(response.status).toBe(HTTP_STATUS.CREATED);
    expect(response.body.message).toBe('Url created successfully');
    expect(response.body.data).toHaveProperty('shortUrl');
  });

  it.todo('It returns a 400 error when the URL is not valid');
  it.todo('It returns a 400 error when the URL is not provided');
  it.todo('It returns a 400 error when the custom name is not valid');
  it.todo('It returns a 400 error when the URL already exists');
});
