import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AuditLog extends Document {
    @Prop({ required: true })
    task_type: string;

    @Prop()
    user_email: string;

    @Prop({ type: Object })
    payload: any;

    @Prop({ default: 'COMPLETED' })
    status: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);