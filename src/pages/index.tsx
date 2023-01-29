import Head from 'next/head'
import {weekdays, monthName, monthArray, currentDay} from "../../utils/calendar";
import { useRouter } from "next/router";



export default function Home() {
    const router = useRouter();


    function sendDay(date: number) {
        if (date < Number(currentDay)) {
            return;
        } else {
            router.push({
                pathname: '/select-time',
                query: {
                    day: date
                }
            });
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
          <div className="mb-6 app-details">
              <h1 className="title">TimeReq</h1>
              <p className="description">Request time on my calendar. Please fill out all the info during the process.</p>
          </div>
          <h2 className="label-title">{monthName}</h2>
          <div className="month-grid">
              {weekdays.map((day, index) => {
                  return <div className="font-bold" key={index}>{day}</div>
              })}

              {monthArray.map((date, index) => {
                 return( <div className={Number(date) < new Date().getDate() ? "date-muted" : "day"} onClick={() => sendDay(date)} key={index}>{date}</div> )
              })}
          </div>
      </div>
      </main>
    </>
  )
}
