import { BrowserRouter } from 'react-router-dom';

import { AuthRouter } from '@features/auth';

export default function App() {
  return (
    <BrowserRouter>
      <AuthRouter />
    </BrowserRouter>
  );
}
