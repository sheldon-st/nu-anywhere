interface StudentEvent {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  attendees: string[];
  visibility: "public" | "private";
  id: string;
  motivation: string;
}

export { StudentEvent };
