import { BrowserRouter } from 'react-router-dom';

import AppProvider from './providers/app-provider';
import { AppRoutes } from './routes/routes';
import IncidentNotificationProvider from './providers/incident-notification-provider';

function App ()
{

  return (
    // <SignalRProvider>
      <AppProvider>
        <BrowserRouter>
          <IncidentNotificationProvider>
            <AppRoutes />
          </IncidentNotificationProvider>
        </BrowserRouter>
      </AppProvider>
    // </SignalRProvider>
  )
}

export default App
