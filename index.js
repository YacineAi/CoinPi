const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const https = require('https');

app.use(express.json());

app.get('/', (req, res) => {
    res.sendStatus(200)
});

app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Ping successful' });
  });
  
function keepAppRunning() {
    setInterval(() => {
      https.get(`${process.env.RENDER_EXTERNAL_URL}/ping`, (resp) => {
        if (resp.statusCode === 200) {
          console.log('Ping successful');
        } else {
          console.error('Ping failed');
        }
      });
    }, 5 * 60 * 1000);
  }

const headers = {
    "cookie": "cna=vlG1HUGGlkACAWlsyT1BkzOZ; af_ss_a=1; af_ss_b=1; ali_apache_id=33.1.239.112.1697539132282.372786.0; _gcl_au=1.1.300412768.1697539137; _ym_uid=169753913996963838; _ym_d=1697539139; e_id=pt20; _fbp=fb.1.1697643995534.593915267; _hvn_login=13; account_v=1; __utmz=3375712.1697930784.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); traffic_se_co=%7B%22src%22%3A%22Twitter%22%2C%22timestamp%22%3A1698365419554%7D; ali_beacon_id=33.1.239.112.1697539132282.372786.0; __utma=3375712.577079706.1697539136.1697930784.1698513906.2; _gac_UA-17640202-1=1.1699471239.Cj0KCQiAgK2qBhCHARIsAGACuzlDJj6WpT2Y_XIIQWDY1zTkO6_ZmwLRrl874WDIgvDQXOg8As05uywaAktGEALw_wcB; _gcl_aw=GCL.1699471239.Cj0KCQiAgK2qBhCHARIsAGACuzlDJj6WpT2Y_XIIQWDY1zTkO6_ZmwLRrl874WDIgvDQXOg8As05uywaAktGEALw_wcB; lzd_cid=604ff777-86bb-4f36-a4f4-51e388931173; lazop_lang=en_US; xlly_s=1; AB_DATA_TRACK=450145_617383; AB_ALG=; AB_STG=st_StrategyExp_1694492533501%23stg_687; _gid=GA1.2.701519773.1699735758; havana_tgc=NTGC_4d7e157d7f79d10dbeab50cb089b9e1b; _ym_isad=1; _ym_visorc=b; XSRF-TOKEN=a1750142-1734-4547-bd31-3335456b40c2; ali_apache_tracktmp=W_signed=Y; RT=\"z=1&dm=aliexpress.com&si=30e152bf-aa50-4580-83e5-aaa5efc6b1c5&ss=lovw4kxq&sl=2&tt=ewq&rl=1&nu=mebzdgh7&cl=v17&obo=1&ld=v1h&r=16e4gw94c&ul=v1i&hd=vng\"; acs_usuc_t=acs_rt=9c1200a7ff244bc5a66eb6763aa1f560&x_csrf=aonvd7dbu1mm; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005005302163998%091005006086828242%091005005932423966%0932994759032%091005005799479709%091005006172186855%091005005498767278%091005005260188885; intl_locale=en_US; re_ri_g=2UPoVgaQNu2AWEYjJmKDXekHZnWZ7BkuZuFjdNnE87AI1qdSsdmnIuPx+YhGwHgGt8Y2lwUeBXU=; aeu_cid=c9c8f0a5d0644e688387c010f373c51e-1699819301209-01391-_ooAAVUB; _m_h5_tk=42a8639ba83ba5212f03adfd98ab6665_1699821721890; _m_h5_tk_enc=38045c3af5a0a6106db511ef830fc9f9; x_router_us_f=x_alimid=2720217087; xman_us_t=x_lid=dz1119513087freae&sign=y&rmb_pp=louktila.tk@gmail.com&x_user=355+nKnLyR000jM3GmPIkBpLqKM/9LINoOMaeSBx73s=&ctoken=r065hcp6l2zj&l_source=aliexpress; sgcookie=E100dXhcBEIyny3wnFtj2y6reT1Dtn3LbjpXappQHvPa0elgF713oSPi0vUrX7oQvJNCCrGjzZ99WqlmLE339gDShD5AWxv54rTrFH1CiepJM+k=; aep_common_f=hCCS555midK1S8Fo3kXWWAPduFJhKjBXNtv7Ha6a4rySvxlOxCCKLw==; xman_f=xqfzYoJKcG4wBVaigDy/gBwOqZUCvLlUXTHqo3mKJly7Wmx+xLy2DezaMxUF2mT6ZzRAdutEElIbpP8i6eHimxSl+4z2+mJY0naPzYFgXpIR6kp23kdzvTKNBR7RnKNxpsnNdI8ifMlpKPBDwSQhGkOQAUaVo0RcnygDa4rilD/g2mYQ9WKVxb5wC26yh3pBvXsMEO2kbeKk3oUG5/6ExM93W5kxj2xHs7x/4CJwycehRVHKUU5C6JsYCiFv6xglcsfHNtv61iln+E1QbqBIMISkLIlGT45m29NW3gjiY0ttNlhHyOfXUDUjykW/eruUkaU8PCHiLtQaVM6pRCbXqv19v9W99qsVZ4CnOalQ8c5sDRBj1CQgg0A9buGTHfE6QW8mlDC9W79BYioM3yGBJRF7Z1jtr4QW; ali_apache_track=mt=1|ms=|mid=dz1119513087freae; _history_login_user_info={\"userName\":\"hacking\",\"avatar\":\"https://ae04.alicdn.com/kf/Ae471be8be30049709844f4093924cb335.jpg_100x100.jpg\",\"accountNumber\":\"louktila.tk@gmail.com\",\"phonePrefix\":\"\",\"expiresTime\":1702412011968}; xman_us_f=x_locale=en_US&x_l=1&x_user=DZ|hacking|baka|ifm|2720217087&x_lid=dz1119513087freae&x_c_chg=0&x_as_i=%7B%22aeuCID%22%3A%22c9c8f0a5d0644e688387c010f373c51e-1699819301209-01391-_ooAAVUB%22%2C%22affiliateKey%22%3A%22_ooAAVUB%22%2C%22channel%22%3A%22AFFILIATE%22%2C%22cv%22%3A%227%22%2C%22isCookieCache%22%3A%22N%22%2C%22ms%22%3A%221%22%2C%22pid%22%3A%223356821564%22%2C%22tagtime%22%3A1699819301209%7D&acs_rt=05c9fa3b68ef40f1a337fb0d1acc6814; cto_bundle=JXOpkV8wcFZ3ZjRCc2RibzI3VERSJTJCQ2JvbktsUkJXekVxZjAxdFRET3U0NzBXaGtvdU9TUWRGeE1tVVRMRDZ5alJleW9kVCUyRmlQbXhpc1V1MjNLUHN5cEVKZG11TnZXaWxKNk5FbE91cVpCSFREaEZuTnFXMkhsJTJCMWlqcUJZJTJGV3N0VFV3SzVFQ1VicnNUaEJlJTJGZG1DQkhVVDNEbVF2Y0Zpc0VnQWNRZzhMdnhxMW1tUld6cHdXUHpVNzNzSEp0UFZaTWx2alIzOGhERnRBcVZCZnNXeG01V0h2ZyUzRCUzRA; _ga_VED1YSGNC7=GS1.1.1699815108.44.1.1699820014.23.0.0; _ga=GA1.1.577079706.1697539136; tfstk=d-KwSjq0qcnZGsCsyNjVYedM09IOXgh7mn1fnKvcC1fGhFTF0Bdw5Ssflo5Dn6t11dsi0tAWT1XGmiqHKtBPnrjcSJ2hBO4Gon1X0xS9AFZf1fI2nQsqNbiSVdpOvicSNWJeBdCuFOQEV099Bef6uNnSBM_hJGBeARe7NaGke6xtAQ62800f9oqDjVQNaRfhp9KFBN5l-6WwKSBhkntv7S4VS9BFNvkFROeRu; l=fBECRZmgPS3DcBLyBO5CFurza77OoIRb4sPzaNbMiIEGa6LhNFaT7OCThoXyldtjQT1HOetyMAhYGdLHR3jcewSXxdhGrECKnxfkFFjG.; isg=BMDAtwQBsdLEAU2pif1JyzmlkU6SSaQT-_UXOTpRDltutWDf4l_uo8zHyQV1BVzr; JSESSIONID=14EF2153047D64C77F2AE540C31D07EC; intl_common_forever=4Z2qmUOWvFDqL3VpAVzR07EqmYv+PbNuLhOFBOugOgFMEtgYhGlOOQ==; xman_t=Le0GPnIrn0+aOAtC69GXG8SSc/WTeBMiJ4rQVDdOo1Ogm14Kd9PCAKFJAtkVuIa1vCClcZXeQ4S3z8C+BsNh8yzwvjj1Gc6YnJ0XZLUxhXk1RoJWTp0RxuMRBMJII8ujnDrVn9MkI96LHwp0l8/HsLpNgKiaYPSzeinzUggyyk4Fw5u6/CUQ18rBwhZcWebDvy7+jpt5FskYgKZjQct6WDc+yJquJlm33T3cWr5hukXLYvTKYupxWasaiwdG/sKlHaDjI6dFlzGzBen+NHGQjbalF0hCXzlX0QGlRF5gKh8f0fOgVYK2gXpNaDwUWQVR9F9nZh4cEjbQtba3aEd6cjC1jWL68Svt5khc2PosJEdIBk+8BKh7Lte898Y2gcu5KUNn4n5+RBpQNyCJUAoDujwbJ+NxwmrKToTZ0gHjsPowcdBGh/cj2/bHmSeuVGbx+xwZ82Puuba69oqbn5E1wvRcjk/MAE4i+vINHCFzUPl7cmGG1RHd4jvAJ6c0BqGXOhpP4TJLIiRphOXcAClQGXt498b7BkzMYvlSY73BrUXg94rJiz55dNx1rb8rXPpD+/PemjlgKDtV9BENrNkHigh7+yGYEN3lo5YAjAZinVlfHRi0Ojngq0arK3h9/gvVvZWydmMlqloSB5Kze6NEmyqTSOHK/Yd3Tc9QhDD2sdgLN2pdC1DuO8qWg0JXqpfwVaX7psexHArKM5Vb6n42/EDxN9hUwNSAUbhQCVJl9ygyzZiuKCQPR3eKqAZcp1pz; aep_usuc_f=site=vnm&province=null&city=null&c_tp=USD&x_alimid=2720217087&ups_d=1|1|1|1&re_sns=google&isb=y&ups_u_t=1715367049691&region=DZ&b_locale=en_US&ae_u_p_s=2"
  };

