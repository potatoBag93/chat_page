import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import ChatPage from './ChatPage';
import App from './App';
import ChatbotCreatePage from './ChatbotCreatePage';
import ChatbotListPage from './ChatbotListPage';

export default function Router() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/chat" element={<ChatPage />} /> {/* ID는 쿼리 파라미터로 전달: /chat?id=xxx */}
        <Route path="/create" element={<ChatbotCreatePage />} />
        <Route path="/list" element={<ChatbotListPage />} />
      </Routes>
    </BrowserRouter>
  );
}
