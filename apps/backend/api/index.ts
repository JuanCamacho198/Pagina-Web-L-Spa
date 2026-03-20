import { initSentry, Sentry } from '../src/lib/sentry';
import { app } from '../src/index';

if (process.env.SENTRY_DSN) {
  initSentry();
}

export default Sentry.wrapHandler(async (req: Request) => {
  return app.fetch(req);
});
