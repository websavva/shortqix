import type {
  WsEventTypes,
  WsEvents,
} from '#shared/consts/ws-event-types';

export interface WsEvent {
  userId: number;
  type: WsEventTypes;
  payload: WsEvents[WsEventTypes];
}
