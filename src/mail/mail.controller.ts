import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { ContactUsRequestDto } from './dto/contact-us-request.dto';

@ApiTags('Email')
@Controller('email')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @ApiBody({ type: ContactUsRequestDto })
    @Post()
    async sendEmail(@Body() contactUsRequestDto: ContactUsRequestDto) {
        const { firstName, lastName, phone, email, message } = contactUsRequestDto;
        const mailToClient = {
            to: email,
            subject: 'Trip-App! Notification',
            from: process.env.EMAIL_SENDER,
            text: 'Thank you for your email. We have received it and are currently working on providing you with a response as soon as possible.',
            html: `<p><b>Dear ${firstName} ${lastName},<b></p>
            <p>Thank you for your email. We have received it and are currently working on providing you with a response as soon as possible.<p>
            <p>Your patience is greatly appreciated.</p>
            <p>Best regards, trip-app team</p>`,
        };

        const mailToOwner = {
            to: process.env.EMAIL_GETTER,
            subject: 'Trip-App! Notification',
            from: process.env.EMAIL_SENDER,
            text: 'Thank you for your email. We have received it and are currently working on providing you with a response as soon as possible.',
            html: `<p>Name: ${firstName} ${lastName},</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Message: ${message}</p>`,
        };

        const resultMailToOwner = await this.mailService.send(mailToOwner);
        const resultMailToClient = await this.mailService.send(mailToClient);

        console.log({ resultMailToOwner, resultMailToClient });
        return { resultMailToOwner, resultMailToClient };
    }
}
