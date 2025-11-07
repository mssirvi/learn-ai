export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  ts: number;
};

class ChatStore {
  private static instance: ChatStore;
  private chats = new Map<string, ChatMessage[]>();

  private constructor() {}

  public static getInstance(): ChatStore {
    if (!ChatStore.instance) {
      ChatStore.instance = new ChatStore();
    }
    return ChatStore.instance;
  }

  public createChat(chatId: string) {
    if (!this.chats.has(chatId)) this.chats.set(chatId, []);
  }

  public appendMessage(chatId: string, msg: ChatMessage) {
    const arr = this.chats.get(chatId) ?? [];
    arr.push(msg);
    this.chats.set(chatId, arr);
  }

  public updateLastAssistantMessageAppend(chatId: string, chunk: string) {
    const arr = this.chats.get(chatId);
    if (!arr || arr.length === 0) return;
    // find last assistant message from the end
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].role === 'assistant') {
        arr[i].content = (arr[i].content || '') + chunk;
        this.chats.set(chatId, arr);
        return;
      }
    }
    // if none found, append a new assistant message
    this.appendMessage(chatId, { role: 'assistant', content: chunk, ts: Date.now() });
  }

  public getMessages(chatId: string) {
    return this.chats.get(chatId) ?? [];
  }

  public getLastNMessages(chatId: string, n = 10) {
    const arr = this.chats.get(chatId) ?? [];
    return arr.slice(-n);
  }

  public clearChat(chatId: string) {
    this.chats.delete(chatId);
  }
}

export const chatStore = ChatStore.getInstance();