import { Observable } from '@nativescript/core';
import { ChatService } from '../../services/chat.service';
import { encryptMessage, decryptMessage } from '../../utils/security';

export class ChatViewModel extends Observable {
    private chatService: ChatService;
    public messages: any[] = [];
    public messageText: string = '';
    public matchProfile: any;

    constructor(matchId: string, matchProfile: any) {
        super();
        this.chatService = new ChatService();
        this.matchProfile = matchProfile;
        this.initializeChat(matchId);
    }

    private initializeChat(matchId: string) {
        this.chatService.getConversation(matchId).subscribe(messages => {
            this.messages = messages.map(msg => ({
                ...msg,
                content: decryptMessage(msg.content)
            }));
            this.notifyPropertyChange('messages', this.messages);
        });
    }

    async onSendMessage() {
        if (!this.messageText.trim()) return;

        const encryptedMessage = encryptMessage(this.messageText);
        await this.chatService.sendMessage(
            this.matchProfile.matchId,
            firebase().auth().currentUser?.uid || '',
            encryptedMessage
        );

        this.messageText = '';
        this.notifyPropertyChange('messageText', '');
    }

    onMoreOptions() {
        // Implement chat options menu
    }
}