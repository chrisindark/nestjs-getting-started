import tracer from 'dd-trace';

import { PRODUCTION_KEY } from 'src/constants/constants';

const TRACER_OPTIONS = {
  env: process.env.NODE_ENV,
  startupLogs: true,
  sampleRate: process.env.NODE_ENV === PRODUCTION_KEY ? 1.0 : 0.0,
};

// initialized in a different file to avoid hoisting.
tracer.init(TRACER_OPTIONS);

export default tracer;
