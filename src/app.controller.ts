import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  testing() {
    return { message: 'testing quick chance' };
  }
}
