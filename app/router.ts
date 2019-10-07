import { Application } from "egg";

export default (app: Application) => {
  const { controller, router } = app;

  router.get("/api", controller.home.index);
  router.get("/api/translate/baidu", controller.translate.baidu);
  router.get("/api/translate/youdao", controller.translate.youdao);
  router.get("/api/translate/google", controller.translate.google);
  router.get(
    "/api/translate/update_google_tkk",
    controller.translate.updateGoogleTKK
  );
};
