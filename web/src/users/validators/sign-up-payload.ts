import { z } from 'zod';

import LoginPayload from './login-payload';

const SignUpPayload = LoginPayload.merge(
  z.object({ verificationPassword: LoginPayload.shape.password })
);

export default SignUpPayload;
