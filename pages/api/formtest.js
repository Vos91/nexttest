// Require:
var postmark = require('postmark');

// Send an email:
var client = new postmark.ServerClient('fd70786d-1497-44bd-ae22-515d0717cd11');

client.sendEmail({
  From: 'info@webwinkels.nl',
  To: 'jasper@mediasolutions.nl',
  Subject: 'Hello from Postmark',
  HtmlBody: '<strong>Hello</strong> dear Postmark user.',
  TextBody: 'Hello from Postmark!',
  MessageStream: 'outbound',
});
