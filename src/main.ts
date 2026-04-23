import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

function isBrowserMswEnabled() {
  return (
    typeof window !== 'undefined' && (window as { __NG_MSW__?: string }).__NG_MSW__ === '1'
  );
}

async function bootstrap() {
  if (isBrowserMswEnabled()) {
    const { startMsw } = await import('./mocks/browser');
    await startMsw();
  }
  return bootstrapApplication(App, appConfig);
}

bootstrap().catch((err) => console.error(err));
