import crypto from 'node:crypto';
import CryptoJS from 'crypto-js';

import InvalidIV from './errors/invalid-iv';
import InvalidEncryptedMessage from './errors/invalid-encrypted-message';
import InvalidSecretKey from './errors/invalid-secret-key';

export class Encryption {
  aes: AES;

  constructor(params: { secretKey: string }) {
    this.aes = new AES({ secretKey: params.secretKey });
  }
}

class AES {
  private secretKey: string;

  private static ENCRYPTION_IV_BYTES_LENGTH = 8;
  private static REQUIRED_IV_LENGTH = 16;
  private static REQUIRED_SECRET_KEY_LENGTH = 16;

  constructor(params: { secretKey: string }) {
    this.secretKey = params.secretKey;
  }

  encryptObject = (data: Record<string, unknown> | Array<unknown>) => {
    return this.encrypt(JSON.stringify(data));
  };

  encrypt = (data: string) => {
    const encryptionIV = crypto
      .randomBytes(AES.ENCRYPTION_IV_BYTES_LENGTH)
      .toString('hex');
    const encryptedMessage = CryptoJS.AES.encrypt(data, this.parsedSecretKey, {
      iv: CryptoJS.enc.Utf8.parse(encryptionIV),
      padding: CryptoJS.pad.Pkcs7,
    }).toString();

    return `${encryptionIV}:${encryptedMessage}`;
  };

  decrypt = (encryptedData: string) => {
    const [encryptionIV, encryptedMessage] = encryptedData.split(':');
    if (encryptionIV.length < AES.REQUIRED_IV_LENGTH) {
      throw new InvalidIV();
    }
    if (encryptedMessage == null) {
      throw new InvalidEncryptedMessage();
    }

    const decryptedData = CryptoJS.AES.decrypt(
      encryptedMessage,
      this.parsedSecretKey,
      {
        iv: CryptoJS.enc.Utf8.parse(encryptionIV),
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString(CryptoJS.enc.Utf8);

    return decryptedData;
  };

  private get parsedSecretKey() {
    const secretKey = this.secretKey;
    if (secretKey.length < AES.REQUIRED_SECRET_KEY_LENGTH) {
      throw new InvalidSecretKey();
    }

    return CryptoJS.enc.Utf8.parse(this.secretKey);
  }
}

const { ENCRYPTION_SECRET_KEY } = process.env;

const encryption = new Encryption({ secretKey: ENCRYPTION_SECRET_KEY ?? '' });

export default encryption;