app.get('/fetch', async (req, res) => {
    const { id } = req.query;
    try {
        const result = {};
        const normal = await axios.get(`https://ar.aliexpress.com/item/${id}.html`, { headers });
        const $ = cheerio.load(normal.data);
        const normalHtml = $('script:contains("window.runParams")');
        const normalContent = normalHtml.html();
        const normalMatch = /window\.runParams\s*=\s*({.*?});/s.exec(normalContent);

        if (normalMatch && normalMatch[1]) {
            const evaluatedDataString = eval(`(${normalMatch[1]})`);
            var string = JSON.stringify(evaluatedDataString);
            var prsd = JSON.parse(string);

            var shipping = () => {
                if (prsd.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.displayAmount == undefined) {
                    return "Free Shipping"
                } else {
                    return prsd.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.displayAmount
                }
            };

            var discount = () => {
              if (prsd.data.priceComponent.coinDiscountText == undefined) {
                  return "لا يوجد خصم إضافي ❎"
              } else {
                return prsd.data.priceComponent.coinDiscountText
              }
            };

            var shaped = {
                name: prsd.data.metaDataComponent.title,
                image: prsd.data.imageComponent.imagePathList[0],
                shipping: shipping(),
                rate: prsd.data.feedbackComponent.evarageStar,
                totalRates: prsd.data.feedbackComponent.totalValidNum,
                price: prsd.data.priceComponent.origPrice.minAmount.formatedAmount,
                discountPrice: prsd.data.priceComponent.discountPrice.minActivityAmount != undefined && prsd.data.priceComponent.discountPrice.minActivityAmount.formatedAmount || "No discount Price",
                sales: prsd.data.tradeComponent.formatTradeCount,
                discount: discount(),
                store: prsd.data.sellerComponent.storeName,
                storeRate: prsd.data.storeFeedbackComponent.sellerPositiveRate
            };
            result['normal'] = shaped;
          } else {
            res.json({ ok : false});
            console.error('Unable to extract window.runParams data.');
          }

          /* ---- Points ---- */

          const points = await axios.get(`https://ar.aliexpress.com/i/${id}.html?sourceType=620&aff_fcid=`, { headers });
          const $1 = cheerio.load(points.data);
          const pointsHtml = $1('script:contains("window.runParams")');
          const pointsContent = pointsHtml.html();
          const pointsMatch = /window\.runParams\s*=\s*({.*?});/s.exec(pointsContent);
          
          if (pointsMatch && pointsMatch[1]) {
            const evalit = eval(`(${pointsMatch[1]})`);
            var stringEval = JSON.stringify(evalit);
            var parseEval = JSON.parse(stringEval);

            var discount = () => {
                if (parseEval.data.priceComponent.coinDiscountText == undefined) {
                    return "لا توجد نسبة تخفيض بالعملات ❎"
                } else {
                  var clean = parseEval.data.priceComponent.coinDiscountText.match(/\d+/g);
                  return `خصم النقاط ${clean}%`
                }
            };

            var price_fun = () => {
              if (parseEval.data.priceComponent.discountPrice.minActivityAmount != undefined) {
                  return parseEval.data.priceComponent.discountPrice.minActivityAmount.formatedAmount;
              } else {
                  return parseEval.data.priceComponent.origPrice.minAmount.formatedAmount;
              }
            };

            var total = () => {
              if (parseEval.data.priceComponent.coinDiscountText != undefined) {
                var pers = parseEval.data.priceComponent.coinDiscountText.match(/\d+/g);
                var prs = price_fun().match(/\d+/g);
                const total = parseInt(prs) - (parseInt(prs) * parseInt(pers)) / 100;
                return `US $${total.toFixed(2)}`;
              } else {
                  return price_fun();
              }
            };

            var shaped = {
                discountPrice: price_fun(),
                discount: discount(),
                total: total(),
            };
            
            result['points'] = shaped;
          } else {
            console.error('Unable to extract window.runParams data.');
          }

          /* ---- Super ---- */

          const superdeals = await axios.get(`https://ar.aliexpress.com/i/${id}.html?sourceType=562&aff_fcid=`, { headers });
          const $2 = cheerio.load(superdeals.data);
          const superHtml = $2('script:contains("window.runParams")');
          const superContent = superHtml.html();
          const superMatch = /window\.runParams\s*=\s*({.*?});/s.exec(superContent);
          
          if (superMatch && superMatch[1]) {
            const  evalit = eval(`(${superMatch[1]})`);
            var stringEval = JSON.stringify(evalit);
            var parseEval = JSON.parse(stringEval);
            var price_fun = () => {
              if (parseEval.data.priceComponent.discountPrice.minActivityAmount != undefined) {
                  return parseEval.data.priceComponent.discountPrice.minActivityAmount.formatedAmount;
              } else {
                  return parseEval.data.priceComponent.origPrice.minAmount.formatedAmount;
              }
            };

            var shaped = {
                price: price_fun(),
            };

            result['super'] = shaped;
          } else {
            console.error('Unable to extract window.runParams data.');
          }

          /* ---- Limited ---- */
          
          const limited = await axios.get(`https://ar.aliexpress.com/i/${id}.html?sourceType=561&aff_fcid=`, { headers });
          const $3 = cheerio.load(limited.data);
          const limitedHtml = $('script:contains("window.runParams")');
          const limitedContent = limitedHtml.html();
          const limitedMatch = /window\.runParams\s*=\s*({.*?});/s.exec(limitedContent);
          
          if (limitedMatch && limitedMatch[1]) {
            const evalit = eval(`(${limitedMatch[1]})`);
            var stringEval = JSON.stringify(evalit);
            var parseEval = JSON.parse(stringEval);

            var price_fun = () => {
              if (parseEval.data.priceComponent.discountPrice.minActivityAmount != undefined) {
                  return parseEval.data.priceComponent.discountPrice.minActivityAmount.formatedAmount;
              } else {
                  return parseEval.data.priceComponent.origPrice.minAmount.formatedAmount;
              }
            };

            var shaped = {
                price: price_fun(),
            };

            result['limited'] = shaped;
            res.json(result);
          } else {
            console.error('Unable to extract window.runParams data.');
          }

    } catch (error) {
        
    }
});




