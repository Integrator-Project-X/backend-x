import { Module, Global} from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SupabaseStorageService } from './storage.service';

@Global()
@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  ],
  providers: [SupabaseStorageService],
  exports: [SupabaseStorageService],
})
export class StorageModule {}
