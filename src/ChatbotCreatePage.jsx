import './App.css';
import { useState, useEffect } from 'react';
import { getAllChatbotProfiles, saveChatbotProfile, deleteChatbotProfile, getChatbotProfile } from './utils/chatbotStorage';
import { useNavigate } from 'react-router-dom';

function ChatbotCreatePage() {
  const [name, setName] = useState('');
  const [persona, setPersona] = useState('');
  const [example, setExample] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null); // 수정 모드용
  const [infoMsg, setInfoMsg] = useState(''); // 공유 등 안내
  const navigate = useNavigate();

  useEffect(() => {
    refreshProfiles();
  }, []);

  const refreshProfiles = () => {
    const all = getAllChatbotProfiles();
    setProfiles(Object.entries(all));
  };

  const handleSave = () => {
    if (!name.trim() || !persona.trim()) {
      setError('챗봇 이름과 프롬프트는 필수입니다.');
      return;
    }
    // 신규/수정 구분
    const id = editId || name;
    saveChatbotProfile(id, {
      persona,
      prompt: persona,
      example: example
        ? [
            { role: 'user', text: example },
            { role: 'bot', text: '예시 답변' }
          ]
        : []
    });
    setError('');
    setInfoMsg(editId ? '수정 완료!' : '저장 완료!');
    setName('');
    setPersona('');
    setExample('');
    setEditId(null);
    refreshProfiles();
    setTimeout(() => setInfoMsg(''), 1500);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteChatbotProfile(id);
      refreshProfiles();
      setInfoMsg('삭제 완료!');
      setTimeout(() => setInfoMsg(''), 1500);
      // 수정 중 삭제 시 폼 초기화
      if (editId === id) {
        setName(''); setPersona(''); setExample(''); setEditId(null);
      }
    }
  };

  const handleEdit = (id) => {
    const p = getChatbotProfile(id);
    if (p) {
      setName(id);
      setPersona(p.persona || '');
      setExample((p.example && p.example[0]?.text) || '');
      setEditId(id);
      setError('');
      setInfoMsg('수정 모드');
    }
  };

  const handleShare = (id) => {
    const p = getChatbotProfile(id);
    if (p) {
      const shareText = `챗봇 이름: ${id}\n페르소나: ${p.persona}\n예시: ${(p.example && p.example[0]?.text) || ''}`;
      navigator.clipboard.writeText(shareText);
      setInfoMsg('챗봇 정보가 클립보드에 복사되었습니다!');
      setTimeout(() => setInfoMsg(''), 1500);
    }
  };

  return (
    <div className="layout-3col">
      <aside className="side-col left-col" aria-hidden="true"></aside>
      <main className="center-col">
        {/* 헤더 */}
        <header className="chat-header">
          <div className="chat-title">챗봇 생성/관리</div>
          <div className="chat-info">ⓘ AI 컨텐츠, 저작권, 개인정보 안내</div>
          <button className="send-btn" style={{position:'absolute', right:32, top:24}} onClick={()=>navigate('/')}>챗봇 대화로</button>
        </header>
        {/* 생성 폼 */}
        <section className="image-section" style={{marginTop: 40}}>
          <div style={{background: '#f3f4f6', borderRadius: 20, padding: 32, width: '90%', maxWidth: 660, margin: '0 auto'}}>
            <div style={{fontSize: 20, marginBottom: 16, color: '#555'}}>{editId ? '챗봇 수정' : '챗봇 생성 폼'}</div>
            <div style={{marginBottom: 8, color: '#888'}}>챗봇 이름</div>
            <input style={{width: '100%', height: 32, borderRadius: 8, border: '1px solid #bbb', marginBottom: 16, padding: 8}} value={name} onChange={e => setName(e.target.value)} disabled={!!editId} />
            <div style={{marginBottom: 8, color: '#888'}}>페르소나/프롬프트</div>
            <textarea style={{width: '100%', height: 60, borderRadius: 8, border: '1px solid #bbb', marginBottom: 16, padding: 8}} value={persona} onChange={e => setPersona(e.target.value)} />
            <div style={{marginBottom: 8, color: '#888'}}>예시 대화</div>
            <textarea style={{width: '100%', height: 60, borderRadius: 8, border: '1px solid #bbb', marginBottom: 16, padding: 8}} value={example} onChange={e => setExample(e.target.value)} />
            <button className="send-btn" style={{float: 'right', minWidth: 80}} onClick={handleSave}>{editId ? '수정' : '저장'}</button>
            {editId && <button className="send-btn" style={{float: 'right', minWidth: 80, marginRight: 8}} onClick={() => { setEditId(null); setName(''); setPersona(''); setExample(''); setError(''); }}>취소</button>}
            {error && <div className="chat-error" style={{marginTop: 16}}>{error}</div>}
            {infoMsg && <div className="chat-info" style={{marginTop: 16}}>{infoMsg}</div>}
          </div>
        </section>
        {/* 챗봇 목록 */}
        <section className="chat-section" style={{marginTop: 32}}>
          <div style={{background: '#f9fafb', borderRadius: 20, padding: 24, width: '90%', maxWidth: 660, margin: '0 auto'}}>
            <div style={{fontSize: 20, marginBottom: 16, color: '#555'}}>내 챗봇 목록</div>
            {profiles.length === 0 && <div style={{color: '#bbb'}}>등록된 챗봇이 없습니다.</div>}
            {profiles.map(([id, p]) => (
              <div key={id} style={{background: '#fff', border: '1px solid #bbb', borderRadius: 10, padding: 12, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div>
                  <b>{id}</b> <span style={{color: '#888'}}>{p.persona}</span>
                </div>
                <div>
                  <button className="send-btn" style={{marginRight: 8}} onClick={() => handleEdit(id)}>수정</button>
                  <button className="send-btn" style={{marginRight: 8}} onClick={() => handleDelete(id)}>삭제</button>
                  <button className="send-btn" onClick={() => handleShare(id)}>공유</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* 푸터 */}
        <div className="chat-footer">© 2025 챗봇 서비스</div>
      </main>
      <aside className="side-col right-col" aria-hidden="true"></aside>
    </div>
  );
}

export default ChatbotCreatePage;
