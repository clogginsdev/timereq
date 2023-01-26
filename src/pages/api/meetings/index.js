import createHandler from "next-connect";
import dbPromise, { jsonify } from "../../../../utils/db";

const handler = createHandler();
export default handler;


export async function getMeetings() {
    return await (await dbPromise)
        .db()
        .collection("meetings")
        .find()
        .toArray();
}

handler.get(async (req, res) => {
    return res.json(await getMeetings());
});

handler.post(async (req, res) => {
    const { appointment, email, name, message } = JSON.parse(req.body);


    const { insertedId } = await (
        await dbPromise
    )
        .db()
        .collection("meetings")
        .insertOne({
            start: appointment,
            duration: { hours: 0, minutes: 30 },
            title: "Chris x " + name + " Meeting",
            message,
            location: "Google Meet or Zoom",
            status: "CONFIRMED",
            busyStatus: "BUSY",
            organizer: { name: "Chris Loggins", email: "chris@loggins.cc" },
            attendees: [
                {
                    name,
                    email,
                    rsvp: true,
                    partstat: "ACCEPTED",
                    role: "REQ-PARTICIPANT",
                },
            ],
        });
    res.json({ _id: insertedId });
});