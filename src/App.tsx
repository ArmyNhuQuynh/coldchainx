import { BrowserRouter } from 'react-router-dom';

import AppProvider from './providers/app-provider';
import { AppRoutes } from './routes/routes';

function App ()
{

  return (
    // <SignalRProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    // </SignalRProvider>
  )
}

export default App
