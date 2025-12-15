import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';


@Injectable()
export class SupabaseStorageService {
    private supabase: SupabaseClient;
    private bucket: string;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        this.bucket = process.env.SUPABASE_BUCKET!;
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new Error('No file provided');
        }

        const ext = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const filePath = `uploads/${fileName}`;

        const { error } = await this.supabase.storage
            .from(this.bucket)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) throw new Error('Error uploading file: ' + error.message);

        const { data } = this.supabase.storage
            .from(this.bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
}
