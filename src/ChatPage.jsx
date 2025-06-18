import React, { useEffect, useState, useRef } from 'react';
import { fetchChatbotFromSupabase } from './utils/supabase';
import { fetchChatbotReply } from './utils/aiApi';
import ThreeColumnLayout from './components/ThreeColumnLayout';
import { Button, TextField } from '@mui/material';
import CommonHeader from './components/CommonHeader';
import CommonFooter from './components/CommonFooter';
import VisualNovelPreview from './components/VisualNovelPreview';
import './styles/CommonUI.css';
import './styles/VisualNovelPreview.css';
import './styles/Footer.css';

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || null;
}

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
function canSend() {
  const last = Number(localStorage.getItem('last_send_time') || 0);
  const now = Date.now();
  if (now - last < 5000) return false;
  localStorage.setItem('last_send_time', now);
  return true;
}

export default function ChatPage() {
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);
  const [chatId, setChatId] = useState(null);
  const [latestBotMessage, setLatestBotMessage] = useState(null);

  useEffect(() => {
    const id = getIdFromUrl();
    setChatId(id);
    if (id) {
      // Supabase에서 챗봇 정보 fetch
      fetchChatbotFromSupabase(id)
        .then(p => {
          setProfile(p);
          // 대화 기록 불러오기(없으면 예시)
          const hist = loadHistory(id);
          setMessages(hist.length > 0 ? hist : p?.example || []);
        })
        .catch(() => {
          setProfile(null);
          setMessages([]);
        });
    } else {
      setProfile(null);
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    if (chatId) saveHistory(chatId, messages);
  }, [messages, chatId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      // 최신 봇 메시지 찾기
      const botMessages = messages.filter(msg => msg.role === 'bot');
      if (botMessages.length > 0) {
        setLatestBotMessage(botMessages[botMessages.length - 1]);
      }
    }
  }, [messages]);

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
        prompt: profile?.prompt || '',
        name: profile?.name || ''
      });
      const newBotMessage = { role: 'bot', text: reply };
      setMessages([...newMessages, newBotMessage]);
      setLatestBotMessage(newBotMessage);
    } catch (e) {
      setError('AI 응답을 가져오지 못했습니다.');
      const errorMessage = { role: 'bot', text: 'AI 응답 오류' };
      setMessages([...newMessages, errorMessage]);
      setLatestBotMessage(errorMessage);
    }
    setLoading(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <ThreeColumnLayout>
      <CommonHeader>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
          <span className="chat-title" style={{fontSize:'1.3em', fontWeight:700}}>
            AI 챗봇 - {profile?.name || '챗봇'}
          </span>
          <span className="chat-info" style={{fontSize:'0.9rem', color:'#888', fontWeight:400, marginTop:4}}>
            ⓘ 본 서비스는 AI가 생성한 컨텐츠를 포함하며, 저작권 및 이용 안내를 반드시 확인하세요.
          </span>
        </div>
      </CommonHeader>
      
      {/* 미연시 스타일 UI로 변경된 이미지 섹션 */}
      <VisualNovelPreview 
        backgroundUrl={profile?.bg_image_url || ''} 
        characterUrl={profile?.char_image_url || ''} 
        name={profile?.name || '챗봇'} 
        latestMessage={latestBotMessage}
        controls={false}
        style={{margin:'12px auto', maxWidth:'600px', width:'100%', boxSizing:'border-box', padding:'24px'}}
      />
      
      <section className="chat-section">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>{msg.role === 'bot' ? (profile?.name || '챗봇') : '사용자'}: {msg.text}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {error && <div className="chat-error">{error}</div>}
        <footer className="input-footer" style={{background:'none', boxShadow:'none', borderRadius:0, width:'100%', maxWidth:600, margin:'0 auto 20px auto', display:'flex', justifyContent:'center', alignItems:'center', position:'static'}}>
          <TextField
            className="chat-input"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
            fullWidth
            size="small"
            sx={{background:'#fff', borderRadius:2}}
          />
          <Button onClick={handleSend} disabled={loading} variant="contained" sx={{marginLeft:2, minWidth:80, fontWeight:600}}>
            {loading ? '...' : '전송'}
          </Button>
        </footer>
      </section>
      <CommonFooter>
        ⓒ 2025 챗봇 서비스 | AI 답변은 참고용, 저작권·개인정보 유의
      </CommonFooter>
    </ThreeColumnLayout>
  );
}
