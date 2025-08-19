import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gbqgwsettlnaubsxtwxn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicWd3c2V0dGxuYXVic3h0d3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MDY2NTUsImV4cCI6MjA3MDk4MjY1NX0.2vYfo5PEPTYywzydMVfBJMCSvioDe0ftizM-rJ_-L0w'

const BASE_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events";


const GOOGLE_AUTH_KEY = "997159242404-s8v6kvlq910d1gb8c811kgd96292b7m8.apps.googleusercontent.com"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,           // persist session on device
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,       // React Native: no URL parsing
  },
});

// export async function fetchEvents(token) {
//   console.log(`${BASE_URL}?singleEvents=true&orderBy=startTime&timeMin=${new Date().toISOString()}`)
//   const res = await fetch(`${BASE_URL}?singleEvents=true&orderBy=startTime&timeMin=${new Date().toISOString()}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   const values = res.json()
//   console.log(values,"----->>tokennnn events")
//   return res.json();
// }

// export async function addEvent(token, event) {
//   const res = await fetch(BASE_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify(event),
//   });
//   return res.json();
// }

// export async function updateEvent(token, eventId, updatedEvent) {
//   const res = await fetch(`${BASE_URL}/${eventId}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify(updatedEvent),
//   });
//   return res.json();
// }

// export async function deleteEvent(token, eventId) {
//   await fetch(`${BASE_URL}/${eventId}`, {
//     method: "DELETE",
//     headers: { Authorization: `Bearer ${token}` },
//   });
// }
const BASE_URL_FOR_AUTH = "https://www.googleapis.com/calendar/v3";

async function fetchCalendarList(token) {
  const res = await fetch(`${BASE_URL_FOR_AUTH}/users/me/calendarList`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.items || [];
}

// Fetch events for a specific calendarId
async function fetchEventsFromCalendar(token, calendarId) {
  const res = await fetch(
    `${BASE_URL_FOR_AUTH}/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await res.json();
  return data.items || [];
}

export async function fetchEvents(token) {
  const calendars = await fetchCalendarList(token);

  const holidayCalendar = calendars.find(
    (cal) =>
      cal.summary.toLowerCase().includes("holiday") ||
      cal.summary.toLowerCase().includes("festival")
  );

  const userEvents = await fetchEventsFromCalendar(token, "primary");

  let festivalEvents = [];
  if (holidayCalendar) {
    festivalEvents = await fetchEventsFromCalendar(token, holidayCalendar.id);

    festivalEvents = festivalEvents.map((event) => ({
      ...event,
      colorId: "2",
      isFestival: true,
    }));
  }

  return [...userEvents, ...festivalEvents];
}

export async function addEvent(token, event) {
  const res = await fetch(`${BASE_URL_FOR_AUTH}/calendars/primary/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });
  return await res.json();
}

export async function updateEvent(token, eventId, updates) {
  const res = await fetch(`${BASE_URL_FOR_AUTH}/calendars/primary/events/${eventId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  return await res.json();
}

export async function deleteEvent(token, eventId) {
  await fetch(`${BASE_URL_FOR_AUTH}/calendars/primary/events/${eventId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return true;
}


