import {useRouter} from "next/router";
import Head from "next/head";
import {month, year} from "../../utils/calendar";
// @ts-ignore
import dbPromise, { jsonify } from "../../utils/db";


const times = [
    { time: 9, alias: "09:00" },
    { time: 10, alias: "10:00" },
    { time: 11, alias: "11:00" },
    { time: 12, alias: "12:00" },
    { time: 13, alias: "1:00" },
    { time: 14, alias: "2:00" },
    { time: 15, alias: "3:00" },
    { time: 16, alias: "4:00" },
    { time: 17, alias: "5:00" },
];

export default function SelectTime({ data }: any) {
    const router = useRouter();

    const {
        query: { day },
    } = router;

    const props = {
        day,
    };

    function checkTimes(time: number) {
        const wantedAppt = [Number(year), Number(month), Number(props.day), time, 0];
        const currentDayLogic =
            Number(props.day) === new Date().getDate() && new Date().getHours() >= time;

        for (const appt of data) {
            if (JSON.stringify(appt.start) === JSON.stringify(wantedAppt) || currentDayLogic) {
                return true;
            }
        }
        return false;
    }

    async function sendAppointment(time: number) {
        const wantedAppt = [Number(year), Number(month), Number(props.day), time, 0];
        const currentDayLogic =
            Number(props.day) === new Date().getDate() && new Date().getHours() >= time;

        const filteredMeetings = data.filter(
            (appt: any) => JSON.stringify(appt.start) === JSON.stringify(wantedAppt)
        );

        if (filteredMeetings.length !== 0 || currentDayLogic) {
            return;
        }

        await router.push({
            pathname: "/add-details",
            query: {
                time,
                day: props.day,
            },
        });
    }

    return (
        <>
            <Head>
                <title>TimeReq - Request Time</title>
                <meta name="description" content="Request time on the calendar of Chris." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>

               <div className="wrapper">
                   <div className="mb-6 app-details">
                       <p className="description">Select a time. Taken slots are grayed out.</p>
                   </div>
                   <div className={Number(props.day) === new Date().getDate() && new Date().getHours() >= 17 ? "booking-notice" : "hidden"}>Scheduling is finished for today!</div>
                   <h1 className="label-title">Select A Time</h1>
                   <div className="times">
                       {times.map((time, index) => {
                           return (
                               <div key={index} onClick={() => sendAppointment(time.time)} className={checkTimes(time.time) ? "time-muted" : "time"}>
                                   {time.alias}
                               </div>
                           )
                       })}
                   </div>
               </div>
            </main>

        </>
    )
}

export async function getServerSideProps() {
    // Fetch data from external API
    async function getMeetings() {
        // @ts-ignore
        return await (await dbPromise)
            .db()
            .collection("meetings")
            .find()
            .toArray();
    }

    const data = await getMeetings();

    // Pass data to the page via props
    return { props: { data: jsonify(data) } }
}