import ReactDOM from 'react-dom/client';

import HomePage from '../pages/home';

import './global.css';

const rootElement = document.getElementById('root');
if (rootElement == null) {
  throw new Error('.root element not defined');
}

ReactDOM.createRoot(rootElement).render(<HomePage />);
