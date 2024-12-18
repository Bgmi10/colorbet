import WebSocket from "ws";

export interface GameState {
    id : number 
    cardA : string
    cardB : string
    cardAImg : string
    cardBImg : string
    winner : string
}

export interface WebSocketWithId extends WebSocket {
    userId? : string;
}
