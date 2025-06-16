import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ChatbotCreatePage from './ChatbotCreatePage';

export default function Router() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create" element={<ChatbotCreatePage />} />
      </Routes>
    </BrowserRouter>
  );
}
