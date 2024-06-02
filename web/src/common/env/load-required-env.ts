type StringUnion<TargetKey extends string> = `${TargetKey}`;

function loadRequiredEnv<TargetKey extends string>(
  keys: Array<StringUnion<TargetKey>>
) {
  const envs: Partial<Record<(typeof keys)[number], string>> = {};
  for (const key of keys) {
    const env = process.env[key];
    if (!env) throw new RequiredEnvNotFound(key);

    envs[key] = env;
  }

  return envs as Required<typeof envs>;
}

class RequiredEnvNotFound extends Error {
  constructor(envKey: string) {
    super(`Required '${envKey}' not found in .env`);
  }
}

export default loadRequiredEnv;
