import { z } from 'zod';

const signUpPayload = z.object({
  username: z.string().min(1),
  password: z.string().min(5),
});

export default signUpPayload;
