import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { ContactUsRequestDto } from './dto/contact-us-request.dto';

@ApiTags('Email')
@Controller('email')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @ApiBody({ type: ContactUsRequestDto })
    @Post()
    async update(@Body() contactUsRequestDto: ContactUsRequestDto) {
        try {
            const { firstName, lastName, phone, email, question } = contactUsRequestDto;
            this.mailService.sendEmailToSupport(firstName, lastName, email, phone, question);
            this.mailService.sendEmailToCustomer(firstName, lastName, email);
        } catch (error) {
            console.error('Error updating point:', error);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
