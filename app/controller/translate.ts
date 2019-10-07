const { Controller } = require("egg");

class TranslateController extends Controller {
  async index() {
    const { ctx } = this;
    const { query = {} } = ctx;
    const [
      { data: baidu },
      { data: google },
      { data: youdao }
    ] = await Promise.all([
      ctx.service.translate.baidu(query),
      ctx.service.translate.google(query),
      ctx.service.translate.youdao(query)
    ]);
    ctx.body = { baidu, google, youdao };
  }

  async baidu() {
    const { ctx } = this;
    const { query = {} } = ctx;
    const response = await ctx.service.translate.baidu(query);
    ctx.body = response.data;
  }

  async youdao() {
    const { ctx } = this;
    const { query = {} } = ctx;
    const response = await ctx.service.translate.youdao(query);
    ctx.body = response.data;
  }

  async google() {
    const { ctx } = this;
    const { query = {} } = ctx;
    const response = await ctx.service.translate.google(query);
    ctx.body = response.data;
  }

  updateGoogleTKK() {
    this.ctx.service.translate.updateGoogleTKK();
    this.ctx.body = "update Google TKK! Try again!";
  }
}

module.exports = TranslateController;
