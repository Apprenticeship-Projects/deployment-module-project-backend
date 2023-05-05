import express from "express";

import { defaultRoute } from "./defaultRoute";
import { userRoute } from "./userRoute";
import { messageRoute } from "./messageRoute";
import { sessionRoute } from "./sessionRoute";
import { channelRoute } from "./channelRoute";

const routes = express.Router();
routes.use(defaultRoute);
routes.use(userRoute);
routes.use(messageRoute);
routes.use(sessionRoute);
routes.use(channelRoute);

export default routes;
