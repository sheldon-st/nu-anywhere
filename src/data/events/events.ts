import { StudentEvent } from "../../types/events/event";
/** list of 3 example events for a trivia night, karaoke night, and networking event that all take place in San Francisco area */
export const events: StudentEvent[] = [
  {
    title: "Trivia Night",
    description:
      "Thursday night trivia at Bill's Pub! Come join us for a fun night of trivia and drinks! All students welcome!",
    date: new Date("2021-10-01T19:00:00"),
    location: "San Francisco, CA",
    organizer: "Northeastern University",
    attendees: ["John Doe", "Ella Mendoza", "Brad Evans", "3 others"],
    visibility: "public",
    id: "1",
    motivation:
      "Three other attendees also are interested in Table-Top Games, and two others like Coding! Join them for Trivia Night to meet new people and make new friends!",
  },
  {
    title: "Karaoke Night",
    description: "Karaoke night for all students",
    date: new Date("2021-10-02T19:00:00"),
    location: "San Francisco, CA",
    organizer: "Northeastern University",
    attendees: ["Matthew Thompson", "Ella Mendoza", "John Doe", "5 others"],
    visibility: "public",
    id: "2",
    motivation:
      "John Doe, who you recently attended a networking event with, is also coming to Karaoke Night!",
  },
  {
    title: "Networking Event",
    description: "Networking event for all students",
    date: new Date("2021-10-03T19:00:00"),
    location: "San Francisco, CA",
    organizer: "Northeastern University",
    attendees: ["Carl Johnson", "Ella Mendoza", "Aarav Patel", "7 others"],
    visibility: "public",
    id: "3",
    motivation:
      "Two other attendees are also interested in Hiking! Connect with them at the event to learn more about their favorite hiking spots!",
  },
];
