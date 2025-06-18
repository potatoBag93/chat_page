import './App.css';
import './styles/CommonUI.css';
import './styles/ChatbotCreatePage.css';
import './styles/Footer.css';
import { useState, useEffect } from 'react';
import { saveChatbotToSupabase, fetchChatbotFromSupabase } from './utils/supabase';
import { useNavigate } from 'react-router-dom';
import ThreeColumnLayout from './components/ThreeColumnLayout';
import { Button, TextField } from '@mui/material';
import CommonHeader from './components/CommonHeader';
import CommonFooter from './components/CommonFooter';
import VisualNovelPreview from './components/VisualNovelPreview';

function ChatbotCreatePage() {
  const [name, setName] = useState('');
  const [persona, setPersona] = useState('');
  const [example, setExample] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [charImageUrl, setCharImageUrl] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null); // 수정 모드용 (UUID)
  const [infoMsg, setInfoMsg] = useState('');
  const [greeting, setGreeting] = useState('안녕하세요! 무엇을 도와드릴까요?');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfilesFromSupabase();
  }, []);

  useEffect(() => {
    // edit 모드로 진입 시 쿼리스트링에서 edit 파라미터 확인
    const params = new URLSearchParams(window.location.search);
    const edit = params.get('edit');
    if (edit) {
      // Supabase에서 해당 챗봇 정보 fetch 후 입력값 세팅
      fetchChatbotFromSupabase(edit).then(p => {
        if (p) {
          setName(p.name || '');
          setPersona(p.persona || '');
          setExample((p.example && p.example[0]?.text) || '');
          setDescription(p.description || '');
          setTags((p.tags || []).join(', '));
          setBgImageUrl(p.bg_image_url || '');
          setCharImageUrl(p.char_image_url || '');
          setGreeting(p.greeting || '안녕하세요! 무엇을 도와드릴까요?');
          setEditId(edit);
          setError('');
          setInfoMsg('수정 모드');
        }
      });
    }
  }, []);

  const fetchProfilesFromSupabase = async () => {
    try {
      const { data } = await fetchChatbotFromSupabase();
      setProfiles(data.map(p => [p.id, p]));
    } catch (e) {
      setProfiles([]);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !persona.trim()) {
      setError('챗봇 이름과 프롬프트는 필수입니다.');
      return;
    }
    const profile = {
      persona,
      name,
      example: example
        ? [
            { role: 'user', text: example },
            { role: 'bot', text: '예시 답변' }
          ]
        : [],
      description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      bg_image_url: bgImageUrl,
      char_image_url: charImageUrl,
      greeting: greeting,
    };
    if (editId) profile.id = editId; // 수정 시 UUID 포함
    try {
      await saveChatbotToSupabase(profile);
      setError('');
      setInfoMsg(editId ? '수정 완료!' : '저장 완료!');
      setName('');
      setPersona('');
      setExample('');
      setDescription('');
      setTags('');
      setBgImageUrl('');
      setCharImageUrl('');
      setGreeting('안녕하세요! 무엇을 도와드릴까요?');
      setEditId(null);
      setTimeout(() => setInfoMsg(''), 1500);
      fetchProfilesFromSupabase();
    } catch (e) {
      setError('저장 실패: ' + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await supabase.from('chatbot_profiles').delete().eq('id', id);
        fetchProfilesFromSupabase();
        setInfoMsg('삭제 완료!');
        setTimeout(() => setInfoMsg(''), 1500);
        if (editId === id) {
          setName(''); setPersona(''); setExample(''); setDescription(''); setTags(''); setBgImageUrl(''); setCharImageUrl(''); setEditId(null);
        }
      } catch (e) {
        setError('삭제 실패: ' + e.message);
      }
    }
  };

  const handleEdit = (id) => {
    const p = profiles.find(([pid]) => pid === id)?.[1];
    if (p) {
      setName(p.name || '');
      setPersona(p.persona || '');
      setExample((p.example && p.example[0]?.text) || '');
      setDescription(p.description || '');
      setTags((p.tags || []).join(', '));
      setBgImageUrl(p.bg_image_url || '');
      setCharImageUrl(p.char_image_url || '');
      setGreeting(p.greeting || '안녕하세요! 무엇을 도와드릴까요?');
      setEditId(id);
      setError('');
      setInfoMsg('수정 모드');
    }
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
        챗봇 생성/관리
        <div style={{fontSize:'1rem', color:'#888', fontWeight:400, marginTop:4}}>ⓘ AI 컨텐츠, 저작권, 개인정보 안내</div>
      </CommonHeader>
      
      <div className="page-actions">
        <Button onClick={() => navigate('/list')}>챗봇 목록 보기</Button>
        <Button onClick={() => navigate('/')}>챗봇 대화로</Button>
      </div>
      
      {/* 생성 폼 */}
      <div className="chatbot-section">
        <div className="form-container">
          <div className="section-title">{editId ? '챗봇 수정' : '챗봇 생성 폼'}</div>
          
          <TextField label="챗봇 이름" value={name} onChange={e => setName(e.target.value)} disabled={!!editId} fullWidth margin="normal" />
          <TextField label="페르소나/프롬프트" value={persona} onChange={e => setPersona(e.target.value)} fullWidth margin="normal" multiline minRows={2} />
          <TextField label="예시 대화" value={example} onChange={e => setExample(e.target.value)} fullWidth margin="normal" multiline minRows={2} />
          <TextField label="챗봇 설명" value={description} onChange={e => setDescription(e.target.value)} fullWidth margin="normal" multiline minRows={2} />
          <TextField label="태그 (콤마로 구분)" value={tags} onChange={e => setTags(e.target.value)} placeholder="예: 상담,테스트" fullWidth margin="normal" />
          <TextField label="배경 이미지 URL" value={bgImageUrl} onChange={e => setBgImageUrl(e.target.value)} placeholder="https://..." fullWidth margin="normal" />
          <TextField label="인물(캐릭터) 이미지 URL" value={charImageUrl} onChange={e => setCharImageUrl(e.target.value)} placeholder="https://..." fullWidth margin="normal" />
          <TextField label="첫 인사말" value={greeting} onChange={e => setGreeting(e.target.value)} fullWidth margin="normal" />
          
          <div className="section-title" style={{marginTop: '24px'}}>이미지 미리보기</div>
          <VisualNovelPreview 
            backgroundUrl={bgImageUrl} 
            characterUrl={charImageUrl} 
            name={name || '챗봇'} 
            latestMessage={{role:'bot', text: greeting}}
            controls={false}
          />
          
          <div className="chatbot-form-buttons" style={{marginTop: '30px', paddingBottom: '20px'}}>
            <Button variant="contained" onClick={handleSave}>{editId ? '수정' : '저장'}</Button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {infoMsg && <div className="info-message">{infoMsg}</div>}
        </div>
      </div>

      <CommonFooter>
        ⓒ 2025 챗봇 서비스 | AI 답변은 참고용, 저작권·개인정보 유의
      </CommonFooter>
    </ThreeColumnLayout>
  );
}

export default ChatbotCreatePage;
