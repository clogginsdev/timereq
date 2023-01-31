import Head from 'next/head';
import { weekdays, monthName, monthArray, currentDay } from '../../utils/calendar';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();

    const sendDay = (date: number) => {
        return date >= Number(currentDay)
            ? router.push({
                pathname: '/select-time',
                query: { day: date },
            })
            : undefined;
    };

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
                        <p className="description">
                            Request time on my calendar. Please fill out all the info during the process.
                        </p>
                    </div>
                    <h2 className="label-title">{monthName}</h2>
                    <div className="month-grid">
                        {weekdays.map((day, index) => (
                            <div className="font-bold" key={day}>
                                {day}
                            </div>
                        ))}
                        {monthArray.map((date, index) => (
                            <div onClick={() => sendDay(date)} key={date}>
                <span className={date < Number(currentDay) ? 'date-muted' : 'day'}>
                  {date}
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}

