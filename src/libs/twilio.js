import twilio from 'twilio';
import { twilioConfig } from '../config/config.js';

const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

export default client;