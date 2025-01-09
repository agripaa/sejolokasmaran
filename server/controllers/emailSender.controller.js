const nodemailer = require('nodemailer');
const cron = require('node-cron');
const dataSender = require('../data/email'); 
const EmailLog = require('../models/EmailLog');
const moment = require('moment-timezone');
require('dotenv').config();

async function sendEmail(to, subject, body) {
    console.log(`Mengirim email ke: ${to}, Subject: ${subject}`);
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.PASS_EMAIL_SENDER,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to,
        subject,
        html: body,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email berhasil dikirim ke ${to}`);
    } catch (error) {
        console.error(`Gagal mengirim email: ${error.message}`);
    }
}

function createEmailTemplate(visit, date) {
    return `
        <h3>Pengingat Jadwal Kunjungan Si Kecil 💖</h3>
        <p>Halo Ibu/Bapak,</p>
        <p>Kami ingin mengingatkan bahwa si kecil memiliki jadwal kunjungan penting:</p>
        <h4>${visit.title}</h4>
        <p>Tanggal: ${moment(date).format('D MMMM YYYY HH:mm')}</p>
        <ul>
            ${visit.point.map(point => `<li>${point}</li>`).join('')}
        </ul>
        <p>Salam,<br>Tim SejoliKasmaran</p>
    `;
}

async function scheduleEmailsForUser(birthDate, userId, email) {
    const baseDate = moment(birthDate);

    console.log(`Menjadwalkan email untuk user: ${email}`);

    cron.schedule('* * * * *', async () => {
        console.log(`Scheduler berjalan setiap menit untuk user: ${email}`);
        
        for (const category of dataSender.schedule) {
            for (const visit of category.visits) {
                const sendDate = baseDate.clone().add(moment.duration(visit.time_after_birth));

                // Periksa apakah sendDate >= waktu sekarang
                if (sendDate.isSameOrAfter(moment().tz('Asia/Jakarta'), 'minute')) {
                    const logExists = await EmailLog.findOne({
                        where: {
                            user_id: userId,
                            visit_title: visit.title,
                            send_date: sendDate.toDate(),
                        },
                    });

                    if (!logExists) {
                        await sendEmail(
                            email,
                            `Pengingat Jadwal Kunjungan: ${visit.title}`,
                            createEmailTemplate(visit, sendDate)
                        );

                        await EmailLog.create({
                            user_id: userId,
                            visit_title: visit.title,
                            send_date: sendDate.toDate(),
                        });

                        console.log(`Email terkirim untuk ${visit.title} pada ${sendDate.format('D MMMM YYYY HH:mm')}`);
                    } else {
                        console.log(`Email untuk ${visit.title} pada ${sendDate.format('D MMMM YYYY HH:mm')} sudah pernah dikirim.`);
                    }
                } else {
                    console.log(`Belum saatnya mengirim email untuk ${visit.title}.`);
                }
            }
        }
    });    
}

module.exports = {
    scheduleEmailsForUser,
};