app.get('/detail', async (req, res) => {
  const { id } = req.query;
  try {
      const result = {};
      const normal = await axios.get(`https://ar.aliexpress.com/item/${id}.html`, { headers });
      const $ = cheerio.load(normal.data);
      const normalHtml = $('script:contains("window.runParams")');
      const normalContent = normalHtml.html();
      const normalMatch = /window\.runParams\s*=\s*({.*?});/s.exec(normalContent);

      if (normalMatch && normalMatch[1]) {
          const evaluatedDataString = eval(`(${normalMatch[1]})`);
          var string = JSON.stringify(evaluatedDataString);
          var prsd = JSON.parse(string);

          var shipping = () => {
              if (prsd.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.displayAmount == undefined) {
                  return "Free Shipping"
              } else {
                  return prsd.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.displayAmount
              }
          };

          var discount = () => {
            if (prsd.data.priceComponent.coinDiscountText == undefined) {
                return "لا يوجد خصم إضافي ❎"
            } else {
              return prsd.data.priceComponent.coinDiscountText
            }
          };

          var variants = () => {
            const skuls = [];
            const skuArray = JSON.parse(prsd.data.priceComponent.skuJson);
            if (prsd.data.skuComponent.hasSkuProperty == true) {
              for(const skul of prsd.data.skuComponent.productSKUPropertyList[0].skuPropertyValues) {
                var content = {
                  id: skul.propertyValueIdLong,
                  name: skul.propertyValueDefinitionName,
                  image: skul.skuPropertyImagePath,
                  miniImage: skul.skuPropertyImageSummPath,
                  propName: skul.propertyValueName,
                  colorCode: skul.skuColorValue,
                };
                skuls.push(content)
              }
              const linkedData = skuls.map(variant => {
                const matchedSku = skuArray.find(sku => {
                  // Modify the comparison based on your data structure
                  return parseInt(variant.id) === parseInt(sku.skuPropIds);
                });
              
                if (matchedSku) {
                  return {
                    ...variant,
                    price: matchedSku.skuVal.skuActivityAmount.value,
                    oldPrice: matchedSku.skuVal.skuAmount.value,
                    discount: matchedSku.skuVal.discountTips,
                    available: matchedSku.salable,
                  };
                }
              
                return variant;
              });

              return linkedData;
            } else {
              return "none"
            }
          };

          var shaped = {
              name: prsd.data.metaDataComponent.title,
              cover: prsd.data.imageComponent.imagePathList[0],
              shipping: shipping(),
              rate: prsd.data.feedbackComponent.evarageStar,
              totalRates: prsd.data.feedbackComponent.totalValidNum,
              price: prsd.data.priceComponent.origPrice.minAmount.value,
              discountPrice: prsd.data.priceComponent.discountPrice.minActivityAmount != undefined && prsd.data.priceComponent.discountPrice.minActivityAmount.value || "No discount Price",
              sales: prsd.data.tradeComponent.formatTradeCount,
              discount: discount(),
              variants: variants(),
              store: prsd.data.sellerComponent.storeName,
              storeRate: prsd.data.storeFeedbackComponent.sellerPositiveRate
          };
          //result['normal'] = shaped;
          const skuArray = JSON.parse(prsd.data.priceComponent.skuJson);
          //const skuImagesArray = prsd.data.skuComponent;
          res.json(shaped);
        } else {
          res.json({ ok : false});
          console.error('Unable to extract window.runParams data.');
        }
  } catch (error) {
      console.log(error.message)
  }
});
app.listen(3000, () => {
    console.log(`App is on port : 3000`);
    keepAppRunning();
  });
