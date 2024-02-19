import { ClientResponse, MailDataRequired } from '@sendgrid/mail';
import * as SendGridService from '@sendgrid/mail';
import { Injectable, Logger } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class MailService {
    private logger: Logger;
    constructor() {
        this.logger = new Logger(MailService.name);
        SendGridService.setApiKey(process.env.SEND_GRID_API_KEY);
    }

    async send(mail: MailDataRequired): Promise<[ClientResponse, {}]> {
        const clientResponse = await SendGridService.send(mail);
        return clientResponse;
    }
}
