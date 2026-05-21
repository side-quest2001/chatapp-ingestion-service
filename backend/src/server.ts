import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.info(`Server listening on port ${env.PORT}`);
});
