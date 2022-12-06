/**
 * The Postmark service functionality.
 *
 * @link https://postmarkapp.com/send-email/node
 */
const postmark = require('postmark');

// Client for the Postmark service.
const postmarkApp = new postmark.ServerClient(process.env.SERVICE_API);

/**
 * Server-side functionality of the Contact page.
 *
 * @link https://nextjs.org/docs/api-routes/introduction
 */
export default async function handler(request, resesponse) {
  // Check the current request method.
  if ('POST' !== request.method) {
    return resesponse
      .status(405)
      .send(`${request.method} requests are not allowed.`);
  }

  // Data from a contact form.
  const { name, email, subject, message, inspector } = request.body;

  // Prevent spam from bots (Honeypot technique).
  if (inspector) {
    return resesponse.status(400).send('Message not sent.');
  }

  // Make sure we have the sender's name.
  if (!name || '' === name) {
    return resesponse.status(400).send('Message not sent.');
  }

  // Make sure email address is added.
  if (!email || '' === email) {
    return resesponse.status(400).send('Message not sent.');
  }

  // Make sure the email has a subject.
  if (!subject || '' === subject) {
    return resesponse.status(400).send('Message not sent.');
  }

  // Make sure email has a content.
  if (!message || '' === message) {
    return resesponse.status(400).send('Message not sent.');
  }

  try {
    // Information about the actual sender, which includes email address and name.
    const messageInfo = `\n---\n>>>from: ${email}\n>>>name: ${name}`;

    // Send email using Postmark API.
    const postmarkResponse = await postmarkApp.sendEmail({
      From: process.env.POSTMARK_EMAIL_FROM,
      To: process.env.POSTMARK_EMAIL_TO,
      Subject: subject,
      TextBody: message + messageInfo,
      MessageStream: 'outbound',
    });

    // Check if the email was sent without any issues.
    if (!postmarkResponse.ErrorCode) {
      resesponse.status(200).send('Message sent successfully.');
    } else {
      resesponse.status(400).send('Message not sent.');
    }
  } catch (error) {
    resesponse.status(400).send('Message not sent.');
  }
}
