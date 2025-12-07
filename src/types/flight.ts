export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  departure: {
    airport: string;
    code: string;
    city: string;
    time: string; // ISO string
    timezone: string;
  };
  arrival: {
    airport: string;
    code: string;
    city: string;
    time: string; // ISO string
    timezone: string;
  };
  status: 'On Time' | 'Delayed' | 'Cancelled' | 'Arrived';
  duration: string;
}
