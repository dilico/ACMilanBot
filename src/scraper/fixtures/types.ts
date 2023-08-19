export type Event = {
  id: string;
  date: string;
  status: {
    state: string;
    detail: string;
  };
  completed: boolean;
  league: string;
  teams: {
    displayName: string;
    id: string;
    isHome: boolean;
  }[];
  venue: {
    fullName: string;
    address: { city: string; country: string };
  };
};
