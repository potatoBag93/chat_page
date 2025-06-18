import React, { useState, useEffect } from 'react';
import '../styles/VisualNovelPreview.css';
import Button from './UI/Button';

const VisualNovelPreview = ({ 
  backgroundUrl, 
  characterUrl, 
  name = '캐릭터',
  latestMessage = null,
  controls = true,
  style = {}
}) => {
  const [characterPosition, setCharacterPosition] = useState('center'); // 'left', 'center', 'right'
  const [dialogText, setDialogText] = useState('안녕하세요! 저는 챗봇입니다. 무엇을 도와드릴까요?');
  
  // 최신 메시지가 전달되면 대화창에 표시
  useEffect(() => {
    if (latestMessage && latestMessage.role === 'bot' && latestMessage.text) {
      setDialogText(latestMessage.text);
    }
  }, [latestMessage]);
  
  // 배경 또는 캐릭터 이미지가 없을 때의 처리
  const hasBackgroundImage = backgroundUrl && backgroundUrl.trim() !== '';
  const hasCharacterImage = characterUrl && characterUrl.trim() !== '';
  
  // 이미지 로딩 에러 처리
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };
  
  return (
    <>
      <div className="vn-scene-container" style={style}>
        {hasBackgroundImage ? (
          <div 
            className="vn-background"
            style={{ backgroundImage: `url(${backgroundUrl})` }}
          />
        ) : (
          <div className="vn-background" style={{ 
            background: 'linear-gradient(120deg, #dbeafe 0%, #93c5fd 100%)' 
          }} />
        )}
        
        {hasCharacterImage && (
          <img 
            className={`vn-character ${characterPosition}`}
            src={characterUrl}
            alt={name}
            onError={handleImageError}
          />
        )}
        
        <div className="vn-dialog-box">
          <div className="vn-character-name">{name}</div>
          <div className="vn-dialog-text">{dialogText}</div>
        </div>
        
        {!hasBackgroundImage && !hasCharacterImage && (
          <div className="vn-empty-state">
            <div className="vn-empty-icon">🖼️</div>
            <p>배경 이미지와 캐릭터 이미지를 설정해주세요</p>
          </div>
        )}
      </div>
      
      {controls && (
        <div className="vn-preview-controls">
          <div className="position-buttons">
            <Button 
              onClick={() => setCharacterPosition('left')} 
              style={{ opacity: characterPosition === 'left' ? 1 : 0.7 }}
            >
              왼쪽
            </Button>
            <Button 
              onClick={() => setCharacterPosition('center')} 
              style={{ opacity: characterPosition === 'center' ? 1 : 0.7 }}
            >
              중앙
            </Button>
            <Button 
              onClick={() => setCharacterPosition('right')} 
              style={{ opacity: characterPosition === 'right' ? 1 : 0.7 }}
            >
              오른쪽
            </Button>
          </div>
          
          <Button onClick={() => setDialogText('안녕하세요! 무엇을 도와드릴까요?')}>
            대화 리셋
          </Button>
        </div>
      )}
    </>
  );
};

export default VisualNovelPreview;
