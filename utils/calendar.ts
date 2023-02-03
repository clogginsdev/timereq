import { format } from 'date-fns'

export const month = format(new Date(), 'MM');

// get the current month name
export const monthName = format(new Date(), 'MMMM');
export const currentDay = format(new Date(), 'dd');

export const year = format(new Date(), 'yyyy');

export const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// days in the current month
const daysInMonth = new Date(Number(year), Number(month), 0).getDate();

// start day of the month

const startDay = new Date(Number(year), Number(month) - 1, 1).getDay();

// end day of the month
const endDay = new Date(Number(year), Number(month) - 1, daysInMonth).getDay();


// make an array of the month that is shifted to match the days of the week

export const days = [];

for (let i = 1; i <= daysInMonth; i++) {
    //@ts-ignore
    days.push(i);
}

for (let i = 0; i < startDay; i++) {
    //@ts-ignore
    days.unshift("");
}

for (let i = 0; i < 6 - endDay; i++) {
    //@ts-ignore
    days.push(null);
}





