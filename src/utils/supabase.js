// src/utils/supabase.js
import { createClient } from '@supabase/supabase-js';

// 환경변수 또는 직접 입력 (보안상 .env 사용 권장)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 챗봇 저장 (insert or update)
export async function saveChatbotToSupabase(profile) {
  // profile: { id, persona, example, description, tags, bg_image_url, char_image_url, user_id }
  const { data, error } = await supabase
    .from('chatbot_profiles')
    .upsert([profile], { onConflict: ['id'] });
  if (error) throw error;
  return data;
}

// id로 챗봇 1개 가져오기
export async function fetchChatbotFromSupabase(id) {
  if (id) {
    const { data, error } = await supabase
      .from('chatbot_profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  } else {
    // id 없으면 전체 목록 반환
    const { data, error } = await supabase
      .from('chatbot_profiles')
      .select('*');
    if (error) throw error;
    return { data };
  }
}

// name(챗봇 이름)으로 챗봇 1개 가져오기
export async function fetchChatbotByName(name) {
  const { data, error } = await supabase
    .from('chatbot_profiles')
    .select('*')
    .eq('name', name)
    .single();
  if (error) throw error;
  return data;
}
