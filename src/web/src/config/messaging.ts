import { messaging } from "@/firebase";
import { MessagePayload, onMessage } from "firebase/messaging";

export const onMessageListener = (): Promise<MessagePayload> => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload: MessagePayload) => {
      resolve(payload);
    });
  })
};
