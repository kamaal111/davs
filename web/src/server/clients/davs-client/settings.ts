import { z } from 'zod';

const settingsSchema = z.object({
  DAVS_API_KEY: z.string().min(60),
  DAVS_SERVER_BASE_URL: z.string().url(),
});

const settings = settingsSchema.parse(process.env);

export default settings;
