import { z } from 'zod';

const settingsSchema = z.object({
  PORT: z.coerce.number().gt(1).default(3000),
});

const settings = settingsSchema.parse(process.env);

export default settings;
