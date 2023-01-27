import {useRouter} from "next/router";
import {useState, useEffect} from "react"
import Head from "next/head";
import {month, year, currentDay} from "../../utils/calendar";
// @ts-ignore
import dbPromise, { jsonify } from "../../utils/db";


const times = [
    {time: 9, alias: "09:00"},
    {time: 10, alias: "10:00"},
    {time: 11, alias: "11:00"},
    {time: 12, alias: "12:00"},
    {time: 13, alias: "1:00"},
    {time: 14, alias: "2:00"},
    {time: 15, alias: "3:00"},
    {time: 16, alias: "4:00"},
    {time: 17, alias: "5:00"},
]

export default function SelectTime({data}: any) {
    const [booking, setBooking] = useState<string>("");

    const router = useRouter();

    const {
        query: {day}
    } = router;

    const props = {
        day
    }


    useEffect(() => {
        if (new Date().getHours() > 17 && Number(props.day) === Number(currentDay)) {
            setBooking("Sorry, there is no more booking for today!")
        }
    }, )



    function checkTimes(time: number) {

        const wantedAppt = [Number(year), Number(month), Number(props.day), time, 0];
        const currentDayLogic = Number(props.day) === new Date().getDate() && new Date().getHours() >= time;

        for (let i = 0; i < data.length; i++) {
            if (JSON.stringify(data[i].start) === JSON.stringify(wantedAppt) || currentDayLogic) {
                return true;
            } else {
                return false;
            }
        }
    }



    async function sendAppointment(time: number) {
        const wantedAppt = [Number(year), Number(month), Number(props.day), time, 0]
        const currentDayLogic = Number(props.day) === new Date().getDate() && new Date().getHours() >= time;

       let filteredMeetings = [];
       for(let i=0;i<data.length;i++) {
           if(JSON.stringify(data[i].start) === JSON.stringify(wantedAppt)) {
               filteredMeetings.push(data[i]);
           }
       }

       if (filteredMeetings.length !== 0 || currentDayLogic) {
           return;
        } else {
            await router.push({
                pathname: '/add-details',
                query: {
                    time,
                    day: props.day,
                }
            })
        }

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
                   <div className={booking === "" ? "" : "booking-notice"}>{booking}</div>
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
    return { props: { data:jsonify(data) } }
}