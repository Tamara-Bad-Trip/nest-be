import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendEmailToCustomer(firstName, lastName, email) {
        await this.mailerService.sendMail({
            to: email,
            from: process.env.OWNER_EMAIL,
            subject: 'Trip-App! Notification',
            template: './user-message',
            context: {
                firstName,
                lastName,
            },
        });
    }

    async sendEmailToSupport(firstName, lastName, email, phone, question) {
        await this.mailerService.sendMail({
            to: process.env.OWNER_EMAIL,
            from: `${email}`,
            subject: 'Question from customer',
            template: './support-message',
            context: {
                firstName,
                lastName,
                email,
                phone,
                question,
            },
        });
    }
}
