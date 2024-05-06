
import { model, Schema } from "mongoose";
import { ConversationDocument } from "./conversationType";

const ConversationSchema = new Schema<ConversationDocument>(
  {
    members: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      required: true,
    },
  
  },
  { timestamps: true }
);

const Conversation = model<ConversationDocument>(
  "Conversation",
  ConversationSchema
);

export default Conversation;
