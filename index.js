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
    const { region } = req.query;
    const defaultRegion = region || "DZ";
    const cookier = () => {
      if (defaultRegion == "DZ") {
        return "ali_apache_id=33.3.20.111.1702585962650.678888.4; acs_usuc_t=x_csrf=8nx8qrep9exs&acs_rt=485dca3186c64e8eb354206aba5405ac; AKA_A2=A; _m_h5_tk=10ba1bb6aecdb672824f066d0c526c8e_1702587856981; _m_h5_tk_enc=7750008d64513183ab439d261cee7b17; e_id=pt70; xlly_s=1; _gid=GA1.2.2136155133.1702585970; _gcl_au=1.1.1695213607.1702585971; cna=c1QCHmBmNB0CAYEteA6D0PDJ; account_v=1; _ym_uid=170258597425757114; _ym_d=1702585974; _ym_isad=1; _ym_visorc=b; AB_DATA_TRACK=472051_617389.455637_622998; AB_ALG=global_union_ab_exp_4%3D2; AB_STG=st_StrategyExp_1694492533501%23stg_687%2Cst_StrategyExp_1695711618618%23stg_685; af_ss_a=1; af_ss_b=1; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005005943671094; intl_locale=ar_MA; XSRF-TOKEN=f90e5229-8dc7-4bd7-a5e3-f03fa9541960; RT=\"z=1&dm=aliexpress.com&si=cf719887-f5c6-49cc-9e93-09699f7761ed&ss=lq5nq879&sl=2&tt=3lo&rl=1&obo=1&ld=2tuk&r=1esw5xemv&ul=2tuk&hd=2ujp\"; havana_tgc=NTGC_4af064990ad42b76e65b44deb0d4128c; _hvn_login=13; x_router_us_f=x_alimid=2720217087; xman_us_t=x_lid=dz1119513087freae&sign=y&rmb_pp=louktila.tk@gmail.com&x_user=FsvZqhzjyC9N9r8UfDqcE8ih7ZaPp9x036ieR7TlWMU=&ctoken=1457kqo8xl7w6&l_source=aliexpress; sgcookie=E100e+PgE32vvuBs4RRbDK1/zcDuOBbY237w+8jCee44/xRljlTdh9V7S7XjXrXg7XrMIcKRzLdmDBiY3MwCpgdUie3P/u9LPMTBVfMa1zCbh8I=; aep_common_f=M+l0+zh1HyHwhuSym0X5YTLkksVK+YKNYp/kuSyps1g4xwkHRoCd3w==; xman_f=1mXsCY+Xl+n3EYdOjIl0/gBLz2Hiqv5U8ewzhAivdy/AiLbLiHXPyLLTUKdWdMYzg3lYH2BIL0DQ3NtqsS/hVyDAb328KQ048sO8Entkv/90t50Tj0cG8IkWwRMvsCUeGick5+SuChArwIW+W2AzmtdYlpJQPoQGPV/nMpT7z02qYZM6bDNYtdpO+Z43PWnoV2sR12ssnkw7bI/2SVT7K6WPLFQxoTNhr6cbX7hBDigFiSsD+R4L7bMADU18JjIa5zhoMfBKoVzUFbh2kyrMn/FbQaXidluAwS6jFit8l/Sq5zd4jsFQzTmkzL1Z1eWXq5h+Zv03q1iMa/MPUTEnfv4j0wdMAK3bP0GVdfdBQC/v+wGV+kkJSAPxRyWe1mlYpMsmcKsvlur4X5w7Ta0GBQ5L3PhEdXfhpCY5f30wBQVlDvBvNG+bZyhhE4fAXhmycQ91+vWfAN0xnFVzQunDxA==; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=2720217087&isb=y&region=DZ&b_locale=ar_MA; ali_apache_track=mt=1|ms=|mid=dz1119513087freae; ali_apache_tracktmp=W_signed=Y; xman_us_f=x_locale=ar_MA&x_l=0&x_user=DZ|hacking|baka|ifm|2720217087&x_lid=dz1119513087freae&x_c_chg=0&acs_rt=485dca3186c64e8eb354206aba5405ac; _gat=1; JSESSIONID=DA1BE1F197FF4F063B97905DBBC9B65F; intl_common_forever=o0NI+d3m22lDNIOpetIWYrPDmaEuTFX4k4J6EKg8n5Ho6+TAmNc8mA==; xman_t=rfJ6i7unnKWyVhPN9Bz+YeUZJbWDcqLG5/oQ5LlvC6swKPUopd5rffHDjw9J0iI5VNxH7lB7S+hTBUaUe/0KVszcCLs8U/vEbVyTNAoqcfJoLFgB/Jp66IHIe+dX1H9DjoXr9IIdp/4mB1S+j/fVPbqmawcBpAujEPY3yUMl0x5+Yh/vAaKLCsAjnT2mf/8xlx/QJU4TFjlnBpIK+huny8o/cItt6JaEn9n4GnMyeY03YgmWKuLUwR4GL9ut1vKYcB2i75S6nruLzfnn9OuMR4Fn/eFHkhnGAG86CbF4VWCbrvJkj1Kp6r5U/R33856wKg4SPUrDTzc35DmZSORxn4OPq3i++b4Sf4nSD83uNh1oH7uohhdGC0JdbYsT88nJZAJBDEZ8aDRznGLcMUhRnXHewEgoRovgnMYQjlL3pvxk5WBZN+CQsKWVPOWUq+lb+FycZpzNhs0kU0G/q8WvWomhb7L0sc9BGk9fiyfHViBfJTyaa9BrDr/gyhDc9A1u08akHsGgpzfx7Z40yqLxGqer1UHLhj3NhtFgsO2MelsHeZLpzal9r6iZp2WAp8B7r12atKjxwqJEZz7ik33Hhp32U+2AZ5gz68Jn/5pKbaPbvvBox/Vi+MAFMascZ4lO6BrKFptyl3g83B89+pyBVPNE5a9QgmPrUEkmMxbxicGlqDwZxPlsVdF5ntaeVNVDBaXBWYlFv32GW9zLSFCWCeUaqcl0XcfYR7GTOjBhubfaqRXsv10/bMoCGgdXR1Vo; tfstk=e_427FYM-ZQ2RrOQ000Z85gZa23x-2BBSPMss5ViGxDcDcZr78e4cdgsfFkgsYajhSgc7f2QUxcmSVYuZfheiFDmsL0o6j8ijPM_71uYPoTsht3asJgNd9_CRSFxyVXCdKgJMwuTMF97WwNYMQ4VbySFRFWgHiShDbjWiEnGKWHurvZPEnj8GY8M7LhqmvbKUFYgzjPrKSjpSF4rgmIP8dhuDWUT0dxZmbhrd_5rLhogMKuY4k-9X00Kav1jGhKtmbhrd_5yXhnoebkCGj1..; l=fBIaWgPRPcvgi6lsBOfwPurza77OSIRAguPzaNbMi9fPOD5w5MmRB1UinYLeC3MNFsQvR3S3hc2kBeYBqQAonxvOw1MjP4Mmnttb57C..; isg=BF1db82O5Idjx4Cr6aHSjiL2bDlXepHMSVD95B8imbTj1n0I58qhnCtEANJQFqmE; _ga_VED1YSGNC7=GS1.1.1702585971.1.1.1702586521.14.0.0; _ga=GA1.1.885247232.1702585970; cto_bundle=irfJol9oQ1RMb080OXRmSyUyQkFnNGNHUGpJN0hQMzA3TnVXRjY3Um5BSlo1MFNPZGhteDYyUFQlMkZRMEU4Z0FsUzM3VCUyRjhxMFhTQ1FBYTBOMVJKSyUyQmMlMkZWR3pUSGZ3c25LT3pVcmR3NngwckhNUGc3Y3Y1a0JSY2ozVm1zenclMkJpNXB4OEs4Qg"
      } else {
        return "ali_apache_id=33.3.20.111.1702585962650.678888.4; acs_usuc_t=x_csrf=8nx8qrep9exs&acs_rt=485dca3186c64e8eb354206aba5405ac; AKA_A2=A; _m_h5_tk=10ba1bb6aecdb672824f066d0c526c8e_1702587856981; _m_h5_tk_enc=7750008d64513183ab439d261cee7b17; e_id=pt70; xlly_s=1; _gid=GA1.2.2136155133.1702585970; _gcl_au=1.1.1695213607.1702585971; cna=c1QCHmBmNB0CAYEteA6D0PDJ; account_v=1; _ym_uid=170258597425757114; _ym_d=1702585974; _ym_isad=1; _ym_visorc=b; AB_DATA_TRACK=472051_617389.455637_622998; AB_ALG=global_union_ab_exp_4%3D2; AB_STG=st_StrategyExp_1694492533501%23stg_687%2Cst_StrategyExp_1695711618618%23stg_685; af_ss_a=1; af_ss_b=1; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005005943671094; intl_locale=ar_MA; XSRF-TOKEN=f90e5229-8dc7-4bd7-a5e3-f03fa9541960; RT=\"z=1&dm=aliexpress.com&si=cf719887-f5c6-49cc-9e93-09699f7761ed&ss=lq5nq879&sl=2&tt=3lo&rl=1&obo=1&ld=2tuk&r=1esw5xemv&ul=2tuk&hd=2ujp\"; havana_tgc=NTGC_4af064990ad42b76e65b44deb0d4128c; _hvn_login=13; x_router_us_f=x_alimid=2720217087; xman_us_t=x_lid=dz1119513087freae&sign=y&rmb_pp=louktila.tk@gmail.com&x_user=FsvZqhzjyC9N9r8UfDqcE8ih7ZaPp9x036ieR7TlWMU=&ctoken=1457kqo8xl7w6&l_source=aliexpress; sgcookie=E100e+PgE32vvuBs4RRbDK1/zcDuOBbY237w+8jCee44/xRljlTdh9V7S7XjXrXg7XrMIcKRzLdmDBiY3MwCpgdUie3P/u9LPMTBVfMa1zCbh8I=; aep_common_f=M+l0+zh1HyHwhuSym0X5YTLkksVK+YKNYp/kuSyps1g4xwkHRoCd3w==; xman_f=1mXsCY+Xl+n3EYdOjIl0/gBLz2Hiqv5U8ewzhAivdy/AiLbLiHXPyLLTUKdWdMYzg3lYH2BIL0DQ3NtqsS/hVyDAb328KQ048sO8Entkv/90t50Tj0cG8IkWwRMvsCUeGick5+SuChArwIW+W2AzmtdYlpJQPoQGPV/nMpT7z02qYZM6bDNYtdpO+Z43PWnoV2sR12ssnkw7bI/2SVT7K6WPLFQxoTNhr6cbX7hBDigFiSsD+R4L7bMADU18JjIa5zhoMfBKoVzUFbh2kyrMn/FbQaXidluAwS6jFit8l/Sq5zd4jsFQzTmkzL1Z1eWXq5h+Zv03q1iMa/MPUTEnfv4j0wdMAK3bP0GVdfdBQC/v+wGV+kkJSAPxRyWe1mlYpMsmcKsvlur4X5w7Ta0GBQ5L3PhEdXfhpCY5f30wBQVlDvBvNG+bZyhhE4fAXhmycQ91+vWfAN0xnFVzQunDxA==; ali_apache_track=mt=1|ms=|mid=dz1119513087freae; ali_apache_tracktmp=W_signed=Y; cto_bundle=mS_5yF9oQ1RMb080OXRmSyUyQkFnNGNHUGpJN0hFV3RKREQxTlNIJTJCOUFjJTJCdXFQc2NqM1JpMlp6cHk3ajNmNlFvdUN4WEZING9WY3J2ZUhqNkJHTW92N1hpZGhyaVV2aXBSRWdNJTJCaXlxMSUyRllNenU4aTlHeklwUVIyS3ZYQkVrbGklMkZYVHBuVg; _ga=GA1.1.885247232.1702585970; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=2720217087&isb=y&region=MA&b_locale=ar_MA; xman_us_f=x_locale=ar_MA&x_l=0&x_user=DZ|hacking|baka|ifm|2720217087&x_lid=dz1119513087freae&x_c_chg=0&acs_rt=485dca3186c64e8eb354206aba5405ac; _ga_VED1YSGNC7=GS1.1.1702585971.1.1.1702586719.1.0.0; JSESSIONID=231040B7F0CFC0E8CFD541DA976BA7F9; intl_common_forever=b3gBP7EcaZRx0S/H9Z0+jBIeSwIkXJ744jFOaU59XeQyra04VnWtZQ==; xman_t=E2mVTpC27TZSuF+BN4q4bDnEPi+M9urlBGmGFNqF5/lPkQVJ7P+kLwKO3vMjMtD5FtE0z27PJ5AWVu9wTXn9B28aZX6FKZRsubgYtTCDulP7ajH1tTtEy2ux3UJ982WM35jgaZjLDc0AHDVOazRvptcMgn9Axvhs7rNRWb8dPCBcyxtZi0jCrZesbGUxhu4A7h/IgZ7/OKvX7zDL68MlBDVzLwZa9WMe/F8UHNfMSQuV0HsV7Gw2MPp63m7Ab7s0STQZ092xUHC8o+IJ0pjDYv3HFhipwp/jyerj/g6mRg0shWI6I6km5w/rTsSXifxJkf5ILpfbB2fqM+tUs+jBaH/YvWldzz6c6xu5BZLmGn/EblZWbUfGFlDSZZKfDxVxUJYnMvRasw5/6Uz1DZnM0Qz9422w1hQ4GDaNhu9AW6QEJGEWCd/K3p5rgCny+rAb7QabSY0ldKu2s+W++apqChDom8xqKov1AN3XENnmNhGezL3rF7HJaqBlaUoQkrRzXM8XhdmVdOUUaH1hV6ybVugABNDc4/ZVgqD0pnnywdCwqH4I2Kb21auDOOjp0Vdtv66HMhq8SRL+XNgG61QBtRcPUZlWM+soPuLD139is2Vekp1a9M2L+u0TBvQSAuTABWaJMgZtRouV1PlmRJOWOkbr7UHaRHtCmOt4/YnKF9z7bGfRwoEoXkNcFy3NDSO+6YEVO0S8vA1R3gr0K+rYYD/VfrqBXpwJ+jTqSOXEbauR92T5/VyO1J0itwLiQm+5; tfstk=eNe270vMKtB2d-tQgbDZLlgN39MxCvQBIRgsjlqicq0cMfNrQzU4GFMs1dugj4wjloMcQc4QzqmmIAvuqcnemd0mjUDoXmJisRg_QGkYFS9slZHajyMNRw6CdoExeAbCRPlyFzHTDdT7B9ZYD3V8j5rAdd7glOSnNA7ei3hP-k3uE2NqRdbLq4JMQUnqi2XKzdvgUmrr-ofpId2r0jIz8FnuMkeTgFAZi0nrRgSr8ClgDEkYaWR96bDK42sjcCdti0nrRgSy6Choy0uCcm1..; l=fBIaWgPRPcvgipttBOfwPurza77OSIRAguPzaNbMi9fP9sCp5juAB1Ui3XL9C3MNF6kMR3S3hc2kBeYBqIvnQ61Gw1MjP4Mmn_vWSGf..; isg=BMTEsE9KfcwzcMmA6CbbFXOJlUK23ehHeP90z95lUA9SCWTTBu241_qrSbnRESCf"
      }
    }
    const headers = {
      "cookie": cookier()
    };
    try {
        const result = {};
        const normal = await axios.get(`https://ar.aliexpress.com/item/${id}.html`, { headers });
        const $ = cheerio.load(normal.data);
        const normalHtml = $('script:contains("window.runParams")');
        const normalContent = normalHtml.html();
        const normalMatch = /window\.runParams\s*=\s*({.*?});/s.exec(normalContent);

        if (normalMatch && normalMatch[1] && normalMatch[1].length > 1000) {
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
  const headers = {
    "cookie": "ali_apache_id=33.3.20.111.1702585962650.678888.4; acs_usuc_t=x_csrf=8nx8qrep9exs&acs_rt=485dca3186c64e8eb354206aba5405ac; AKA_A2=A; _m_h5_tk=10ba1bb6aecdb672824f066d0c526c8e_1702587856981; _m_h5_tk_enc=7750008d64513183ab439d261cee7b17; e_id=pt70; xlly_s=1; _gid=GA1.2.2136155133.1702585970; _gcl_au=1.1.1695213607.1702585971; cna=c1QCHmBmNB0CAYEteA6D0PDJ; account_v=1; _ym_uid=170258597425757114; _ym_d=1702585974; _ym_isad=1; _ym_visorc=b; AB_DATA_TRACK=472051_617389.455637_622998; AB_ALG=global_union_ab_exp_4%3D2; AB_STG=st_StrategyExp_1694492533501%23stg_687%2Cst_StrategyExp_1695711618618%23stg_685; af_ss_a=1; af_ss_b=1; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005005943671094; intl_locale=ar_MA; XSRF-TOKEN=f90e5229-8dc7-4bd7-a5e3-f03fa9541960; RT=\"z=1&dm=aliexpress.com&si=cf719887-f5c6-49cc-9e93-09699f7761ed&ss=lq5nq879&sl=2&tt=3lo&rl=1&obo=1&ld=2tuk&r=1esw5xemv&ul=2tuk&hd=2ujp\"; havana_tgc=NTGC_4af064990ad42b76e65b44deb0d4128c; _hvn_login=13; x_router_us_f=x_alimid=2720217087; xman_us_t=x_lid=dz1119513087freae&sign=y&rmb_pp=louktila.tk@gmail.com&x_user=FsvZqhzjyC9N9r8UfDqcE8ih7ZaPp9x036ieR7TlWMU=&ctoken=1457kqo8xl7w6&l_source=aliexpress; sgcookie=E100e+PgE32vvuBs4RRbDK1/zcDuOBbY237w+8jCee44/xRljlTdh9V7S7XjXrXg7XrMIcKRzLdmDBiY3MwCpgdUie3P/u9LPMTBVfMa1zCbh8I=; aep_common_f=M+l0+zh1HyHwhuSym0X5YTLkksVK+YKNYp/kuSyps1g4xwkHRoCd3w==; xman_f=1mXsCY+Xl+n3EYdOjIl0/gBLz2Hiqv5U8ewzhAivdy/AiLbLiHXPyLLTUKdWdMYzg3lYH2BIL0DQ3NtqsS/hVyDAb328KQ048sO8Entkv/90t50Tj0cG8IkWwRMvsCUeGick5+SuChArwIW+W2AzmtdYlpJQPoQGPV/nMpT7z02qYZM6bDNYtdpO+Z43PWnoV2sR12ssnkw7bI/2SVT7K6WPLFQxoTNhr6cbX7hBDigFiSsD+R4L7bMADU18JjIa5zhoMfBKoVzUFbh2kyrMn/FbQaXidluAwS6jFit8l/Sq5zd4jsFQzTmkzL1Z1eWXq5h+Zv03q1iMa/MPUTEnfv4j0wdMAK3bP0GVdfdBQC/v+wGV+kkJSAPxRyWe1mlYpMsmcKsvlur4X5w7Ta0GBQ5L3PhEdXfhpCY5f30wBQVlDvBvNG+bZyhhE4fAXhmycQ91+vWfAN0xnFVzQunDxA==; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=2720217087&isb=y&region=DZ&b_locale=ar_MA; ali_apache_track=mt=1|ms=|mid=dz1119513087freae; ali_apache_tracktmp=W_signed=Y; xman_us_f=x_locale=ar_MA&x_l=0&x_user=DZ|hacking|baka|ifm|2720217087&x_lid=dz1119513087freae&x_c_chg=0&acs_rt=485dca3186c64e8eb354206aba5405ac; _gat=1; JSESSIONID=DA1BE1F197FF4F063B97905DBBC9B65F; intl_common_forever=o0NI+d3m22lDNIOpetIWYrPDmaEuTFX4k4J6EKg8n5Ho6+TAmNc8mA==; xman_t=rfJ6i7unnKWyVhPN9Bz+YeUZJbWDcqLG5/oQ5LlvC6swKPUopd5rffHDjw9J0iI5VNxH7lB7S+hTBUaUe/0KVszcCLs8U/vEbVyTNAoqcfJoLFgB/Jp66IHIe+dX1H9DjoXr9IIdp/4mB1S+j/fVPbqmawcBpAujEPY3yUMl0x5+Yh/vAaKLCsAjnT2mf/8xlx/QJU4TFjlnBpIK+huny8o/cItt6JaEn9n4GnMyeY03YgmWKuLUwR4GL9ut1vKYcB2i75S6nruLzfnn9OuMR4Fn/eFHkhnGAG86CbF4VWCbrvJkj1Kp6r5U/R33856wKg4SPUrDTzc35DmZSORxn4OPq3i++b4Sf4nSD83uNh1oH7uohhdGC0JdbYsT88nJZAJBDEZ8aDRznGLcMUhRnXHewEgoRovgnMYQjlL3pvxk5WBZN+CQsKWVPOWUq+lb+FycZpzNhs0kU0G/q8WvWomhb7L0sc9BGk9fiyfHViBfJTyaa9BrDr/gyhDc9A1u08akHsGgpzfx7Z40yqLxGqer1UHLhj3NhtFgsO2MelsHeZLpzal9r6iZp2WAp8B7r12atKjxwqJEZz7ik33Hhp32U+2AZ5gz68Jn/5pKbaPbvvBox/Vi+MAFMascZ4lO6BrKFptyl3g83B89+pyBVPNE5a9QgmPrUEkmMxbxicGlqDwZxPlsVdF5ntaeVNVDBaXBWYlFv32GW9zLSFCWCeUaqcl0XcfYR7GTOjBhubfaqRXsv10/bMoCGgdXR1Vo; tfstk=e_427FYM-ZQ2RrOQ000Z85gZa23x-2BBSPMss5ViGxDcDcZr78e4cdgsfFkgsYajhSgc7f2QUxcmSVYuZfheiFDmsL0o6j8ijPM_71uYPoTsht3asJgNd9_CRSFxyVXCdKgJMwuTMF97WwNYMQ4VbySFRFWgHiShDbjWiEnGKWHurvZPEnj8GY8M7LhqmvbKUFYgzjPrKSjpSF4rgmIP8dhuDWUT0dxZmbhrd_5rLhogMKuY4k-9X00Kav1jGhKtmbhrd_5yXhnoebkCGj1..; l=fBIaWgPRPcvgi6lsBOfwPurza77OSIRAguPzaNbMi9fPOD5w5MmRB1UinYLeC3MNFsQvR3S3hc2kBeYBqQAonxvOw1MjP4Mmnttb57C..; isg=BF1db82O5Idjx4Cr6aHSjiL2bDlXepHMSVD95B8imbTj1n0I58qhnCtEANJQFqmE; _ga_VED1YSGNC7=GS1.1.1702585971.1.1.1702586521.14.0.0; _ga=GA1.1.885247232.1702585970; cto_bundle=irfJol9oQ1RMb080OXRmSyUyQkFnNGNHUGpJN0hQMzA3TnVXRjY3Um5BSlo1MFNPZGhteDYyUFQlMkZRMEU4Z0FsUzM3VCUyRjhxMFhTQ1FBYTBOMVJKSyUyQmMlMkZWR3pUSGZ3c25LT3pVcmR3NngwckhNUGc3Y3Y1a0JSY2ozVm1zenclMkJpNXB4OEs4Qg"
  };
  try {
    const idCatcher = async (id) => {
      if (/^\d+$/.test(id)) {
        return id;
      } else if (id.includes("aliexpress.com")) {
        if (/\/(\d+)\.html/.test(id)) {
          return id.match(/\/(\d+)\.html/)[1];
        } else {
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
      if (normalMatch && normalMatch[1] && normalMatch[1].length > 1000) {
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

          var shippingInfo = () => {

            if (prsd.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.unreachable && prsd.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.unreachable == true) {
              var nonDz = { dz: false };
              return nonDz;
            } else {
              var info = {
                type: prsd.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.deliveryProviderName,
                source: prsd.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.shipFromCode,
                deliverDate: prsd.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.deliveryDate,
                deliverRange: `${prsd.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.deliveryDayMin}-${prsd.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.guaranteedDeliveryTime}`
              };
              return info;
            }
          };

          var discount = () => {
            if (prsd.data.priceComponent.coinDiscountText == undefined) {
                return "لا يوجد خصم إضافي ❎"
            } else {
              return prsd.data.priceComponent.coinDiscountText
            }
          };

          const variants = () => {
            const skuArray = JSON.parse(prsd.data.priceComponent.skuJson);
            const resultArray = [];
          
            if (prsd.data.skuComponent.hasSkuProperty) {

              let shippingPropertyId = null;
              const SKUPropertyList = [];
          
              prsd.data.skuComponent.productSKUPropertyList.forEach((property) => {
                if (property.skuPropertyId == 200007763) { // shipping sku
                  if (property.skuPropertyValues.length == 1) {
                    shippingPropertyId = property.skuPropertyValues[0].propertyValueId;
                  } else {
                    const matchingValue = property.skuPropertyValues.find((value) => value.skuPropertySendGoodsCountryCode == shippingInfo().source);
                    if (matchingValue) {
                      shippingPropertyId = matchingValue.propertyValueIdLong;
                    }
                  }
                } else {
                  SKUPropertyList.push(property);
                }
              });
          
              if (shippingPropertyId != null) {
                skuArray.forEach((sku) => {
                  if (sku.skuPropIds.includes(shippingPropertyId)) { resultArray.push(sku); }
                });
                const mappedResultArray = resultArray.map((result) => { return { attr: result.skuAttr.replace(/#[^;]+/g, match => match.replace(/[0-9]/g, '')).replace(/[^0-9:;]/g, ''), id: result.skuId, idStr: result.skuIdStr, linked: result.skuPropIds, available: result.skuVal.availQuantity, price: result.skuVal.skuActivityAmount != undefined && result.skuVal.skuActivityAmount.value || result.skuVal.skuAmount.value, oldPrice: result.skuVal.skuAmount.value }; });
                return { defAttr: prsd.data.skuComponent.selectedSkuAttr.replace(/#[^;]+/g, match => match.replace(/[0-9]/g, '')).replace(/[^0-9:;]/g, ''), shippingid: `200007763:${shippingPropertyId}`, propinfo: mappedResultArray, props: SKUPropertyList  };
              } else {
                const mappedskuArray = skuArray.map((result) => { return { attr: result.skuAttr.replace(/#[^;]+/g, match => match.replace(/[0-9]/g, '')).replace(/[^0-9:;]/g, ''), id: result.skuId, idStr: result.skuIdStr, linked: result.skuPropIds, available: result.skuVal.availQuantity, price: result.skuVal.skuActivityAmount != undefined && result.skuVal.skuActivityAmount.value || result.skuVal.skuAmount.value, oldPrice: result.skuVal.skuAmount.value }; });
                return { defAttr: prsd.data.skuComponent.selectedSkuAttr.replace(/#[^;]+/g, match => match.replace(/[0-9]/g, '')).replace(/[^0-9:;]/g, ''), shippingid: "Auto", propinfo: mappedskuArray, props : SKUPropertyList };
              }
            }
          
            return "No SKU property available";
          };
          
          
          

          var shaped = {
              name: prsd.data.metaDataComponent.title.replace("| |   - AliExpress", ""),
              cover: prsd.data.imageComponent.imagePathList[0],
              shipping: shipping(),
              shippingInfo: shippingInfo(),
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
          const skuImagesArray = prsd.data.skuComponent;

          // shipFromCode // webGeneralFreightCalculateComponent
          
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
