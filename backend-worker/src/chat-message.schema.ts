import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ChatMessage extends Document {
    @Prop({ required: true })
    sender: string;

    @Prop({ required: true })
    receiver: string;

    @Prop({ required: true })
    message: string;

    @Prop()
    timestamp: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
