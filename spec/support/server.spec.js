const request = require('request');
const MESSAGES_URL = 'http://localhost:3000/messages';

describe('get Messages', () => {
  it('should return 200', done => {
    request.get(MESSAGES_URL, (err, res) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('should return a not empty list', done => {
    request.get(MESSAGES_URL, (err, res) => {
      expect(JSON.parse(res.body).length).toBeGreaterThan(0);
      done();
    });
  });
});

describe('get message from user', () => {
  it('should return 200', done => {
    request.get(`${MESSAGES_URL}/tim`, (err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    });
  });

  it('name should be tim', done => {
    request.get(`${MESSAGES_URL}/test`, (err, res) => {
      expect(JSON.parse(res.body)[0].name).toEqual('test');
      done();
    });
  });
});
