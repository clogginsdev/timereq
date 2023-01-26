import {useRouter} from "next/router";
import {useState} from "react"
import Head from "next/head";
import {month, year} from "../../utils/calendar";
import {apiFetch} from "../../utils/fetch"
import Link from "next/link";




export default function AddDetails() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [message, setMessage] = useState<boolean>(false );
    const [validator, setValidator] = useState<string>("")

    const router = useRouter();

    const {
        query: {time, day}
    } = router;

    const props = {
        time,
        day
    }

    const timeT = props.time

    let tme: any;
    typeof timeT === "string" ? tme = timeT : tme = null;

    const appointment = [Number(year), Number(month), Number(props.day), Number(tme), 0]

    function handleForm(e: any) {
        setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
    }

    async function persistMeeting() {

        if ((form.name === "" || form.email === "" || form.message === "") ) {
            setValidator("Please fill in all the fields!");
            return;
        } else {
            await apiFetch("meetings", {
                method: "POST",
                body: {
                    name: form.name,
                    email: form.email,
                    message: form.message,
                    appointment
                }
            });

            await apiFetch("meetings/invite", {
                method: "POST",
                body: {
                    name: form.name,
                    email: form.email,
                    message: form.message,
                    appointment
                }
            });
            setValidator("");
            setMessage(true);
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
                    <div className={validator === "" ? "hidden" : "validator"}>
                        <p>{validator}</p>
                    </div>
                    <h1 className="label-title">Add Details</h1>
                    {message ? null : (
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="input-group">
                                <label htmlFor="name">Your Name (required)</label>
                                <input value={form.name} onChange={(e) => handleForm(e)} type="text" name="name"/>
                            </div>
                            <div className="input-group">
                                <label htmlFor="email">Your Email (required)</label>
                                <input value={form.email} onChange={(e) => handleForm(e)} type="email" name="email"/>
                            </div>
                            <div className="input-group">
                                <label htmlFor="message">Why Do You Want to Meet? (required)</label>
                                <textarea value={form.message} onChange={(e) => handleForm(e)} name="message" />
                            </div>
                            <button onClick={persistMeeting}>Request Meeting</button>
                        </form>
                    )}
                    <div className={message ? "message" : "hidden"}>
                        <p>Thank you for requesting a meeting! I will get back to you shortly.</p>
                        <Link href="/">Return to the homepage</Link>
                    </div>
                </div>
            </main>

        </>
    )
}