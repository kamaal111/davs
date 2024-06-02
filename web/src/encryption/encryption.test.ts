import { Encryption } from './encryption';

describe('encryption', () => {
  const encryption = new Encryption({ secretKey: 'super_secret-123' });

  describe('decrypt', () => {
    it('should decrypt encrypted message', () => {
      const payload = { message: 'test' };
      const encryptedMessage = encryption.encryptObject(payload);

      const result = encryption.decrypt(encryptedMessage);

      expect(JSON.parse(result)).toEqual(payload);
    });
  });

  describe('encryptObject', () => {
    it('should have a result with the IV having exactly 16 characters', () => {
      const encryptedMessage = encryption
        .encryptObject({ hello: 'hi' })
        .split(':');

      expect(encryptedMessage[0]).toHaveLength(16);
    });

    it('should contain both IV and encrypted object', () => {
      const encryptedMessage = encryption
        .encryptObject({ hello: 'world' })
        .split(':');

      expect(encryptedMessage).toHaveLength(2);
    });
  });
});
