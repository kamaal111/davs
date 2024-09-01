import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';

const rootElement = document.getElementById('root');
if (rootElement == null) {
  throw new Error('.root element not defined');
}

ReactDOM.createRoot(rootElement).render(<App />);
