import { Module,  Global  } from '@nestjs/common';
import { ResponseService } from './response.service';

@Global()
@Module({
  imports: [
  ],
  providers: [
    ResponseService,
  ],
  controllers: [],
  exports: [ResponseService],
})
export class ResponseModule {}
