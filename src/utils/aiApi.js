// AI 챗봇 API 연동 예시 (OpenAI GPT-3.5 등)
// 실제 서비스에서는 API 키/엔드포인트를 환경변수 등으로 분리 필요

export async function fetchChatbotReply({ messages, persona, prompt, name }) {
  // 예시: OpenAI Chat API 포맷
  const apiUrl = import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // 메시지 포맷 변환
  const systemContent =
    (name ? `[챗봇 이름: ${name}] ` : '') +
    (persona || '') + ' ' + (prompt || '');
  const chatMessages = [
    { role: 'system', content: systemContent.trim() },
    ...messages.map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }))
  ];

  const body = {
    model: 'gpt-4.1-mini',
    messages: chatMessages,
    temperature: 0.7
  };

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error('AI API 호출 실패');
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}
