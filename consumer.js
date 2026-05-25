require('dotenv').config();
const amqp = require('amqplib');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const pool = new Pool();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const processApplication = async (applicationId) => {
  // Tidak try-catch di sini — biarkan error naik ke atas
  const { rows: appRows } = await pool.query(
    `SELECT a.id, a.created_at, a.job_id,
            u.email AS applicant_email,
            u.fullname AS applicant_name
     FROM applications a
     JOIN users u ON a.user_id = u.id
     WHERE a.id = $1`,
    [applicationId]
  );

  if (!appRows.length) throw new Error(`Application ${applicationId} not found`);

  const application = appRows[0];

  const { rows: jobRows } = await pool.query(
    `SELECT j.title, u.email AS owner_email, u.fullname AS owner_name
     FROM jobs j
     JOIN companies c ON j.company_id = c.id
     JOIN users u ON c.owner_id = u.id
     WHERE j.id = $1`,
    [application.job_id]
  );

  if (!jobRows.length) throw new Error(`Job not found for application ${applicationId}`);

  const job = jobRows[0];

  // Ini akan throw error jika gagal kirim email
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: job.owner_email,
    subject: `New Application for ${job.title}`,
    html: `
      <h2>New Job Application Received</h2>
      <p>Hello ${job.owner_name},</p>
      <p>Someone has applied for your job posting <strong>${job.title}</strong>.</p>
      <h3>Applicant Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${application.applicant_name}</li>
        <li><strong>Email:</strong> ${application.applicant_email}</li>
        <li><strong>Applied at:</strong> ${new Date(application.created_at).toLocaleString()}</li>
      </ul>
      <p>Login to your account to review the application.</p>
    `,
  });

  console.log(`Email sent to ${job.owner_email} for application ${applicationId}`);
};

const start = async () => {
  try {
    const connection = await amqp.connect({
      hostname: process.env.RABBITMQ_HOST,
      port: process.env.RABBITMQ_PORT,
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD,
    });

    const channel = await connection.createChannel();
    await channel.assertQueue('applications', { durable: true });
    channel.prefetch(1);

    console.log('Consumer waiting for messages...');

    channel.consume('applications', async (msg) => {
      if (msg) {
        const { application_id } = JSON.parse(msg.content.toString());
        console.log(`Processing application: ${application_id}`);
        try {
          await processApplication(application_id);
          channel.ack(msg); // Sukses → hapus dari antrean
        } catch (err) {
          console.error(`Failed to process application ${application_id}:`, err.message);
          // Gagal → kembalikan ke antrean (requeue: true)
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (err) {
    console.error('Consumer error:', err.message);
    setTimeout(start, 5000); // Retry connect setelah 5 detik
  }
};

start();