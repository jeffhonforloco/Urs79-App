import { firebase } from '@nativescript/firebase-core';
import { Encryption } from '../../utils/security/encryption';
import { CacheManager } from '../../utils/cache/cache-manager';

export class MessageHandlerService {
  private static readonly MESSAGE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static async sendMessage(matchId: string, senderId: string, content: string): Promise<void> {
    try {
      const encryptedContent = Encryption.encrypt(content);
      
      await firebase().firestore()
        .collection('conversations')
        .doc(matchId)
        .collection('messages')
        .add({
          senderId,
          content: encryptedContent,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          status: 'sent'
        });

      // Update last message in match
      await firebase().firestore()
        .collection('matches')
        .doc(matchId)
        .update({
          lastMessage: {
            content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            senderId
          }
        });
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  static async getMessages(matchId: string, limit: number = 50): Promise<any[]> {
    const cacheKey = `messages_${matchId}`;
    const cachedMessages = CacheManager.get(cacheKey);
    
    if (cachedMessages) {
      return cachedMessages;
    }

    try {
      const snapshot = await firebase().firestore()
        .collection('conversations')
        .doc(matchId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          content: Encryption.decrypt(data.content)
        };
      });

      CacheManager.set(cacheKey, messages, this.MESSAGE_CACHE_TTL);
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  }
}