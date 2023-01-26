import createHandler from "next-connect"
const ics = require('ics');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

const handler = createHandler();
export default handler;

// Set your SendGrid API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

// Receive a POST request from the client.
handler.post(async (req, res) => {
    const {appointment, name, email, message} = JSON.parse(req.body);



    const event = {
        start: appointment,
        duration: {hours: 0, minutes: 30},
        title: "Chris_x_" + name + "_Meeting",
        description: message,
        location: "Google Meet or Zoom",
        status: "CONFIRMED",
        busyStatus: "BUSY",
        organizer: {name: "Chris Loggins", email: "chris@loggins.cc"},
        attendees: [
            {
                name,
                email,
                rsvp: true,
                partstat: "ACCEPTED",
                role: "REQ-PARTICIPANT",
            },
        ],
    };

    const {error, value} = ics.createEvent(event);
    if (error) {
        console.log(error);
        return;
    }

    // Save the file to the file system
    const filename = path.join(process.cwd(), 'public/invites', `${event.start.join('')}_invite.ics`);
    fs.writeFileSync(filename, value);

    const attachment = fs.readFileSync(filename).toString("base64");

    // Send the email with the attachment
    const msg = {
        to: 'chris@loggins.cc',
        from: 'chris@loggins.cc',
        subject: `Meeting Invitation: Chris & ${name}` ,
        text: `Message: ${message}`,
        attachments: [
            {
                content: attachment,
                filename: `${event.start.join('')}_invite.ics`,
                type: 'text/calendar',
            }
        ]
    };

    await sgMail.send(msg);

    // Return the download link to the client
    res.status(200).json({message: "Thank you! Please look out for the invite in your email."});

});