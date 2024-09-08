import type { EndpointBuilder as RTKEndpointBuilder } from '@reduxjs/toolkit/query/react';

import type baseQuery from '@/common/api/base-query';

export type EndpointBuilder = RTKEndpointBuilder<
  ReturnType<typeof baseQuery>,
  string,
  string
>;
