const { Service } = require("egg");
const md5 = require("md5");
const https = require("https");
const googleTrans = require("google-translate-api");

class TranslateService extends Service {
  baidu({ query = "你好", from = "zh", to = "en" }) {
    const { baiduAppid, baiduKey } = this.config.baidufanyi;
    const salt = Date.now();
    const baiduSign = md5(baiduAppid + query + salt + baiduKey);
    return this.ctx.curl("http://api.fanyi.baidu.com/api/trans/vip/translate", {
      data: {
        q: query,
        appid: baiduAppid,
        salt,
        from,
        to,
        sign: baiduSign
      },
      dataType: "json"
    });
  }

  async google({ query = "你好", from = "zh", to = "en" }) {
    const { config } = this;
    if (!config.google.TKK) {
      await this.updateGoogleTKK();
    }
    const tk = getGoogleTK(query, config.google.TKK);
    return this.ctx.curl("https://translate.google.cn/translate_a/single", {
      data: {
        client: "webapp",
        sl: from,
        tl: to,
        hl: "zh-CN",
        dt: "at",
        // @ts-ignore
        dt: "bd",
        // @ts-ignore
        dt: "ex",
        // @ts-ignore
        dt: "ld",
        // @ts-ignore
        dt: "md",
        // @ts-ignore
        dt: "qca",
        // @ts-ignore
        dt: "rw",
        // @ts-ignore
        dt: "rm",
        // @ts-ignore
        dt: "ss",
        // @ts-ignore
        dt: "t",
        ie: "UTF-8",
        oe: "UTF-8",
        source: "bh",
        ssel: 3,
        tsel: 0,
        kc: 0,
        tk,
        q: query
      },
      dataType: "json"
    });
  }

  updateGoogleTKK() {
    return https
      .get("https://translate.google.cn/", res => {
        let html = "";
        res.on("data", data => {
          html += data;
        });
        res.on("end", () => {
          const tkkReg = html.match(/tkk:'(\d+.\d+)'/);
          if (tkkReg) {
            this.config.google.TKK = tkkReg[1];
          }
        });
      })
      .on("error", () => {
        console.log("获取数据出错！");
      });
  }

  youdao({ query = "你好", from = "zh", to = "en" }) {
    const salt = String(new Date().getTime() + 10 * Math.random());
    const sign = md5("fanyideskweb" + query + salt + "n%A-rKaT5fb[Gy?;N5@Tj");
    return this.ctx.curl(
      "http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule",
      {
        method: "POST",
        headers: {
          Cookie: `OUTFOX_SEARCH_USER_ID="1258766647@10.168.11.12"; JSESSIONID=aaazgPv5sVxtugeB89L2w; OUTFOX_SEARCH_USER_ID_NCOO=137644729.02929845;  _ntes_nnid=a053d0c4f8f72cb70d87aae409105a4d,1567994194429; ___rl__test__cookies=${Date.now()}`,
          Referer: "http://fanyi.youdao.com/"
        },
        data: {
          i: query,
          from,
          to,
          smartresult: "dict",
          client: "fanyideskweb",
          salt,
          sign,
          doctype: "json",
          version: "2.1",
          keyfrom: "fanyi.web",
          action: "FY_BY_REALTIME"
          // typoResult: "false"
        },
        dataType: "json"
      }
    );
  }
}

module.exports = TranslateService;

function getGoogleTK(a, TKK) {
  const Lr = a => {
    return function() {
      return a;
    };
  };
  const Mr = function(a, b) {
    for (let c = 0; c < b.length - 2; c += 3) {
      let d = b.charAt(c + 2);
      d = d >= "a" ? d.charCodeAt(0) - 87 : Number(d);
      d = b.charAt(c + 1) == "+" ? a >>> d : a << d;
      a = b.charAt(c) == "+" ? (a + d) & 4294967295 : a ^ d;
    }
    return a;
  };
  // if (null !== Nr) var b = Nr;
  // else {
  //   b = Lr(String.fromCharCode(84));
  //   var c = Lr(String.fromCharCode(75));
  //   b = [b(), b()];
  //   b[1] = c();
  //   console.log(b.join(c()))
  //   b = (Nr = '427422.2671531220' || "") || ""
  // }
  // let b = '427422.2671531220'; // TKK todo
  let b = TKK; // TKK
  let d = Lr(String.fromCharCode(116));
  let c = Lr(String.fromCharCode(107));
  // @ts-ignore
  d = [d(), d()];
  d[1] = c();
  // c = "&" + d.join("") + "=";
  // @ts-ignore
  c = "";
  d = b.split(".");
  b = Number(d[0]) || 0;
  for (var e: any[] = [], f = 0, g = 0; g < a.length; g++) {
    let l = a.charCodeAt(g);
    l < 128
      ? (e[f++] = l)
      : (l < 2048
          ? (e[f++] = (l >> 6) | 192)
          : ((l & 64512) == 55296 &&
            g + 1 < a.length &&
            (a.charCodeAt(g + 1) & 64512) == 56320
              ? ((l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023)),
                // @ts-ignore
                (e[f++] = (l >> 18) | 240),
                // @ts-ignore
                (e[f++] = ((l >> 12) & 63) | 128))
              : (e[f++] = (l >> 12) | 224),
            // @ts-ignore
            (e[f++] = ((l >> 6) & 63) | 128)),
        // @ts-ignore
        (e[f++] = (l & 63) | 128));
  }
  a = b;
  for (f = 0; f < e.length; f++) (a += e[f]), (a = Mr(a, "+-a^+6"));
  a = Mr(a, "+-3^+b+-f");
  a ^= Number(d[1]) || 0;
  a < 0 && (a = (a & 2147483647) + 2147483648);
  a %= 1e6;
  return c + (a.toString() + "." + (a ^ b));
}
