import { Module } from '@nestjs/common';
import { JobpositionController } from './jobposition.controller';
import { JobpositionService } from './jobposition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPosition } from './entities/jobposition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPosition])],
  controllers: [JobpositionController],
  providers: [JobpositionService]
})
export class JobpositionModule {}
