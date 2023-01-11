import { createRoot } from 'react-dom/client';
import { App } from './app';
import './app.css';

const container = document.getElementById('root');

if (!container) throw new Error('#root element not found');

const root = createRoot(container);

root.render(<App />);
