import { Logger } from '../../../src/lib/logger/logger';
import { Postgres } from '../../../src/lib/db/postgres';


describe('DB connection', () => {
  let mockPostgres: Postgres;
  let mockLogger: Logger;

  beforeAll(() => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as Logger;
    mockPostgres = new Postgres(mockLogger);
  });
  
  describe('isAuthenticated()', () => {
    it('Should return true if the connection is successful', async() => {
      mockPostgres.connector.authenticate = jest.fn().mockResolvedValueOnce(Promise.resolve());
      const result = await mockPostgres.isAuthenticated();
      expect(result).toEqual(true);
    });

    it('Should return false if failed to connect to the database', async() => {
      mockPostgres.connector.authenticate = jest.fn().mockRejectedValueOnce(new Error());
      const result = await mockPostgres.isAuthenticated();
      expect(result).toEqual(false);
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error connecting to the database:'));
    });
  });
  
  it('Should call the close() function', () => {
    mockPostgres.connector.close = jest.fn();
    mockPostgres.close();
    expect(mockPostgres.connector.close).toHaveBeenCalled();

  });
});