export interface OpenSkyStateVector {
    icao24: string;
    callsign: string | null;
    origin_country: string;
    time_position: number | null;
    last_contact: number;
    longitude: number | null;
    latitude: number | null;
    baro_altitude: number | null;
    on_ground: boolean;
    velocity: number | null;
    true_track: number | null;
    vertical_rate: number | null;
    sensors: number[] | null;
    geo_altitude: number | null;
    squawk: string | null;
    spi: boolean;
    position_source: number;
}

export interface OpenSkyResponse {
    time: number;
    states: (string | number | boolean | null)[][];
}

export interface OpenSkyFlight {
    icao24: string;
    firstSeen: number;
    estDepartureAirport: string | null;
    lastSeen: number;
    estArrivalAirport: string | null;
    callsign: string;
    estDepartureAirportHorizDistance: number | null;
    estDepartureAirportVertDistance: number | null;
    estArrivalAirportHorizDistance: number | null;
    estArrivalAirportVertDistance: number | null;
    departureAirportCandidatesCount: number;
    arrivalAirportCandidatesCount: number;
}
