import {
  Controller, Get, Post, Patch, Param, Query, Body,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../common/config/multer.config';
import { ChatService } from './chat.service';
import { StartConversationDto, SendMessageDto, SendOfferDto } from './dto/chat.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('conversations')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  getConversations(@CurrentUser('id') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @Get(':id')
  getConversation(@Param('id') id: string) {
    return this.chatService.getConversation(id);
  }

  @Get(':conversationId/messages')
  getMessages(
    @Param('conversationId') conversationId: string,
    @Query('page') page?: number,
  ) {
    return this.chatService.getMessages(conversationId, page ?? 1);
  }

  @Post(':conversationId/messages')
  sendMessage(
    @CurrentUser('id') userId: string,
    @Param('conversationId') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(conversationId, userId, dto);
  }

  @Post(':conversationId/messages/file')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(
    @CurrentUser('id') userId: string,
    @Param('conversationId') conversationId: string,
    @UploadedFile() file: { filename: string; originalname: string },
  ) {
    return this.chatService.uploadFile(conversationId, userId, `/uploads/${file.filename}`, file.originalname);
  }

  @Post(':conversationId/offer')
  sendOffer(
    @CurrentUser('id') userId: string,
    @Param('conversationId') conversationId: string,
    @Body() offer: SendOfferDto,
  ) {
    return this.chatService.sendOffer(conversationId, userId, offer as unknown as Record<string, unknown>);
  }

  @Patch(':conversationId/read')
  markAsRead(
    @CurrentUser('id') userId: string,
    @Param('conversationId') conversationId: string,
  ) {
    return this.chatService.markAsRead(conversationId, userId);
  }

  @Post()
  startConversation(@CurrentUser('id') userId: string, @Body() dto: StartConversationDto) {
    return this.chatService.startConversation(userId, dto);
  }
}
