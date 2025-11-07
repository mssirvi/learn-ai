export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  ts: number;
};

const chats = new Map<string, ChatMessage[]>();

export function createChat(chatId: string) {
  if (!chats.has(chatId)) chats.set(chatId, []);
}

export function appendMessage(chatId: string, msg: ChatMessage) {
  const arr = chats.get(chatId) ?? [];
  arr.push(msg);
  chats.set(chatId, arr);
}

export function updateLastAssistantMessageAppend(chatId: string, chunk: string) {
  const arr = chats.get(chatId);
  if (!arr || arr.length === 0) return;
  // find last assistant message from the end
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].role === 'assistant') {
      arr[i].content = (arr[i].content || '') + chunk;
      chats.set(chatId, arr);
      return;
    }
  }
  // if none found, append a new assistant message
  appendMessage(chatId, { role: 'assistant', content: chunk, ts: Date.now() });
}

export function getMessages(chatId: string) {
  return chats.get(chatId) ?? [];
}

export function getLastNMessages(chatId: string, n = 10) {
  const arr = chats.get(chatId) ?? [];
  return arr.slice(-n);
}

export function clearChat(chatId: string) {
  chats.delete(chatId);
}
