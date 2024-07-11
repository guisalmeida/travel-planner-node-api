import nodemailer from 'nodemailer';

export const getMailClient = async () => {
    const account = await nodemailer.createTestAccount();

    const configOptions = {
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass
        }
    }

    const transporter = nodemailer.createTransport(configOptions);
    return transporter;
}