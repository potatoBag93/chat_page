import React from 'react';
import ThreeColumnLayout from './components/ThreeColumnLayout';
import CommonHeader from './components/CommonHeader';
import CommonFooter from './components/CommonFooter';
import { Button } from '@mui/material';
import './styles/CommonUI.css';

export default function MainPage() {
  return (
    <ThreeColumnLayout>
      <CommonHeader>
        <div className="chat-title">AI 챗봇 메인페이지</div>
        <div className="chat-info">챗봇을 생성하거나 대화를 시작해보세요!</div>
      </CommonHeader>

      <section className="chat-section" style={{marginTop: 32, textAlign: 'center'}}>
        <h2 style={{fontWeight: 600, fontSize: 28, marginBottom: 16}}>AI 챗봇 서비스에 오신 것을 환영합니다!</h2>
        <p style={{fontSize: 18, color: '#555', marginBottom: 32}}>챗봇을 직접 만들거나, 다양한 챗봇과 대화를 시작해보세요.</p>
        <Button variant="contained" color="primary" sx={{mr:2, fontWeight:600, fontSize:18}} onClick={()=>window.location.href='/chat'}>
          채팅 시작하기
        </Button>
        <Button variant="contained" color="secondary" sx={{fontWeight:600, fontSize:18, background:'#2056b3'}} onClick={()=>window.location.href='/create'}>
          챗봇 생성/관리
        </Button>
      </section>
      <CommonFooter>© 2025 AI 챗봇 서비스</CommonFooter>
    </ThreeColumnLayout>
  );
}
