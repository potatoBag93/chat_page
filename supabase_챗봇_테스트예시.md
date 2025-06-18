# Supabase 챗봇 생성/저장/로드 테스트 예시

아래는 Supabase 연동 챗봇 저장/불러오기 테스트용 예시입니다.

---

## 1. 챗봇 예시 데이터 (JSON)
```json
{
  "id": "testbot1", // 챗봇 이름(고유값, 예: testbot1)
  "persona": "친절한 상담원", // 프롬프트/페르소나 (예: 친절한 상담원)
  "example": [
    { "role": "user", "text": "안녕?" }, // 예시 대화(사용자)
    { "role": "bot", "text": "안녕하세요! 무엇을 도와드릴까요?" } // 예시 대화(챗봇)
  ],
  "description": "테스트용 챗봇입니다.", // 챗봇 설명
  "tags": ["상담", "테스트"], // 태그(문자열 배열)
  "bg_image_url": "https://example.com/bg.png", // 배경 이미지 URL
  "char_image_url": "https://example.com/char.png" // 인물(캐릭터) 이미지 URL
}
```

### 입력 예시 설명
- **id**: 챗봇 이름(고유값, 예: `testbot1`, `mybot`, `상담챗봇` 등)
- **persona**: 챗봇의 성격/프롬프트 (예: `친절한 상담원`, `밝고 명랑한 친구` 등)
- **example**: 예시 대화 (사용자/챗봇의 샘플 대화)
- **description**: 챗봇 설명 (간단한 소개)
- **tags**: 태그(검색/분류용, 예: `["상담", "테스트"]`)
- **bg_image_url**: 배경 이미지 주소
- **char_image_url**: 인물(캐릭터) 이미지 주소

---

## 2. 저장 테스트 코드 예시
```js
import { saveChatbotToSupabase } from './src/utils/supabase';

const testProfile = {
  id: 'testbot1',
  persona: '친절한 상담원',
  example: [
    { role: 'user', text: '안녕?' },
    { role: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' }
  ],
  description: '테스트용 챗봇입니다.',
  tags: ['상담', '테스트'],
  bg_image_url: 'https://example.com/bg.png',
  char_image_url: 'https://example.com/char.png'
};

saveChatbotToSupabase(testProfile)
  .then(() => console.log('저장 성공'))
  .catch(e => console.error('저장 실패', e));
```

## 3. 로드 테스트 코드 예시
```js
import { fetchChatbotFromSupabase } from './src/utils/supabase';

fetchChatbotFromSupabase('testbot1')
  .then(data => console.log('불러온 챗봇:', data))
  .catch(e => console.error('불러오기 실패', e));
```

---

- 위 예시를 참고해 실제 프로젝트 코드에 적용/테스트할 수 있습니다.
- id, persona, 예시, 이미지 등 원하는 값으로 변경해 테스트하세요.
