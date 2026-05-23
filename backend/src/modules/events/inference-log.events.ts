import type { CreateInferenceLogBody } from "../ingestion/ingestion.schema";
import { ingestionService } from "../ingestion/ingestion.service";
import { TypedEventBus } from "./event-bus";

const INFERENCE_LOG_CREATED_EVENT = "inference.log.created";

type AppEvents = {
  [INFERENCE_LOG_CREATED_EVENT]: CreateInferenceLogBody;
};

const eventBus = new TypedEventBus<AppEvents>();
let subscribersInitialized = false;

const publishInferenceLogCreated = (payload: CreateInferenceLogBody) => {
  eventBus.emit(INFERENCE_LOG_CREATED_EVENT, payload);
};

const initializeInferenceLogSubscribers = () => {
  if (subscribersInitialized) {
    return;
  }

  eventBus.on(INFERENCE_LOG_CREATED_EVENT, (payload) => {
    void ingestionService.createInferenceLog(payload).catch((error) => {
      console.error("Failed to persist inference log from event bus", error);
    });
  });

  subscribersInitialized = true;
};

export {
  INFERENCE_LOG_CREATED_EVENT,
  eventBus,
  initializeInferenceLogSubscribers,
  publishInferenceLogCreated,
};
