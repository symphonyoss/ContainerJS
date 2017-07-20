import { app } from './src/app';
import { MessageService }  from './src/message-service';
import { ScreenSnippet } from './src/screen-snippet';
import { Window } from './src/window';
import { BrowserNotification as Notification } from './src/notification';
import { Screen } from './src/screen';

let api: any = {
  app,
  MessageService,
  ScreenSnippet,
  Window,
  Notification,
  Screen
};

if ((window as any).ssf) {
  api = (window as any).ssf;
}

// Need to disable tslint for the next line so we can export default
export default api; // tslint:disable-line
