import Conversation from "../models/chat/conversation";
import { ConversationDocument } from "../models/chat/conversationType";
import Message from "../models/chat/message";


export class conversationRepo{
  
    async findOneByMember(memberId: string): Promise<ConversationDocument | null> {
      const conversation =   Conversation.findOne({ members: memberId });
      return conversation
      }
    
      async create(members: string[]): Promise<ConversationDocument> {
        return Conversation.create({ members });
      }




}