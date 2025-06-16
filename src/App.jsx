import './App.css';
import { useEffect, useState, useRef } from 'react';
import { getChatbotProfile, seedExampleProfile } from './utils/chatbotStorage';
import { fetchChatbotReply } from './utils/aiApi';

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'demo';
}

// 대화 기록을 LocalStorage에 저장/불러오기
function getHistoryKey(id) {
  return `chat_history_${id}`;
}
function saveHistory(id, messages) {
  localStorage.setItem(getHistoryKey(id), JSON.stringify(messages));
}
function loadHistory(id) {
  try {
    return JSON.parse(localStorage.getItem(getHistoryKey(id))) || [];
  } catch {
    return [];
  }
}

// 간단한 악용 방지: 5초 이내 연속 전송 제한
function canSend() {
  const last = Number(localStorage.getItem('last_send_time') || 0);
  const now = Date.now();
  if (now - last < 5000) return false;
  localStorage.setItem('last_send_time', now);
  return true;
}

function App() {
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);
  const [chatId, setChatId] = useState('demo');

  useEffect(() => {
    seedExampleProfile();
    const id = getIdFromUrl();
    setChatId(id);
    const p = getChatbotProfile(id);
    setProfile(p);
    // 대화 기록 불러오기(없으면 예시)
    const hist = loadHistory(id);
    setMessages(hist.length > 0 ? hist : p?.example || []);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // 대화 기록 저장
    saveHistory(chatId, messages);
  }, [messages, chatId]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (!canSend()) {
      setError('너무 빠르게 입력하고 있습니다. 잠시 후 다시 시도하세요.');
      return;
    }
    setError('');
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const reply = await fetchChatbotReply({
        messages: newMessages,
        persona: profile?.persona || '',
        prompt: profile?.prompt || ''
      });
      setMessages([...newMessages, { role: 'bot', text: reply }]);
    } catch (e) {
      setError('AI 응답을 가져오지 못했습니다.');
      setMessages([...newMessages, { role: 'bot', text: 'AI 응답 오류' }]);
    }
    setLoading(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="layout-3col">
      {/* 좌측 컬럼 (미사용) */}
      <aside className="side-col left-col" aria-hidden="true"></aside>

      {/* 중앙 컬럼 */}
      <main className="center-col">
        {/* 헤더 */}
        <header className="chat-header">
          <div className="chat-title">AI 챗봇 - {profile?.persona || '챗봇'}</div>
          <div className="chat-info">ⓘ 본 서비스는 AI가 생성한 컨텐츠를 포함하며, 저작권 및 이용 안내를 반드시 확인하세요.</div>
        </header>
        {/* 이미지 영역 */}
        <section className="image-section">
          <div className="background-image">
            <div className="bg-img-demo"></div>
          </div>
          <div className="character-image">
            <div className="char-img-demo"></div>
          </div>
        </section>
        {/* 채팅창 */}
        <section className="chat-section">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.role}`}>{msg.role === 'bot' ? '챗봇' : '사용자'}: {msg.text}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {error && <div className="chat-error">{error}</div>}
        </section>
        {/* 입력창 */}
        <footer className="input-footer">
          <input
            className="chat-input"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
          />
          <button className="send-btn" onClick={handleSend} disabled={loading}>
            {loading ? '...' : '전송'}
          </button>
        </footer>
        {/* 푸터 */}
        <div className="chat-footer">© 2025 {profile?.persona || '챗봇'}</div>
      </main>

      {/* 우측 컬럼 (미사용) */}
      <aside className="side-col right-col" aria-hidden="true"></aside>
    </div>
  );
}

export default App;
