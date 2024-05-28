import crypto from 'node:crypto';

class Encryption {
  encryptionMethod: string;

  private key: string;
  private encryptionIV: string;

  constructor(params: {
    secretKey: string;
    secretEncryptionIV: string;
    keysEncryptionMethod: string;
    encryptionMethod: string;
  }) {
    const key = crypto
      .createHash(params.keysEncryptionMethod)
      .update(params.secretKey)
      .digest('hex')
      .substring(0, 32);
    const encryptionIV = crypto
      .createHash(params.keysEncryptionMethod)
      .update(params.secretEncryptionIV)
      .digest('hex')
      .substring(0, 16);

    this.key = key;
    this.encryptionIV = encryptionIV;
    this.encryptionMethod = params.encryptionMethod;
  }

  encrypt = (data: Record<string, unknown>) => {
    const cipher = crypto.createCipheriv(
      this.encryptionMethod,
      this.key,
      this.encryptionIV
    );

    const encryptedData =
      cipher.update(JSON.stringify(data), 'utf8', 'hex') + cipher.final('hex');

    return Buffer.from(encryptedData).toString('base64');
  };

  decrypt = (encryptedData: string) => {
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = crypto.createDecipheriv(
      this.encryptionMethod,
      this.key,
      this.encryptionIV
    );

    const decryptedData =
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8');

    return decryptedData;
  };
}

const ENV_KEYS = [
  'ENCRYPTION_SECRET_KEY',
  'ENCRYPTION_SECRET_IV',
  'ENCRYPTION_METHOD',
] as const;

function loadEnv() {
  const envs: Partial<Record<(typeof ENV_KEYS)[number], string>> = {};
  for (const key of ENV_KEYS) {
    const env = process.env[key];
    if (!env) {
      throw new Error(`${key} not defined in .env`);
    }
    envs[key] = env;
  }

  return envs as Required<typeof envs>;
}

const { ENCRYPTION_METHOD, ENCRYPTION_SECRET_IV, ENCRYPTION_SECRET_KEY } =
  loadEnv();

const encryption = new Encryption({
  encryptionMethod: ENCRYPTION_METHOD,
  secretEncryptionIV: ENCRYPTION_SECRET_IV,
  secretKey: ENCRYPTION_SECRET_KEY,
  keysEncryptionMethod: 'SHA512',
});

export default encryption;
