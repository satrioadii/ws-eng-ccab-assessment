import {buildApp} from "./app";

const build = buildApp();
const port = parseInt(process.env.EXPRESS_PORT ?? "3000");

build.then((app) => {
  app.listen(port, () => console.log(`Backend listening on port ${port}`));
});
