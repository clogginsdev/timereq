import { format } from 'date-fns'

export const month = format(new Date(), 'MM');
export const currentDay = format(new Date(), 'dd');

export const year = format(new Date(), 'yyyy');

// get the current month name
export const monthName = format(new Date(), 'MMMM');

export const monthArray = [];

for (let i = 1; i <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++) {
    // @ts-ignore
    monthArray.push(i);
}

export const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


