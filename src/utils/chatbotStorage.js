// 챗봇 프롬프트/페르소나 LocalStorage 유틸리티

const STORAGE_KEY = 'chatbot_profiles';

// 챗봇 정보 저장 (id: string, data: object)
export function saveChatbotProfile(id, data) {
  const all = getAllChatbotProfiles();
  all[id] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

// 챗봇 정보 조회 (id: string)
export function getChatbotProfile(id) {
  const all = getAllChatbotProfiles();
  return all[id] || null;
}

// 모든 챗봇 정보 조회
export function getAllChatbotProfiles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

// 예시 데이터 등록
export function seedExampleProfile() {
  saveChatbotProfile('demo', {
    persona: '여행 도우미',
    prompt: '여행 관련 질문에 친절하게 답변해주는 챗봇',
    example: [
      { role: 'bot', text: '안녕하세요! 여행 도우미 챗봇입니다.' },
      { role: 'user', text: '파리 여행 추천 좀 해주세요.' },
      { role: 'bot', text: '파리의 명소로는 에펠탑, 루브르 박물관 등이 있습니다.' }
    ]
  });
}
