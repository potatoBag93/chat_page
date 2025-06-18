import React, { useState, useEffect } from 'react';
import { fetchChatbotFromSupabase } from './utils/supabase';
import { useNavigate } from 'react-router-dom';
import ThreeColumnLayout from './components/ThreeColumnLayout';
import Button from './components/UI/Button';
import CommonHeader from './components/CommonHeader';
import CommonFooter from './components/CommonFooter';
import './styles/CommonUI.css';
import './styles/ChatbotListPage.css';

export default function ChatbotListPage() {
  const [profiles, setProfiles] = useState([]);
  const [infoMsg, setInfoMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfilesFromSupabase();
  }, []);

  const fetchProfilesFromSupabase = async () => {
    try {
      const { data } = await fetchChatbotFromSupabase();
      setProfiles(data.map(p => [p.id, p]));
    } catch (e) {
      setProfiles([]);
      setError('챗봇 정보를 불러오는 데 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await supabase.from('chatbot_profiles').delete().eq('id', id);
        fetchProfilesFromSupabase();
        setInfoMsg('삭제 완료!');
        setTimeout(() => setInfoMsg(''), 1500);
      } catch (e) {
        setError('삭제 실패: ' + e.message);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/create?edit=${id}`);
  };

  const handleOpenChat = (id) => {
    navigate(`/chat?id=${id}`);
  };

  const handleShare = (id) => {
    const p = profiles.find(([pid]) => pid === id)?.[1];
    if (p) {
      const shareText = `챗봇 이름: ${p.name}\n페르소나: ${p.persona}\n예시: ${(p.example && p.example[0]?.text) || ''}`;
      navigator.clipboard.writeText(shareText);
      setInfoMsg('챗봇 정보가 클립보드에 복사되었습니다!');
      setTimeout(() => setInfoMsg(''), 1500);
    }
  };

  return (
    <ThreeColumnLayout>
      <CommonHeader>
        내 챗봇 목록
        <div style={{fontSize:'1rem', color:'#888', fontWeight:400, marginTop:4}}>ⓘ 생성된 챗봇들을 확인하고 관리할 수 있습니다.</div>
      </CommonHeader>

      <div className="page-actions">
        <Button onClick={() => navigate('/create')}>새 챗봇 만들기</Button>
        <Button onClick={() => navigate('/')}>챗봇 대화로</Button>
      </div>

      <div className="chatbot-list-container">
        {profiles.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h3>등록된 챗봇이 없습니다</h3>
            <p>새 챗봇 만들기 버튼을 눌러 첫 챗봇을 생성해보세요!</p>
            <Button onClick={() => navigate('/create')}>새 챗봇 만들기</Button>
          </div>
        )}

        {profiles.map(([id, p]) => (
          <div key={id} className="chatbot-card">
            <div className="chatbot-info">
              <h3>{p.name}</h3>
              <p className="chatbot-persona">{p.persona}</p>
              {p.description && <p className="chatbot-description">{p.description}</p>}
              {p.tags && p.tags.length > 0 && (
                <div className="chatbot-tags">
                  {p.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="chatbot-actions">
              <Button onClick={() => handleOpenChat(id)}>대화하기</Button>
              <Button onClick={() => handleEdit(id)}>수정</Button>
              <Button onClick={() => handleDelete(id)}>삭제</Button>
              <Button onClick={() => handleShare(id)}>공유</Button>
            </div>
          </div>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}
      {infoMsg && <div className="info-message">{infoMsg}</div>}

      <CommonFooter>
        ⓒ 2025 챗봇 서비스 | AI 답변은 참고용, 저작권·개인정보 유의
      </CommonFooter>
    </ThreeColumnLayout>
  );
}
