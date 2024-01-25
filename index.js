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
      return "ali_apache_id=33.3.36.241.1706183961879.567050.2; acs_usuc_t=x_csrf=idvo120rhuf6&acs_rt=c01637bc08e24fda91267b290bee0346; AKA_A2=A; _m_h5_tk=ddf53b64198174c9acbbc78b74da6dbe_1706186308306; _m_h5_tk_enc=011402ca99eb40ee68b5ca030d3bcd59; _gid=GA1.2.892236737.1706183969; e_id=pt70; _gcl_au=1.1.1855174504.1706183970; cna=Ijs5HvSLwWECAYEtNQbMtA/s; _ym_uid=1706183973406278332; _ym_d=1706183973; _ym_isad=1; xlly_s=1; _ym_visorc=b; havana_tgc=NTGC_287f13972f0b47b0883384235528357f; _hvn_login=13; x_router_us_f=x_alimid=2720217087; xman_us_t=x_lid=dz1119513087freae&sign=y&rmb_pp=louktila.tk@gmail.com&x_user=ukrde/VlGlB4DqbUhDxH3IiCBQETcK35/4C81eN2idY=&ctoken=j_77y_3joc79&l_source=aliexpress; sgcookie=E100K1psNQsIXjFyYiwBByfjoGkq5UcORXlOnMqVljVpef67DDz3N9A0VVolNxrP+zBgN6L8+kmHj9JemQd6licdJq4eT1brImXh5Nr7Kgo1/ls=; aep_common_f=LUUeTFeCVgS0/K2FIuu6uaxDSWyhXOVLli8TrZ3P8DPj5Fs5N07+rQ==; xman_f=Rp9nAtazoiA8dotK3rmH9XO4nvXVNdM384WekzilY/WvM4rtL0MW6GWTAiV4SKOQ9GMrsGDnRaD0tLb55JaQm6LY+guBQ5K6MUD2Er6sJ8nQXZ7ER1AIhMHXZR14j0vTnKYfwtiY9GHtlNQyomFM9YIdECxBWu1sY8R1g4xq+Ed1Pa0QTgKP4dghXt1gc7gezy2rRz8fovkCXimnEX9WoUS95beBhppruyFvokt6Naz402rSNTyUpA4YOQKy2PgCA9bsy00MLfyjkmfDESlboZhmos4AU5yMS2SwwuQiBCjaOoDtp8uO9zHGfttuAZUsiLurBLsEoMUKR/6tM/3qdXbLbws+d5z4OymMOcrlmQfGC1y17w336tiGeQk8XpzRwGzMaCdvXqJCYyJWSlk3gwLrlxdhg4YT; ali_apache_track=mt=1|ms=|mid=dz1119513087freae; ali_apache_tracktmp=W_signed=Y; _history_login_user_info={\"userName\":\"hacking\",\"avatar\":\"https://ae01.alicdn.com/kf/Ae471be8be30049709844f4093924cb335.jpg_100x100.jpg\",\"accountNumber\":\"louktila.tk@gmail.com\",\"phonePrefix\":\"\",\"expiresTime\":1708775992271}; AB_DATA_TRACK=472051_617390; AB_ALG=; AB_STG=st_StrategyExp_1694492533501%23stg_687; JSESSIONID=7FE517109B2B727DF4E4993F4DC5F5BB; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005003306566248; _ga=GA1.1.1184199041.1706183969; intl_locale=en_US; aep_usuc_f=site=glo&province=null&city=null&c_tp=USD&x_alimid=2720217087&ups_d=0|0|0|0&isb=y&ups_u_t=&region=DZ&b_locale=en_US&ae_u_p_s=1; xman_us_f=x_locale=en_US&x_l=0&x_user=DZ|hacking|baka|ifm|2720217087&x_lid=dz1119513087freae&x_c_chg=1&acs_rt=c01637bc08e24fda91267b290bee0346; _ga_VED1YSGNC7=GS1.1.1706183971.1.1.1706184964.38.0.0; isg=BCsr_HciysD4gRaUwPsOG0aguk8VQD_Ca6oLMp2oB2rBPEueJRDPEsmekmRSHJe6; tfstk=eCa2n3TM-ZQVkRdQ000Z4O2ehv0x52BCuPMss5ViGxDDlE9g4RwuGoTs5cYas5nglqNbUIUzLFTfHiFM7VgGd9_CRSCxWVXQnl7QySecNd8RRwNYiuDbbmQCMD0SRM63wCdqGikYgObirX_bXvVmERw_rjJIKSDySFDqgmS7iY8MSzIrddhuDWUT0dxZmbhrd_5rLhogMNwojp-9X00Kav1jGhKtmbhrd_5yXhnoebkCGj1..; l=fBP0fcLePGkcC_FkKOfaFurza77OSIRYYuPzaNbMi9fP_XfB5q9FW1Q2m1L6C3MNF68pR3S3hc2kBeYBqQAonxvOeSYFYMkmndLHR35..; cna=KDs5HilqDDUCAYEtNQZPtUPI; intl_common_forever=ilMD93lchwJXQlPtCcbmZfGfiO7tRinNA/3xJHK+71stTuhLzShljg==; xman_t=cN2TOl55gBJcHPe6YDTtE+FsIkVMTdqzzYV53lOlTReBZypQ0ujjsesd4Cmim+J/ZiQtjIPbI1vPuKbgly5Ef3GNaXV9By0ePFgZEnDujhJkGxhNdtwOo1Womm241q4ZuqgORnnB3NbS7yHbXuK0ombmQdeoYngNycotn0m3uW2sV71YUsU3ZZuoBcyjWdFRWUpt3gi+nbBWkcHMqCgS7gwVrbEWUfxv7epwlWm/nPdfh6PeXR0/w1Nbm+c5ccX4xJAXfi+HQYa2tkRmoKDS6U1TIo3pK1kzOndIhzoQ7f3kPKLIzOjRabIEclRLc5p9O6At/qMh6syLvtSpgm9wZlZp9uKgAdkVaT6MbXMtyIdSu53OR6pgPbqiCr+HsBRTPsG/z0o/94UKIwGKZWvHOvZ/0+vW4Sxhatwon58vPgmtzMiVj8hmDbZkThHyK4PbVQPwkZa3KiLllL6fXG5OpBqJCKWI3oG5ZlRshYuhEDV36gYeV8o3gdOF0FeFqsXxiJ0j+LiJpDuUJ1k0VJ9yFp8A1PBpL+Jny9DAChKqv2Pgr9Ft4Isj+L2rbWmHjiVVGtybreL9cxO2cte3bQ7z72zCieu0viDYAizdEPv+cs21wCsCnaEZsbtx9T1WXmbXVW2TzZSvYWn5sdd2XsecG6mpTLeKoZ5o6maB225hoZvEuCeVc3IrwDotrnEfBaaaQMfHhWPk4LGCUB3tyyn4ueb7uYajFvIeweHtj+9zkDVykW8HqLnaEn6pbJVWtwqb; RT=\"z=1&dm=aliexpress.com&si=0652fe2b-686f-4254-9214-4348b0821a4a&ss=lrt5wivr&sl=9&tt=vh4&obo=5&rl=1&ld=kvb4&r=50ejekiz&ul=kvb4\""
    } else {
      return "ali_apache_id=33.3.20.111.1702585962650.678888.4; acs_usuc_t=x_csrf=8nx8qrep9exs&acs_rt=485dca3186c64e8eb354206aba5405ac; AKA_A2=A; _m_h5_tk=10ba1bb6aecdb672824f066d0c526c8e_1702587856981; _m_h5_tk_enc=7750008d64513183ab439d261cee7b17; e_id=pt70; xlly_s=1; _gid=GA1.2.2136155133.1702585970; _gcl_au=1.1.1695213607.1702585971; cna=c1QCHmBmNB0CAYEteA6D0PDJ; account_v=1; _ym_uid=170258597425757114; _ym_d=1702585974; _ym_isad=1; _ym_visorc=b; AB_DATA_TRACK=472051_617389.455637_622998; AB_ALG=global_union_ab_exp_4%3D2; AB_STG=st_StrategyExp_1694492533501%23stg_687%2Cst_StrategyExp_1695711618618%23stg_685; af_ss_a=1; af_ss_b=1; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005005943671094; intl_locale=ar_MA; XSRF-TOKEN=f90e5229-8dc7-4bd7-a5e3-f03fa9541960; RT=\"z=1&dm=aliexpress.com&si=cf719887-f5c6-49cc-9e93-09699f7761ed&ss=lq5nq879&sl=2&tt=3lo&rl=1&obo=1&ld=2tuk&r=1esw5xemv&ul=2tuk&hd=2ujp\"; havana_tgc=NTGC_4af064990ad42b76e65b44deb0d4128c; _hvn_login=13; x_router_us_f=x_alimid=2720217087; xman_us_t=x_lid=dz1119513087freae&sign=y&rmb_pp=louktila.tk@gmail.com&x_user=FsvZqhzjyC9N9r8UfDqcE8ih7ZaPp9x036ieR7TlWMU=&ctoken=1457kqo8xl7w6&l_source=aliexpress; sgcookie=E100e+PgE32vvuBs4RRbDK1/zcDuOBbY237w+8jCee44/xRljlTdh9V7S7XjXrXg7XrMIcKRzLdmDBiY3MwCpgdUie3P/u9LPMTBVfMa1zCbh8I=; aep_common_f=M+l0+zh1HyHwhuSym0X5YTLkksVK+YKNYp/kuSyps1g4xwkHRoCd3w==; xman_f=1mXsCY+Xl+n3EYdOjIl0/gBLz2Hiqv5U8ewzhAivdy/AiLbLiHXPyLLTUKdWdMYzg3lYH2BIL0DQ3NtqsS/hVyDAb328KQ048sO8Entkv/90t50Tj0cG8IkWwRMvsCUeGick5+SuChArwIW+W2AzmtdYlpJQPoQGPV/nMpT7z02qYZM6bDNYtdpO+Z43PWnoV2sR12ssnkw7bI/2SVT7K6WPLFQxoTNhr6cbX7hBDigFiSsD+R4L7bMADU18JjIa5zhoMfBKoVzUFbh2kyrMn/FbQaXidluAwS6jFit8l/Sq5zd4jsFQzTmkzL1Z1eWXq5h+Zv03q1iMa/MPUTEnfv4j0wdMAK3bP0GVdfdBQC/v+wGV+kkJSAPxRyWe1mlYpMsmcKsvlur4X5w7Ta0GBQ5L3PhEdXfhpCY5f30wBQVlDvBvNG+bZyhhE4fAXhmycQ91+vWfAN0xnFVzQunDxA==; ali_apache_track=mt=1|ms=|mid=dz1119513087freae; ali_apache_tracktmp=W_signed=Y; cto_bundle=mS_5yF9oQ1RMb080OXRmSyUyQkFnNGNHUGpJN0hFV3RKREQxTlNIJTJCOUFjJTJCdXFQc2NqM1JpMlp6cHk3ajNmNlFvdUN4WEZING9WY3J2ZUhqNkJHTW92N1hpZGhyaVV2aXBSRWdNJTJCaXlxMSUyRllNenU4aTlHeklwUVIyS3ZYQkVrbGklMkZYVHBuVg; _ga=GA1.1.885247232.1702585970; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=2720217087&isb=y&region=MA&b_locale=ar_MA; xman_us_f=x_locale=ar_MA&x_l=0&x_user=DZ|hacking|baka|ifm|2720217087&x_lid=dz1119513087freae&x_c_chg=0&acs_rt=485dca3186c64e8eb354206aba5405ac; _ga_VED1YSGNC7=GS1.1.1702585971.1.1.1702586719.1.0.0; JSESSIONID=231040B7F0CFC0E8CFD541DA976BA7F9; intl_common_forever=b3gBP7EcaZRx0S/H9Z0+jBIeSwIkXJ744jFOaU59XeQyra04VnWtZQ==; xman_t=E2mVTpC27TZSuF+BN4q4bDnEPi+M9urlBGmGFNqF5/lPkQVJ7P+kLwKO3vMjMtD5FtE0z27PJ5AWVu9wTXn9B28aZX6FKZRsubgYtTCDulP7ajH1tTtEy2ux3UJ982WM35jgaZjLDc0AHDVOazRvptcMgn9Axvhs7rNRWb8dPCBcyxtZi0jCrZesbGUxhu4A7h/IgZ7/OKvX7zDL68MlBDVzLwZa9WMe/F8UHNfMSQuV0HsV7Gw2MPp63m7Ab7s0STQZ092xUHC8o+IJ0pjDYv3HFhipwp/jyerj/g6mRg0shWI6I6km5w/rTsSXifxJkf5ILpfbB2fqM+tUs+jBaH/YvWldzz6c6xu5BZLmGn/EblZWbUfGFlDSZZKfDxVxUJYnMvRasw5/6Uz1DZnM0Qz9422w1hQ4GDaNhu9AW6QEJGEWCd/K3p5rgCny+rAb7QabSY0ldKu2s+W++apqChDom8xqKov1AN3XENnmNhGezL3rF7HJaqBlaUoQkrRzXM8XhdmVdOUUaH1hV6ybVugABNDc4/ZVgqD0pnnywdCwqH4I2Kb21auDOOjp0Vdtv66HMhq8SRL+XNgG61QBtRcPUZlWM+soPuLD139is2Vekp1a9M2L+u0TBvQSAuTABWaJMgZtRouV1PlmRJOWOkbr7UHaRHtCmOt4/YnKF9z7bGfRwoEoXkNcFy3NDSO+6YEVO0S8vA1R3gr0K+rYYD/VfrqBXpwJ+jTqSOXEbauR92T5/VyO1J0itwLiQm+5; tfstk=eNe270vMKtB2d-tQgbDZLlgN39MxCvQBIRgsjlqicq0cMfNrQzU4GFMs1dugj4wjloMcQc4QzqmmIAvuqcnemd0mjUDoXmJisRg_QGkYFS9slZHajyMNRw6CdoExeAbCRPlyFzHTDdT7B9ZYD3V8j5rAdd7glOSnNA7ei3hP-k3uE2NqRdbLq4JMQUnqi2XKzdvgUmrr-ofpId2r0jIz8FnuMkeTgFAZi0nrRgSr8ClgDEkYaWR96bDK42sjcCdti0nrRgSy6Choy0uCcm1..; l=fBIaWgPRPcvgipttBOfwPurza77OSIRAguPzaNbMi9fP9sCp5juAB1Ui3XL9C3MNF6kMR3S3hc2kBeYBqIvnQ61Gw1MjP4Mmn_vWSGf..; isg=BMTEsE9KfcwzcMmA6CbbFXOJlUK23ehHeP90z95lUA9SCWTTBu241_qrSbnRESCf"
    }
  };

  const headers = {
    "cookie": cookier()
  };

  try {
    const result = {};


    const requests = [
      axios.get(`https://ar.aliexpress.com/item/${id}.html`, { headers }),
      axios.get(`https://ar.aliexpress.com/i/${id}.html?sourceType=620&aff_fcid=`, { headers }),
      axios.get(`https://ar.aliexpress.com/i/${id}.html?sourceType=562&aff_fcid=`, { headers }),
      axios.get(`https://ar.aliexpress.com/i/${id}.html?sourceType=561&aff_fcid=`, { headers })
    ];

    const responses = await Promise.all(requests);

    responses.forEach((response, index) => {
      const $ = cheerio.load(response.data);
      const html = $('script:contains("window.runParams")');
      const content = html.html();
      const match = /window\.runParams\s*=\s*({.*?});/s.exec(content);

      if (match && match[1] && match[1].length > 1000) {
        const data = eval(`(${match[1]})`);

        switch (index) {
          case 0: // Normal
          var shipping = () => {
            if (data.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.displayAmount == undefined) {
              return "Free Shipping"
            } else {
              return data.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.displayAmount
            }
          };
          
          var discount = () => {
            if (data.data.priceComponent.coinDiscountText == undefined) {
              return "لا يوجد خصم إضافي ❎"
            } else {
              return data.data.priceComponent.coinDiscountText
            }
          };

          var coupon = () => {
            if (data.data.webCouponInfoComponent.promotionPanelDTO.shopCoupon == undefined) {
              return "لا يوجد كوبونات ❎"
            } else {
              let copo = []
              for (const promotion of data.data.webCouponInfoComponent.promotionPanelDTO.shopCoupon) {
                for (const coupon of promotion.promotionPanelDetailDTOList) {
                  const content = {
                    code: coupon.attributes.couponCode,
                    detail: coupon.promotionDetail,
                    desc: coupon.promotionDesc,
                  };
                  copo.push(content)
                }
              }
              return copo
            }
          };
          
          var shaped = {
            name: data.data.metaDataComponent.title.replace("| |   - AliExpress", ""),
            image: data.data.imageComponent.imagePathList[0],
            shipping: shipping(),
            rate: data.data.feedbackComponent.evarageStar,
            totalRates: data.data.feedbackComponent.totalValidNum,
            price: data.data.priceComponent.origPrice.minAmount.formatedAmount,
            discountPrice: data.data.priceComponent.discountPrice.minActivityAmount != undefined && data.data.priceComponent.discountPrice.minActivityAmount.formatedAmount || "No discount Price",
            sales: data.data.tradeComponent.formatTradeCount,
            discount: discount(),
            coupon: coupon(),
            store: data.data.sellerComponent.storeName,
            storeRate: data.data.storeFeedbackComponent.sellerPositiveRate
          };
          
          result['normal'] = shaped;
          break;
          case 1: // Points
          var discount = () => {
            if (data.data.priceComponent.coinDiscountText == undefined) {
              return "لا توجد نسبة تخفيض بالعملات ❎"
            } else {
              var clean = data.data.priceComponent.coinDiscountText.match(/\d+/g);
              return `خصم النقاط ${clean}%`
            }
          };

          var price_fun = () => {
            if (data.data.priceComponent.discountPrice.minActivityAmount != undefined) {
              return data.data.priceComponent.discountPrice.minActivityAmount.formatedAmount;
            } else {
              return data.data.priceComponent.origPrice.minAmount.formatedAmount;
            }
          };
          
          var total = () => {
            if (data.data.priceComponent.coinDiscountText != undefined) {
              var pers = data.data.priceComponent.coinDiscountText.match(/\d+/g);
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
          break;
          case 2: // Super
          var price_fun = () => {
            if (data.data.priceComponent.discountPrice.minActivityAmount != undefined) {
              return data.data.priceComponent.discountPrice.minActivityAmount.formatedAmount;
            } else {
              return data.data.priceComponent.origPrice.minAmount.formatedAmount;
            }
          };
          
          var shaped = {
            price: price_fun(),
          };

          result['super'] = shaped;
          break;
          case 3: // Limited
          var price_fun = () => {
            if (data.data.priceComponent.discountPrice.minActivityAmount != undefined) {
              return data.data.priceComponent.discountPrice.minActivityAmount.formatedAmount;
            } else {
              return data.data.priceComponent.origPrice.minAmount.formatedAmount;
            }
          };
          
          var shaped = {
            price: price_fun(),
          };
          result['limited'] = shaped;
          break;
        }

      } else {
        res.json({ ok : false});
        console.error(`Unable to extract data from response ${index + 1}.`);
      }
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
            const mappedResultArray = resultArray.map((result) => { return { attr: result.skuAttr.replace(/#[^;]+/g, match => match.replace(/[0-9]/g, '')).replace(/[^0-9:;]/g, '').replace(`;200007763:${shippingPropertyId}`, "").replace(`200007763:${shippingPropertyId};`, ""), id: result.skuId, idStr: result.skuIdStr, linked: result.skuPropIds, available: result.skuVal.availQuantity, price: result.skuVal.skuActivityAmount != undefined && result.skuVal.skuActivityAmount.value || result.skuVal.skuAmount.value, oldPrice: result.skuVal.skuAmount.value }; });
            return { defAttr: prsd.data.skuComponent.selectedSkuAttr.replace(/#[^;]+/g, match => match.replace(/[0-9]/g, '')).replace(/[^0-9:;]/g, '').replace(`;200007763:${shippingPropertyId}`, "").replace(`200007763:${shippingPropertyId};`, ""), shippingid: `200007763:${shippingPropertyId}`, propinfo: mappedResultArray, props: SKUPropertyList };
          } else {
            const mappedskuArray = skuArray.map((result) => { return { attr: result.skuAttr.replace(/#[^;]+/g, match => match.replace(/[0-9]/g, '')).replace(/[^0-9:;]/g, ''), id: result.skuId, idStr: result.skuIdStr, linked: result.skuPropIds, available: result.skuVal.availQuantity, price: result.skuVal.skuActivityAmount != undefined && result.skuVal.skuActivityAmount.value || result.skuVal.skuAmount.value, oldPrice: result.skuVal.skuAmount.value }; });
            return { defAttr: prsd.data.skuComponent.selectedSkuAttr.replace(/#[^;]+/g, match => match.replace(/[0-9]/g, '')).replace(/[^0-9:;]/g, ''), shippingid: "Auto", propinfo: mappedskuArray, props: SKUPropertyList };
          }
        }

        return "No SKU property available";
      };




      var shaped = {
        name: prsd.data.metaDataComponent.title.replace(" - AliExpress", "").replace("|", " "),
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
      res.json({ ok: false });
      console.error('Unable to extract window.runParams data.');
    }
  } catch (error) {
    console.log(error.message)
  }
});

app.get('/coinz', async (req, res) => {
  const { id } = req.query;
  const headers = {
    "cookie": "ali_apache_id=33.3.20.111.1702585962650.678888.4; acs_usuc_t=x_csrf=8nx8qrep9exs&acs_rt=485dca3186c64e8eb354206aba5405ac; AKA_A2=A; _m_h5_tk=10ba1bb6aecdb672824f066d0c526c8e_1702587856981; _m_h5_tk_enc=7750008d64513183ab439d261cee7b17; e_id=pt70; xlly_s=1; _gid=GA1.2.2136155133.1702585970; _gcl_au=1.1.1695213607.1702585971; cna=c1QCHmBmNB0CAYEteA6D0PDJ; account_v=1; _ym_uid=170258597425757114; _ym_d=1702585974; _ym_isad=1; _ym_visorc=b; AB_DATA_TRACK=472051_617389.455637_622998; AB_ALG=global_union_ab_exp_4%3D2; AB_STG=st_StrategyExp_1694492533501%23stg_687%2Cst_StrategyExp_1695711618618%23stg_685; af_ss_a=1; af_ss_b=1; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005005943671094; intl_locale=ar_MA; XSRF-TOKEN=f90e5229-8dc7-4bd7-a5e3-f03fa9541960; RT=\"z=1&dm=aliexpress.com&si=cf719887-f5c6-49cc-9e93-09699f7761ed&ss=lq5nq879&sl=2&tt=3lo&rl=1&obo=1&ld=2tuk&r=1esw5xemv&ul=2tuk&hd=2ujp\"; havana_tgc=NTGC_4af064990ad42b76e65b44deb0d4128c; _hvn_login=13; x_router_us_f=x_alimid=2720217087; xman_us_t=x_lid=dz1119513087freae&sign=y&rmb_pp=louktila.tk@gmail.com&x_user=FsvZqhzjyC9N9r8UfDqcE8ih7ZaPp9x036ieR7TlWMU=&ctoken=1457kqo8xl7w6&l_source=aliexpress; sgcookie=E100e+PgE32vvuBs4RRbDK1/zcDuOBbY237w+8jCee44/xRljlTdh9V7S7XjXrXg7XrMIcKRzLdmDBiY3MwCpgdUie3P/u9LPMTBVfMa1zCbh8I=; aep_common_f=M+l0+zh1HyHwhuSym0X5YTLkksVK+YKNYp/kuSyps1g4xwkHRoCd3w==; xman_f=1mXsCY+Xl+n3EYdOjIl0/gBLz2Hiqv5U8ewzhAivdy/AiLbLiHXPyLLTUKdWdMYzg3lYH2BIL0DQ3NtqsS/hVyDAb328KQ048sO8Entkv/90t50Tj0cG8IkWwRMvsCUeGick5+SuChArwIW+W2AzmtdYlpJQPoQGPV/nMpT7z02qYZM6bDNYtdpO+Z43PWnoV2sR12ssnkw7bI/2SVT7K6WPLFQxoTNhr6cbX7hBDigFiSsD+R4L7bMADU18JjIa5zhoMfBKoVzUFbh2kyrMn/FbQaXidluAwS6jFit8l/Sq5zd4jsFQzTmkzL1Z1eWXq5h+Zv03q1iMa/MPUTEnfv4j0wdMAK3bP0GVdfdBQC/v+wGV+kkJSAPxRyWe1mlYpMsmcKsvlur4X5w7Ta0GBQ5L3PhEdXfhpCY5f30wBQVlDvBvNG+bZyhhE4fAXhmycQ91+vWfAN0xnFVzQunDxA==; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=2720217087&isb=y&region=DZ&b_locale=ar_MA; ali_apache_track=mt=1|ms=|mid=dz1119513087freae; ali_apache_tracktmp=W_signed=Y; xman_us_f=x_locale=ar_MA&x_l=0&x_user=DZ|hacking|baka|ifm|2720217087&x_lid=dz1119513087freae&x_c_chg=0&acs_rt=485dca3186c64e8eb354206aba5405ac; _gat=1; JSESSIONID=DA1BE1F197FF4F063B97905DBBC9B65F; intl_common_forever=o0NI+d3m22lDNIOpetIWYrPDmaEuTFX4k4J6EKg8n5Ho6+TAmNc8mA==; xman_t=rfJ6i7unnKWyVhPN9Bz+YeUZJbWDcqLG5/oQ5LlvC6swKPUopd5rffHDjw9J0iI5VNxH7lB7S+hTBUaUe/0KVszcCLs8U/vEbVyTNAoqcfJoLFgB/Jp66IHIe+dX1H9DjoXr9IIdp/4mB1S+j/fVPbqmawcBpAujEPY3yUMl0x5+Yh/vAaKLCsAjnT2mf/8xlx/QJU4TFjlnBpIK+huny8o/cItt6JaEn9n4GnMyeY03YgmWKuLUwR4GL9ut1vKYcB2i75S6nruLzfnn9OuMR4Fn/eFHkhnGAG86CbF4VWCbrvJkj1Kp6r5U/R33856wKg4SPUrDTzc35DmZSORxn4OPq3i++b4Sf4nSD83uNh1oH7uohhdGC0JdbYsT88nJZAJBDEZ8aDRznGLcMUhRnXHewEgoRovgnMYQjlL3pvxk5WBZN+CQsKWVPOWUq+lb+FycZpzNhs0kU0G/q8WvWomhb7L0sc9BGk9fiyfHViBfJTyaa9BrDr/gyhDc9A1u08akHsGgpzfx7Z40yqLxGqer1UHLhj3NhtFgsO2MelsHeZLpzal9r6iZp2WAp8B7r12atKjxwqJEZz7ik33Hhp32U+2AZ5gz68Jn/5pKbaPbvvBox/Vi+MAFMascZ4lO6BrKFptyl3g83B89+pyBVPNE5a9QgmPrUEkmMxbxicGlqDwZxPlsVdF5ntaeVNVDBaXBWYlFv32GW9zLSFCWCeUaqcl0XcfYR7GTOjBhubfaqRXsv10/bMoCGgdXR1Vo; tfstk=e_427FYM-ZQ2RrOQ000Z85gZa23x-2BBSPMss5ViGxDcDcZr78e4cdgsfFkgsYajhSgc7f2QUxcmSVYuZfheiFDmsL0o6j8ijPM_71uYPoTsht3asJgNd9_CRSFxyVXCdKgJMwuTMF97WwNYMQ4VbySFRFWgHiShDbjWiEnGKWHurvZPEnj8GY8M7LhqmvbKUFYgzjPrKSjpSF4rgmIP8dhuDWUT0dxZmbhrd_5rLhogMKuY4k-9X00Kav1jGhKtmbhrd_5yXhnoebkCGj1..; l=fBIaWgPRPcvgi6lsBOfwPurza77OSIRAguPzaNbMi9fPOD5w5MmRB1UinYLeC3MNFsQvR3S3hc2kBeYBqQAonxvOw1MjP4Mmnttb57C..; isg=BF1db82O5Idjx4Cr6aHSjiL2bDlXepHMSVD95B8imbTj1n0I58qhnCtEANJQFqmE; _ga_VED1YSGNC7=GS1.1.1702585971.1.1.1702586521.14.0.0; _ga=GA1.1.885247232.1702585970; cto_bundle=irfJol9oQ1RMb080OXRmSyUyQkFnNGNHUGpJN0hQMzA3TnVXRjY3Um5BSlo1MFNPZGhteDYyUFQlMkZRMEU4Z0FsUzM3VCUyRjhxMFhTQ1FBYTBOMVJKSyUyQmMlMkZWR3pUSGZ3c25LT3pVcmR3NngwckhNUGc3Y3Y1a0JSY2ozVm1zenclMkJpNXB4OEs4Qg"
  };
  try {
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

      var shipping = () => {
        if (parseEval.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.displayAmount == undefined) {
          return "Free Shipping"
        } else {
          return parseEval.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.displayAmount
        }
      };

      var shaped = {
        name: parseEval.data.metaDataComponent.title.replace("| |   - AliExpress", ""),
        image: parseEval.data.imageComponent.imagePathList[0],
        shipping: shipping(),
        rate: parseEval.data.feedbackComponent.evarageStar,
        totalRates: parseEval.data.feedbackComponent.totalValidNum,
        price: parseEval.data.priceComponent.origPrice.minAmount.formatedAmount,
        discountPrice: price_fun(),
        sales: parseEval.data.tradeComponent.formatTradeCount,
        discount: discount(),
        total: total(),
        store: parseEval.data.sellerComponent.storeName,
        storeRate: parseEval.data.storeFeedbackComponent.sellerPositiveRate
      };

      res.json(shaped);
    } else {
      console.error('Unable to extract window.runParams data.');
    }
  } catch (error) {
    console.log(error.message)
  }
});

app.get('/test', async (req, res) => {
  const { id } = req.query;
  const { region } = req.query;
  const defaultRegion = region || "DZ";
  const cookier = () => {
    if (defaultRegion == "DZ") {
      return "ali_apache_id=33.3.20.111.1702585962650.678888.4; acs_usuc_t=x_csrf=8nx8qrep9exs&acs_rt=485dca3186c64e8eb354206aba5405ac; AKA_A2=A; _m_h5_tk=10ba1bb6aecdb672824f066d0c526c8e_1702587856981; _m_h5_tk_enc=7750008d64513183ab439d261cee7b17; e_id=pt70; xlly_s=1; _gid=GA1.2.2136155133.1702585970; _gcl_au=1.1.1695213607.1702585971; cna=c1QCHmBmNB0CAYEteA6D0PDJ; account_v=1; _ym_uid=170258597425757114; _ym_d=1702585974; _ym_isad=1; _ym_visorc=b; AB_DATA_TRACK=472051_617389.455637_622998; AB_ALG=global_union_ab_exp_4%3D2; AB_STG=st_StrategyExp_1694492533501%23stg_687%2Cst_StrategyExp_1695711618618%23stg_685; af_ss_a=1; af_ss_b=1; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005005943671094; intl_locale=ar_MA; XSRF-TOKEN=f90e5229-8dc7-4bd7-a5e3-f03fa9541960; RT=\"z=1&dm=aliexpress.com&si=cf719887-f5c6-49cc-9e93-09699f7761ed&ss=lq5nq879&sl=2&tt=3lo&rl=1&obo=1&ld=2tuk&r=1esw5xemv&ul=2tuk&hd=2ujp\"; havana_tgc=NTGC_4af064990ad42b76e65b44deb0d4128c; _hvn_login=13; x_router_us_f=x_alimid=2720217087; xman_us_t=x_lid=dz1119513087freae&sign=y&rmb_pp=louktila.tk@gmail.com&x_user=FsvZqhzjyC9N9r8UfDqcE8ih7ZaPp9x036ieR7TlWMU=&ctoken=1457kqo8xl7w6&l_source=aliexpress; sgcookie=E100e+PgE32vvuBs4RRbDK1/zcDuOBbY237w+8jCee44/xRljlTdh9V7S7XjXrXg7XrMIcKRzLdmDBiY3MwCpgdUie3P/u9LPMTBVfMa1zCbh8I=; aep_common_f=M+l0+zh1HyHwhuSym0X5YTLkksVK+YKNYp/kuSyps1g4xwkHRoCd3w==; xman_f=1mXsCY+Xl+n3EYdOjIl0/gBLz2Hiqv5U8ewzhAivdy/AiLbLiHXPyLLTUKdWdMYzg3lYH2BIL0DQ3NtqsS/hVyDAb328KQ048sO8Entkv/90t50Tj0cG8IkWwRMvsCUeGick5+SuChArwIW+W2AzmtdYlpJQPoQGPV/nMpT7z02qYZM6bDNYtdpO+Z43PWnoV2sR12ssnkw7bI/2SVT7K6WPLFQxoTNhr6cbX7hBDigFiSsD+R4L7bMADU18JjIa5zhoMfBKoVzUFbh2kyrMn/FbQaXidluAwS6jFit8l/Sq5zd4jsFQzTmkzL1Z1eWXq5h+Zv03q1iMa/MPUTEnfv4j0wdMAK3bP0GVdfdBQC/v+wGV+kkJSAPxRyWe1mlYpMsmcKsvlur4X5w7Ta0GBQ5L3PhEdXfhpCY5f30wBQVlDvBvNG+bZyhhE4fAXhmycQ91+vWfAN0xnFVzQunDxA==; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=2720217087&isb=y&region=DZ&b_locale=ar_MA; ali_apache_track=mt=1|ms=|mid=dz1119513087freae; ali_apache_tracktmp=W_signed=Y; xman_us_f=x_locale=ar_MA&x_l=0&x_user=DZ|hacking|baka|ifm|2720217087&x_lid=dz1119513087freae&x_c_chg=0&acs_rt=485dca3186c64e8eb354206aba5405ac; _gat=1; JSESSIONID=DA1BE1F197FF4F063B97905DBBC9B65F; intl_common_forever=o0NI+d3m22lDNIOpetIWYrPDmaEuTFX4k4J6EKg8n5Ho6+TAmNc8mA==; xman_t=rfJ6i7unnKWyVhPN9Bz+YeUZJbWDcqLG5/oQ5LlvC6swKPUopd5rffHDjw9J0iI5VNxH7lB7S+hTBUaUe/0KVszcCLs8U/vEbVyTNAoqcfJoLFgB/Jp66IHIe+dX1H9DjoXr9IIdp/4mB1S+j/fVPbqmawcBpAujEPY3yUMl0x5+Yh/vAaKLCsAjnT2mf/8xlx/QJU4TFjlnBpIK+huny8o/cItt6JaEn9n4GnMyeY03YgmWKuLUwR4GL9ut1vKYcB2i75S6nruLzfnn9OuMR4Fn/eFHkhnGAG86CbF4VWCbrvJkj1Kp6r5U/R33856wKg4SPUrDTzc35DmZSORxn4OPq3i++b4Sf4nSD83uNh1oH7uohhdGC0JdbYsT88nJZAJBDEZ8aDRznGLcMUhRnXHewEgoRovgnMYQjlL3pvxk5WBZN+CQsKWVPOWUq+lb+FycZpzNhs0kU0G/q8WvWomhb7L0sc9BGk9fiyfHViBfJTyaa9BrDr/gyhDc9A1u08akHsGgpzfx7Z40yqLxGqer1UHLhj3NhtFgsO2MelsHeZLpzal9r6iZp2WAp8B7r12atKjxwqJEZz7ik33Hhp32U+2AZ5gz68Jn/5pKbaPbvvBox/Vi+MAFMascZ4lO6BrKFptyl3g83B89+pyBVPNE5a9QgmPrUEkmMxbxicGlqDwZxPlsVdF5ntaeVNVDBaXBWYlFv32GW9zLSFCWCeUaqcl0XcfYR7GTOjBhubfaqRXsv10/bMoCGgdXR1Vo; tfstk=e_427FYM-ZQ2RrOQ000Z85gZa23x-2BBSPMss5ViGxDcDcZr78e4cdgsfFkgsYajhSgc7f2QUxcmSVYuZfheiFDmsL0o6j8ijPM_71uYPoTsht3asJgNd9_CRSFxyVXCdKgJMwuTMF97WwNYMQ4VbySFRFWgHiShDbjWiEnGKWHurvZPEnj8GY8M7LhqmvbKUFYgzjPrKSjpSF4rgmIP8dhuDWUT0dxZmbhrd_5rLhogMKuY4k-9X00Kav1jGhKtmbhrd_5yXhnoebkCGj1..; l=fBIaWgPRPcvgi6lsBOfwPurza77OSIRAguPzaNbMi9fPOD5w5MmRB1UinYLeC3MNFsQvR3S3hc2kBeYBqQAonxvOw1MjP4Mmnttb57C..; isg=BF1db82O5Idjx4Cr6aHSjiL2bDlXepHMSVD95B8imbTj1n0I58qhnCtEANJQFqmE; _ga_VED1YSGNC7=GS1.1.1702585971.1.1.1702586521.14.0.0; _ga=GA1.1.885247232.1702585970; cto_bundle=irfJol9oQ1RMb080OXRmSyUyQkFnNGNHUGpJN0hQMzA3TnVXRjY3Um5BSlo1MFNPZGhteDYyUFQlMkZRMEU4Z0FsUzM3VCUyRjhxMFhTQ1FBYTBOMVJKSyUyQmMlMkZWR3pUSGZ3c25LT3pVcmR3NngwckhNUGc3Y3Y1a0JSY2ozVm1zenclMkJpNXB4OEs4Qg"
    } else {
      return "ali_apache_id=33.3.20.111.1702585962650.678888.4; acs_usuc_t=x_csrf=8nx8qrep9exs&acs_rt=485dca3186c64e8eb354206aba5405ac; AKA_A2=A; _m_h5_tk=10ba1bb6aecdb672824f066d0c526c8e_1702587856981; _m_h5_tk_enc=7750008d64513183ab439d261cee7b17; e_id=pt70; xlly_s=1; _gid=GA1.2.2136155133.1702585970; _gcl_au=1.1.1695213607.1702585971; cna=c1QCHmBmNB0CAYEteA6D0PDJ; account_v=1; _ym_uid=170258597425757114; _ym_d=1702585974; _ym_isad=1; _ym_visorc=b; AB_DATA_TRACK=472051_617389.455637_622998; AB_ALG=global_union_ab_exp_4%3D2; AB_STG=st_StrategyExp_1694492533501%23stg_687%2Cst_StrategyExp_1695711618618%23stg_685; af_ss_a=1; af_ss_b=1; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005005943671094; intl_locale=ar_MA; XSRF-TOKEN=f90e5229-8dc7-4bd7-a5e3-f03fa9541960; RT=\"z=1&dm=aliexpress.com&si=cf719887-f5c6-49cc-9e93-09699f7761ed&ss=lq5nq879&sl=2&tt=3lo&rl=1&obo=1&ld=2tuk&r=1esw5xemv&ul=2tuk&hd=2ujp\"; havana_tgc=NTGC_4af064990ad42b76e65b44deb0d4128c; _hvn_login=13; x_router_us_f=x_alimid=2720217087; xman_us_t=x_lid=dz1119513087freae&sign=y&rmb_pp=louktila.tk@gmail.com&x_user=FsvZqhzjyC9N9r8UfDqcE8ih7ZaPp9x036ieR7TlWMU=&ctoken=1457kqo8xl7w6&l_source=aliexpress; sgcookie=E100e+PgE32vvuBs4RRbDK1/zcDuOBbY237w+8jCee44/xRljlTdh9V7S7XjXrXg7XrMIcKRzLdmDBiY3MwCpgdUie3P/u9LPMTBVfMa1zCbh8I=; aep_common_f=M+l0+zh1HyHwhuSym0X5YTLkksVK+YKNYp/kuSyps1g4xwkHRoCd3w==; xman_f=1mXsCY+Xl+n3EYdOjIl0/gBLz2Hiqv5U8ewzhAivdy/AiLbLiHXPyLLTUKdWdMYzg3lYH2BIL0DQ3NtqsS/hVyDAb328KQ048sO8Entkv/90t50Tj0cG8IkWwRMvsCUeGick5+SuChArwIW+W2AzmtdYlpJQPoQGPV/nMpT7z02qYZM6bDNYtdpO+Z43PWnoV2sR12ssnkw7bI/2SVT7K6WPLFQxoTNhr6cbX7hBDigFiSsD+R4L7bMADU18JjIa5zhoMfBKoVzUFbh2kyrMn/FbQaXidluAwS6jFit8l/Sq5zd4jsFQzTmkzL1Z1eWXq5h+Zv03q1iMa/MPUTEnfv4j0wdMAK3bP0GVdfdBQC/v+wGV+kkJSAPxRyWe1mlYpMsmcKsvlur4X5w7Ta0GBQ5L3PhEdXfhpCY5f30wBQVlDvBvNG+bZyhhE4fAXhmycQ91+vWfAN0xnFVzQunDxA==; ali_apache_track=mt=1|ms=|mid=dz1119513087freae; ali_apache_tracktmp=W_signed=Y; cto_bundle=mS_5yF9oQ1RMb080OXRmSyUyQkFnNGNHUGpJN0hFV3RKREQxTlNIJTJCOUFjJTJCdXFQc2NqM1JpMlp6cHk3ajNmNlFvdUN4WEZING9WY3J2ZUhqNkJHTW92N1hpZGhyaVV2aXBSRWdNJTJCaXlxMSUyRllNenU4aTlHeklwUVIyS3ZYQkVrbGklMkZYVHBuVg; _ga=GA1.1.885247232.1702585970; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=2720217087&isb=y&region=MA&b_locale=ar_MA; xman_us_f=x_locale=ar_MA&x_l=0&x_user=DZ|hacking|baka|ifm|2720217087&x_lid=dz1119513087freae&x_c_chg=0&acs_rt=485dca3186c64e8eb354206aba5405ac; _ga_VED1YSGNC7=GS1.1.1702585971.1.1.1702586719.1.0.0; JSESSIONID=231040B7F0CFC0E8CFD541DA976BA7F9; intl_common_forever=b3gBP7EcaZRx0S/H9Z0+jBIeSwIkXJ744jFOaU59XeQyra04VnWtZQ==; xman_t=E2mVTpC27TZSuF+BN4q4bDnEPi+M9urlBGmGFNqF5/lPkQVJ7P+kLwKO3vMjMtD5FtE0z27PJ5AWVu9wTXn9B28aZX6FKZRsubgYtTCDulP7ajH1tTtEy2ux3UJ982WM35jgaZjLDc0AHDVOazRvptcMgn9Axvhs7rNRWb8dPCBcyxtZi0jCrZesbGUxhu4A7h/IgZ7/OKvX7zDL68MlBDVzLwZa9WMe/F8UHNfMSQuV0HsV7Gw2MPp63m7Ab7s0STQZ092xUHC8o+IJ0pjDYv3HFhipwp/jyerj/g6mRg0shWI6I6km5w/rTsSXifxJkf5ILpfbB2fqM+tUs+jBaH/YvWldzz6c6xu5BZLmGn/EblZWbUfGFlDSZZKfDxVxUJYnMvRasw5/6Uz1DZnM0Qz9422w1hQ4GDaNhu9AW6QEJGEWCd/K3p5rgCny+rAb7QabSY0ldKu2s+W++apqChDom8xqKov1AN3XENnmNhGezL3rF7HJaqBlaUoQkrRzXM8XhdmVdOUUaH1hV6ybVugABNDc4/ZVgqD0pnnywdCwqH4I2Kb21auDOOjp0Vdtv66HMhq8SRL+XNgG61QBtRcPUZlWM+soPuLD139is2Vekp1a9M2L+u0TBvQSAuTABWaJMgZtRouV1PlmRJOWOkbr7UHaRHtCmOt4/YnKF9z7bGfRwoEoXkNcFy3NDSO+6YEVO0S8vA1R3gr0K+rYYD/VfrqBXpwJ+jTqSOXEbauR92T5/VyO1J0itwLiQm+5; tfstk=eNe270vMKtB2d-tQgbDZLlgN39MxCvQBIRgsjlqicq0cMfNrQzU4GFMs1dugj4wjloMcQc4QzqmmIAvuqcnemd0mjUDoXmJisRg_QGkYFS9slZHajyMNRw6CdoExeAbCRPlyFzHTDdT7B9ZYD3V8j5rAdd7glOSnNA7ei3hP-k3uE2NqRdbLq4JMQUnqi2XKzdvgUmrr-ofpId2r0jIz8FnuMkeTgFAZi0nrRgSr8ClgDEkYaWR96bDK42sjcCdti0nrRgSy6Choy0uCcm1..; l=fBIaWgPRPcvgipttBOfwPurza77OSIRAguPzaNbMi9fP9sCp5juAB1Ui3XL9C3MNF6kMR3S3hc2kBeYBqIvnQ61Gw1MjP4Mmn_vWSGf..; isg=BMTEsE9KfcwzcMmA6CbbFXOJlUK23ehHeP90z95lUA9SCWTTBu241_qrSbnRESCf"
    }
  };

  const headers = {
    "cookie": cookier()
  };

  try {
    const result = {};

    // Array to store all Axios GET requests
    const requests = [
      axios.get(`https://ar.aliexpress.com/item/${id}.html`, { headers }),
      axios.get(`https://ar.aliexpress.com/i/${id}.html?sourceType=620&aff_fcid=`, { headers }),
      axios.get(`https://ar.aliexpress.com/i/${id}.html?sourceType=562&aff_fcid=`, { headers }),
      axios.get(`https://ar.aliexpress.com/i/${id}.html?sourceType=561&aff_fcid=`, { headers })
    ];

    // Make all requests concurrently using Promise.all()
    const responses = await Promise.all(requests);

    // Process each response
    responses.forEach((response, index) => {
      const $ = cheerio.load(response.data);
      const html = $('script:contains("window.runParams")');
      const content = html.html();
      const match = /window\.runParams\s*=\s*({.*?});/s.exec(content);

      if (match && match[1] && match[1].length > 1000) {
        const data = eval(`(${match[1]})`);

        // Process data based on the response index (0 to 3)
        switch (index) {
          case 0: // Normal
          var shipping = () => {
            if (data.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.displayAmount == undefined) {
              return "Free Shipping"
            } else {
              return data.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.displayAmount
            }
          };
          
          var discount = () => {
            if (data.data.priceComponent.coinDiscountText == undefined) {
              return "لا يوجد خصم إضافي ❎"
            } else {
              return data.data.priceComponent.coinDiscountText
            }
          };

          var coupon = () => {
            if (data.data.webCouponInfoComponent.promotionPanelDTO.shopCoupon == undefined) {
              return "لا يوجد كوبونات ❎"
            } else {
              let copo = []
              for (const promotion of data.data.webCouponInfoComponent.promotionPanelDTO.shopCoupon) {
                for (const coupon of promotion.promotionPanelDetailDTOList) {
                  const content = {
                    code: coupon.attributes.couponCode,
                    detail: coupon.promotionDetail,
                    desc: coupon.promotionDesc,
                  };
                  copo.push(content)
                }
              }
              return copo
            }
          };
          
          var shaped = {
            name: data.data.metaDataComponent.title.replace("| |   - AliExpress", ""),
            image: data.data.imageComponent.imagePathList[0],
            shipping: shipping(),
            rate: data.data.feedbackComponent.evarageStar,
            totalRates: data.data.feedbackComponent.totalValidNum,
            price: data.data.priceComponent.origPrice.minAmount.formatedAmount,
            discountPrice: data.data.priceComponent.discountPrice.minActivityAmount != undefined && data.data.priceComponent.discountPrice.minActivityAmount.formatedAmount || "No discount Price",
            sales: data.data.tradeComponent.formatTradeCount,
            discount: discount(),
            coupon: coupon(),
            store: data.data.sellerComponent.storeName,
            storeRate: data.data.storeFeedbackComponent.sellerPositiveRate
          };
          
          result['normal'] = shaped;
          break;
          case 1: // Points
          var discount = () => {
            if (data.data.priceComponent.coinDiscountText == undefined) {
              return "لا توجد نسبة تخفيض بالعملات ❎"
            } else {
              var clean = data.data.priceComponent.coinDiscountText.match(/\d+/g);
              return `خصم النقاط ${clean}%`
            }
          };

          var price_fun = () => {
            if (data.data.priceComponent.discountPrice.minActivityAmount != undefined) {
              return data.data.priceComponent.discountPrice.minActivityAmount.formatedAmount;
            } else {
              return data.data.priceComponent.origPrice.minAmount.formatedAmount;
            }
          };
          
          var total = () => {
            if (data.data.priceComponent.coinDiscountText != undefined) {
              var pers = data.data.priceComponent.coinDiscountText.match(/\d+/g);
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
          break;
          case 2: // Super
          var price_fun = () => {
            if (data.data.priceComponent.discountPrice.minActivityAmount != undefined) {
              return data.data.priceComponent.discountPrice.minActivityAmount.formatedAmount;
            } else {
              return data.data.priceComponent.origPrice.minAmount.formatedAmount;
            }
          };
          
          var shaped = {
            price: price_fun(),
          };

          result['super'] = shaped;
          break;
          case 3: // Limited
          var price_fun = () => {
            if (data.data.priceComponent.discountPrice.minActivityAmount != undefined) {
              return data.data.priceComponent.discountPrice.minActivityAmount.formatedAmount;
            } else {
              return data.data.priceComponent.origPrice.minAmount.formatedAmount;
            }
          };
          
          var shaped = {
            price: price_fun(),
          };
          result['limited'] = shaped;
          break;
        }

      } else {
        res.json({ ok : false});
        console.error(`Unable to extract data from response ${index + 1}.`);
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log(`App is on port : 3000`);
  keepAppRunning();
});