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

app.get('/fetch', async (req, res) => {
    const { id } = req.query;
    const { region } = req.query || "DZ";
    
    const headers = {
      "cookie": `xman_f=xqfzYoJKcG4wBVaigDy/gBwOqZUCvLlUXTHqo3mKJly7Wmx+xLy2DezaMxUF2mT6ZzRAdutEElIbpP8i6eHimxSl+4z2+mJY0naPzYFgXpIR6kp23kdzvTKNBR7RnKNxpsnNdI8ifMlpKPBDwSQhGkOQAUaVo0RcnygDa4rilD/g2mYQ9WKVxb5wC26yh3pBvXsMEO2kbeKk3oUG5/6ExM93W5kxj2xHs7x/4CJwycehRVHKUU5C6JsYCiFv6xglcsfHNtv61iln+E1QbqBIMISkLIlGT45m29NW3gjiY0ttNlhHyOfXUDUjykW/eruUkaU8PCHiLtQaVM6pRCbXqv19v9W99qsVZ4CnOalQ8c5sDRBj1CQgg0A9buGTHfE6QW8mlDC9W79BYioM3yGBJRF7Z1jtr4QW; xman_t=Le0GPnIrn0+aOAtC69GXG8SSc/WTeBMiJ4rQVDdOo1Ogm14Kd9PCAKFJAtkVuIa1vCClcZXeQ4S3z8C+BsNh8yzwvjj1Gc6YnJ0XZLUxhXk1RoJWTp0RxuMRBMJII8ujnDrVn9MkI96LHwp0l8/HsLpNgKiaYPSzeinzUggyyk4Fw5u6/CUQ18rBwhZcWebDvy7+jpt5FskYgKZjQct6WDc+yJquJlm33T3cWr5hukXLYvTKYupxWasaiwdG/sKlHaDjI6dFlzGzBen+NHGQjbalF0hCXzlX0QGlRF5gKh8f0fOgVYK2gXpNaDwUWQVR9F9nZh4cEjbQtba3aEd6cjC1jWL68Svt5khc2PosJEdIBk+8BKh7Lte898Y2gcu5KUNn4n5+RBpQNyCJUAoDujwbJ+NxwmrKToTZ0gHjsPowcdBGh/cj2/bHmSeuVGbx+xwZ82Puuba69oqbn5E1wvRcjk/MAE4i+vINHCFzUPl7cmGG1RHd4jvAJ6c0BqGXOhpP4TJLIiRphOXcAClQGXt498b7BkzMYvlSY73BrUXg94rJiz55dNx1rb8rXPpD+/PemjlgKDtV9BENrNkHigh7+yGYEN3lo5YAjAZinVlfHRi0Ojngq0arK3h9/gvVvZWydmMlqloSB5Kze6NEmyqTSOHK/Yd3Tc9QhDD2sdgLN2pdC1DuO8qWg0JXqpfwVaX7psexHArKM5Vb6n42/EDxN9hUwNSAUbhQCVJl9ygyzZiuKCQPR3eKqAZcp1pz; aep_usuc_f=site=vnm&province=null&city=null&c_tp=USD&x_alimid=2720217087&ups_d=1|1|1|1&re_sns=google&isb=y&ups_u_t=1715367049691&region=${region}&b_locale=en_US&ae_u_p_s=2`
    };
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
                name: prsd.data.metaDataComponent.title.replace("| |   - AliExpress", ""),
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
          const limitedHtml = $3('script:contains("window.runParams")');
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
    const idCatcher = async (id) => {
      if (/^\d+$/.test(id)) {
        return id;
      } else if (id.includes("aliexpress.com")) {
        try {
          const response = await axios.head(id, { maxRedirects: 0, validateStatus: (status) => status >= 200 && status < 400 });
          const decodedUrl = decodeURIComponent(response.headers.location);
          const regex = /\/(\d+)\.html/;
          const match = decodedUrl.match(regex);
          if (match && match[1]) {
            return match[1];
          } else if (decodedUrl.includes('/item/')) {
            // Handle the additional AliExpress URL pattern directly
            const regexItem = /\/(\d+)\.html/;
            const matchItem = decodedUrl.match(regexItem);
            if (matchItem && matchItem[1]) {
              return matchItem[1];
            }
          }
        } catch (error) {
          console.error('Error occurred while fetching the URL:', error);
          res.status(400).json({ ok: false, error: 'Invalid URL provided' });
          return null;
        }
      }
      console.error('Invalid ID or URL provided');
      res.status(400).json({ ok: false, error: 'Invalid ID or URL provided' });
      return null;
    };
      const finalid = await idCatcher(id);
      const normal = await axios.get(`https://ar.aliexpress.com/item/${finalid}.html`, { headers });
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

          /*
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
          */
          var shaped = {
              name: prsd.data.metaDataComponent.title.replace("| |   - AliExpress", ""),
              cover: prsd.data.imageComponent.imagePathList[0],
              shipping: shipping(),
              rate: prsd.data.feedbackComponent.evarageStar,
              totalRates: prsd.data.feedbackComponent.totalValidNum,
              price: prsd.data.priceComponent.origPrice.minAmount.value,
              discountPrice: prsd.data.priceComponent.discountPrice.minActivityAmount != undefined && prsd.data.priceComponent.discountPrice.minActivityAmount.value || "No discount Price",
              sales: prsd.data.tradeComponent.formatTradeCount,
              discount: discount(),
              //variants: variants(),
              store: prsd.data.sellerComponent.storeName,
              storeRate: prsd.data.storeFeedbackComponent.sellerPositiveRate
          };
          //result['normal'] = shaped;
          //const skuArray = JSON.parse(prsd.data.priceComponent.skuJson);
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
