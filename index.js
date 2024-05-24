const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const https = require('https');

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SB_URL || "https://db.supabase.io/", process.env.SB_KEY || "token123", { auth: { persistSession: false} });

async function createPd(product) {
  const { data, error } = await supabase
  .from('products')
  .insert([ product ]);

  if (error) {
      throw new Error('Error creating user : ', error);
  } else {
      return data
  }
};

async function updatePd(id, update) {
  const { data, error } = await supabase
  .from('products')
  .update( update )
  .eq('id', id);
  
  if (error) {
      throw new Error('Error updating user : ', error);
  } else {
      return data
  }
};

async function pdDb(id) {
  const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('id', id);

  if (error) {
      console.error('Error checking user:', error);
  } else {
      return data
  }
};

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
      return 'ali_apache_id=33.3.7.192.1716566137788.956143.3; acs_usuc_t=x_csrf=tantn0vss0xd&acs_rt=b82c02176fbf475e9d9fbe2c871e5f27; intl_locale=ar_MA; AKA_A2=A; lwrid=AQGPq1Chug19ZX5uWLfyX38AAAAA; _m_h5_tk=387fae8f1f2f79e1cd48353f6aa43855_1716568121212; _m_h5_tk_enc=652b3e7b42b23a37c552871d2beb8040; _gcl_au=1.1.1593205110.1716566142; xlly_s=1; e_id=pt80; _gid=GA1.2.846196114.1716566143; cna=fqbXHqJTyyQCAWnrh3fXploG; havana_tgc=NTGC_20824f36da426843fc5c55740fddd293; _hvn_login=13; x_router_us_f=x_alimid=4804984411; xman_us_t=x_lid=dz3200778411wwaae&sign=y&rmb_pp=djenidi.dev@gmail.com&x_user=7eIGchfzmNBjp/ZiKsZ5bJoASGQqm3giObUnE9p9dzo=&ctoken=1dice47hhi4z0&l_source=aliexpress; sgcookie=E100QEjn7DgkOSGAu+sQ8AB+sAg7YZ1aRQ8igHl84AKSFR0Svz77EVY6nYr2m2L8mJITW0SqEYC1XMsZQ9MVlxjsESzHk+MBnjAOoO9gFWbiXzI=; aep_common_f=Lwsyo5NiQ0VPH7gaw2bFt8Z7WPLulbmxUSQlINMCnqE/3P3QlAze8A==; xman_f=X8a/deoea4cMqoyCCrmNo6emsGobqpmz3cNK05zi/k3Is6sEGpqk+AyciO4oZeA3h3oo5I5kOjYZcz7Y1e/7fbxlgnOncetofW5QgvqmAa8HUM/8C5PU8Bu5pIHVbx6MvLBWZ8zHPVvX7LjaTMHii6rKOriJGIZOUqW4/J3KccQtM9G2QrO1tkh2/szOQ8iRiiLOQq/JwZwZbVGrE2ApaIxyUqyAjKuNnuGKckWm8EQqVTiCRZXL5ZsLVNlpoHGvgb4qm55MQmIBX/BmBK9ayoOTtGjYO+Wcxw7jRJCRH63N8X9cPf5USRAeTZ7BZmNwRURxfX4VBKbATXuKG2mn1mHo6VRlOCsHxptowdfRc37jaIl5MyE1DHW1LTo1yt9yJCrjGc2PLCs1ejY+dBphkbNWO/zwst5A; ali_apache_track=mt=1|ms=|mid=dz3200778411wwaae; ali_apache_tracktmp=W_signed=Y; _history_login_user_info={\"userName\":\"djenidi.dev\",\"avatar\":\"\",\"accountNumber\":\"djenidi.dev@gmail.com\",\"phonePrefix\":\"\",\"expiresTime\":1719158339053}; AB_DATA_TRACK=472051_617387; AB_ALG=; AB_STG=st_StrategyExp_1694492533501%23stg_687; xman_us_f=x_locale=ar_MA&x_l=0&x_user=DZ|djenidi.dev|user|ifm|4804984411&x_lid=dz3200778411wwaae&x_c_chg=1&acs_rt=b82c02176fbf475e9d9fbe2c871e5f27; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=4804984411&isb=y&region=DZ&b_locale=ar_MA&ae_u_p_s=2; RT=\"z=1&dm=aliexpress.com&si=d482f642-5f5b-4c02-8bbc-eab32a40a51f&ss=lwkvaqha&sl=2&tt=4of&rl=1&nu=bqaah4e&cl=hv9&obo=1&ld=hvl&r=wb7p97ka&ul=hvl&hd=isz\"; XSRF-TOKEN=bca50668-0a2d-4831-9a1c-7537a85adf84; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005005973151666%091005006353782724; JSESSIONID=4191AB5AD2890E1767617F356DF8BE9D; _gat=1; _ga_VED1YSGNC7=GS1.1.1716566142.1.1.1716566409.50.0.0; _ga=GA1.1.193868579.1716566142; tfstk=feZqnSxMxiI4ETaiabiZa0c9ELnxcDCBjlGsIR2ihjcckVarb7F4lCis5hlgIbZjG-icbAVQajDmjcxuEAHBmEcDmL0oKAtiSlG_bOoYVrtsGsnaIWiNO6sCA-ex2cfCOAWKJ1niIGGMR06I6cnGO_sBDuInXWG9Ez54ETksCFD0sVxoEbHZsCVii4AoLvnis5mGU4DxnIxisqxkEAGKn-2M4vgcMFe4UvRqCql33gKMbu-IuX2mahf34xSxt-cyjhGYg1z8U-12v8iYVWkQGgx4T-43syVl4nu8o8rZJldcEc0gPyg4zsxZNoMZ-c0yIh2rmb3LjDjHaYUuhPqYgd-iHoZI7X3PIh3sqkg3-SJOp8mmI53Lf6KxiR2LvyiFb3mqSgSM6Y4YplU2sFumeYlCUTA6znpBK95HNFLtrDHrOtMXWF3meYlCUT89W4c-UX6jh; isg=BDg4WgFCqssXfMZPmuTgyafTCebKoZwr7_-jZnKphHMmjdh3GrFsu06nQZ093VQD; epssw=1*Gnh611g_nfQ19qz4NviGtaU47ryiIdGmBh094bgJNcGK57cfH1B56T6q0ljGNalGF_6AdERgS9X2hjsyrcxMwtWC3C65dFPAHpTj0SsC8fAwwBaY4rEU_WiMjhxMOa5-eTo0DQRy2H2R3oOmeKyBev9-yapJvHSnpLU9EaQRetyR3zCZjLH8FfhUaRpt3kmEdLHR3J6-; intl_common_forever=mrlQTwjzMX1VJUdO2Ywqsd2LPch0O25ki6bPM7EFOjLVhB2u8OzJ6g==; xman_t=MdZdLOxkan7pbXt8ZkZ9s5/9a9lILLXpwNAL+Ld6AbeuUuMrNYRiT9j/v3FRHfGa+2aRpm/75KHQjjJFZotEtJVDNYxk1eQ325hHiBCcRcY0QbeYeZXkpfY9hIuWMcVthZeeyMYIoLlBRwIqK6dp3SCzycWDkAX+g5BXnAFC3pRpttF8eimccKjhMw8xbTdB8M1Yf0+fm7TDGvpE0G/ps43Kj6kayT4iZtprLcMiUyIrqloljZr6naFscOWmdviausK0Vzy0VrKonpORdkWJGD9PkRCIaL46/cFQZ0OcXOJKSYBDbqMV9XY/9ODzvwG3BNg9l8BzTwV9xckXBe9h4ZZJyPt6PVa9SvjebFbD8sNfdgxH3TjdErEgl/9+QqSOhQX/gMG7vxLUWFZkbA87TEm0+/E9vHnlUiAUWlJhiw+ehyZRJ0TDpMXqDXG08BcGLIrWdeIosr85fzRKMg/KqpjuI+qCRZVhkbEIHmJgaCdosR/cXusKzpRujgw+GSEXabPJef8gDvCW7Vii7z0BfVxxvBZlBnyKEWQ9/BIuw5bvFL5twOU7AZahbTzkfYLPn2P6srFYcjydUvtBNvomr1y1XAL5r7GpUzMix0ecRcGK7empxSozb6mWBr91Ly5x/iPVbzULRdKmc31f+P69O4U6xwxWVQqj9h4qL6D0JxdLFZE9yYjv5sr6DsWZpb2t6bvr4AE2sqRWj/kCvz2et2rv8AFRtz/h+F+8pupD8aySkO9xk8RGhul/dYiTzmGt'
    } else {
      return 'ali_apache_id=33.3.7.192.1716566137788.956143.3; acs_usuc_t=x_csrf=tantn0vss0xd&acs_rt=b82c02176fbf475e9d9fbe2c871e5f27; AKA_A2=A; lwrid=AQGPq1Chug19ZX5uWLfyX38AAAAA; _m_h5_tk=387fae8f1f2f79e1cd48353f6aa43855_1716568121212; _m_h5_tk_enc=652b3e7b42b23a37c552871d2beb8040; _gcl_au=1.1.1593205110.1716566142; xlly_s=1; e_id=pt80; _gid=GA1.2.846196114.1716566143; cna=fqbXHqJTyyQCAWnrh3fXploG; havana_tgc=NTGC_20824f36da426843fc5c55740fddd293; _hvn_login=13; x_router_us_f=x_alimid=4804984411; xman_us_t=x_lid=dz3200778411wwaae&sign=y&rmb_pp=djenidi.dev@gmail.com&x_user=7eIGchfzmNBjp/ZiKsZ5bJoASGQqm3giObUnE9p9dzo=&ctoken=1dice47hhi4z0&l_source=aliexpress; sgcookie=E100QEjn7DgkOSGAu+sQ8AB+sAg7YZ1aRQ8igHl84AKSFR0Svz77EVY6nYr2m2L8mJITW0SqEYC1XMsZQ9MVlxjsESzHk+MBnjAOoO9gFWbiXzI=; aep_common_f=Lwsyo5NiQ0VPH7gaw2bFt8Z7WPLulbmxUSQlINMCnqE/3P3QlAze8A==; xman_f=X8a/deoea4cMqoyCCrmNo6emsGobqpmz3cNK05zi/k3Is6sEGpqk+AyciO4oZeA3h3oo5I5kOjYZcz7Y1e/7fbxlgnOncetofW5QgvqmAa8HUM/8C5PU8Bu5pIHVbx6MvLBWZ8zHPVvX7LjaTMHii6rKOriJGIZOUqW4/J3KccQtM9G2QrO1tkh2/szOQ8iRiiLOQq/JwZwZbVGrE2ApaIxyUqyAjKuNnuGKckWm8EQqVTiCRZXL5ZsLVNlpoHGvgb4qm55MQmIBX/BmBK9ayoOTtGjYO+Wcxw7jRJCRH63N8X9cPf5USRAeTZ7BZmNwRURxfX4VBKbATXuKG2mn1mHo6VRlOCsHxptowdfRc37jaIl5MyE1DHW1LTo1yt9yJCrjGc2PLCs1ejY+dBphkbNWO/zwst5A; ali_apache_track=mt=1|ms=|mid=dz3200778411wwaae; ali_apache_tracktmp=W_signed=Y; _history_login_user_info={\"userName\":\"djenidi.dev\",\"avatar\":\"\",\"accountNumber\":\"djenidi.dev@gmail.com\",\"phonePrefix\":\"\",\"expiresTime\":1719158339053}; AB_DATA_TRACK=472051_617387; AB_ALG=; AB_STG=st_StrategyExp_1694492533501%23stg_687; RT=\"z=1&dm=aliexpress.com&si=d482f642-5f5b-4c02-8bbc-eab32a40a51f&ss=lwkvaqha&sl=2&tt=4of&rl=1&nu=bqaah4e&cl=hv9&obo=1&ld=hvl&r=wb7p97ka&ul=hvl&hd=isz\"; XSRF-TOKEN=bca50668-0a2d-4831-9a1c-7537a85adf84; _gat=1; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005005973151666%091005006353782724%091005005471541355; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=4804984411&isb=y&region=MA&b_locale=ar_MA&ae_u_p_s=2; xman_us_f=x_locale=ar_MA&x_l=0&x_user=DZ|djenidi.dev|user|ifm|4804984411&x_lid=dz3200778411wwaae&x_c_chg=1&acs_rt=b82c02176fbf475e9d9fbe2c871e5f27; intl_locale=ar_MA; JSESSIONID=3B85F8E53E57CB5C2D878C661EF69F66; intl_common_forever=7Qt+k6Dbj9O8KyHTpIJMMjRxyd6iAI7BynRqUvwaCYcMR2SZcp+a9g==; xman_t=roxIwzDT+i5dC/ddCNT4tBTRsW4SbB9fXesOvKdhq3nlqBGRyJspJBgGEHn/WZeGJ13WjYSoJ55dNRL8s+9KE4qrhu3oXHvIik1GsuhBZN2DXfXgbKD1jqAPp3tna0Bbnihf53QZMRx93etuhMWQvhS3/DUtuIb1mSEA5bbYrvl/AZMPJ+hh71gR+FW3Kki89CueamV/fiwfUHU0TNRXqliUtw2pQEVHehKP/n0wekJH+cdWLwiOg1geVgiwgboIo38EeaZN6YFniolR5ozE3F+c+3r8BEvWfMw1lHexvL9HGSKnVcFAaAVXMLaPH3/DSzsVoQqA4i1fIeXNoglXAnnGju6+FM5zPQXUYLqCFuNHHE9TutIJGidAVXcgAP4KATbGvunYrksn376RFtKqKKWc+sSmh+Fg6K1j7o0G4/hu4nCOkmuTIBURNv1KHiF1Hx6YluvxCRCLxApusEUfXGF71+qAAj1YYUuGjihxr1fDi0jBdRjkw0E+Ngmk+CIUuWoS64gN4Xemk8kkQqesYI1JajDaQ2RL92lWg6lxusaBSiCOo7e2xoXGy8ZB94omtw9hcX1znSE76Z1+cVbxz+LsRtjkLYItuCwY3vmBY5eqlfOrQGdtLMhDglmWje9G6mqbgGQqJpKgMuj91RpqxzIia8SCw9zt/i3noB0phoXuWD/aODvCcTMs/gg7jxGIJhEGrG5HFnbRasuLrP3JqJzq36oLfWSZ+hIElZEBj/BDV6gUGlJGLxoKSPn5qq2N; _ga_VED1YSGNC7=GS1.1.1716566142.1.1.1716566552.13.0.0; _ga=GA1.1.193868579.1716566142; tfstk=eG0e7ebloeLeWjfjYl4zQPV-fJaLJrpfr4w7ZbcuOJ2HvuiazAHEATa7VayoZRgQdXaHz7DjQJV3rzbis7FVr9q3t54gZSS3q4wSzQzK5D_7dpUrZxayhKTXlXhLWzvXhUi7zPaRP4LoUEGK912uuzvMlgl6TkjLaz-w8X-UpXJSp5J0dC2EtR7reVP3YMh3Qabo7crUnawNra0a9goVe5mKM4nFEgr365yX_CW5bwCfiIJcCgI8jrFahBNC2gE365yX_CSR2l2T_-OQO; isg=BJOTynRj8eprFL2-jZ0LSKhaIhe9SCcK8Ca490Ww77LpxLNmzRi3WvEW_iyq5H8C; epssw=1*MK5s11gP1ChfTQGSIAqGtaFCu5XgltiwIlBiIEz8HOKLVMMMeAY89DNoGKCWH1B5r8l9FGXmYMWB3hfGa2S6fErz4xqMjK6WNKBd3Q_tYMJBl4VyAwlM_pCnL77YYJVa6T1OF6ZUw4Qvvt-he0Z3etrq5kqnetrnxv98yCy53ko36XwBe4QRdLHB26piLLNtT5bwBxyRnzQ8xDm3xf..'
    }
  };

  const headers = {
    "cookie": cookier()
  };

  try {
    const result = { "ok": true };
    let extractionFailed = false;

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
        let shaped;

        switch (index) {
          case 0: // Normal
            shaped = {
              name: data.data.metaDataComponent.title.replace("| |   - AliExpress", ""),
              image: data.data.imageComponent.imagePathList[0],
              shipping: data.data.webGeneralFreightCalculateComponent.originalLayoutResultList[0].bizData.displayAmount || "Free Shipping",
              rate: data.data.feedbackComponent.evarageStar,
              totalRates: data.data.feedbackComponent.totalValidNum,
              price: data.data.priceComponent.origPrice.minAmount.formatedAmount,
              discountPrice: data.data.priceComponent.discountPrice.minActivityAmount?.formatedAmount || "No discount Price",
              sales: data.data.tradeComponent.formatTradeCount,
              discount: data.data.priceComponent.coinDiscountText || "لا يوجد خصم إضافي ❎",
              coupon: "لا يوجد كوبونات ❎",
              store: data.data.sellerComponent.storeName,
              storeRate: data.data.storeFeedbackComponent.sellerPositiveRate
            };
            result['normal'] = shaped;
            break;
          case 1: // Points
            shaped = {
              discountPrice: data.data.priceComponent.discountPrice.minActivityAmount?.formatedAmount || data.data.priceComponent.origPrice.minAmount.formatedAmount,
              discount: data.data.priceComponent.coinDiscountText ? `خصم النقاط ${data.data.priceComponent.coinDiscountText.match(/\d+/g)}%` : "لا توجد نسبة تخفيض بالعملات ❎",
              total: data.data.priceComponent.coinDiscountText
                ? `US $${(parseInt(data.data.priceComponent.origPrice.minAmount.formatedAmount.match(/\d+/g)) * (1 - parseInt(data.data.priceComponent.coinDiscountText.match(/\d+/g)) / 100)).toFixed(2)}`
                : data.data.priceComponent.discountPrice.minActivityAmount?.formatedAmount || data.data.priceComponent.origPrice.minAmount.formatedAmount
            };
            result['points'] = shaped;
            break;
          case 2: // Super
            shaped = {
              price: data.data.priceComponent.discountPrice.minActivityAmount?.formatedAmount || data.data.priceComponent.origPrice.minAmount.formatedAmount
            };
            result['super'] = shaped;
            break;
          case 3: // Limited
            shaped = {
              price: data.data.priceComponent.discountPrice.minActivityAmount?.formatedAmount || data.data.priceComponent.origPrice.minAmount.formatedAmount
            };
            result['limited'] = shaped;
            break;
          default:
            break;
        }
      } else {
        extractionFailed = true;
        console.error(`Unable to extract data from response ${index + 1}.`);
      }
    });

    if (extractionFailed) {
      res.json({ ok: false });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
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

app.get('/fetch2', async (req, res) => {
  const { id } = req.query;
  const check = await pdDb(id);

  if (check[0]) {
    await updatePd(id, {month: check[0].month + 1})
    .then(async (data, err) => {
      try {
        const requests = [
          axios.get(`https://coin-asia.onrender.com/fetch2?id=${id}`),
          axios.get(`https://coin-europe.onrender.com/fetch2?id=${id}`)
        ];
    
        const responses = await Promise.all(requests);
    
        if (responses[0].data.ok != false) {
          res.json(responses[0].data);
        } else if (responses[1].data.ok != false) {
          res.json(responses[1].data);
        } else {
          res.json({ ok : false});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  } else {
    await createPd({id: id, date: new Date().getTime(), week: 1, month: 1})
    .then(async (data, err) => {
      try {
        const requests = [
          axios.get(`https://coin-asia.onrender.com/fetch2?id=${id}`),
          axios.get(`https://coin-europe.onrender.com/fetch2?id=${id}`)
        ];
    
        const responses = await Promise.all(requests);
    
        if (responses[0].data.ok != false) {
          res.json(responses[0].data);
        } else if (responses[1].data.ok != false) {
          res.json(responses[1].data);
        } else {
          res.json({ ok : false});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }
});



app.get('/db', async (req, res) => {
  const { id } = req.query;
  const check = await pdDb(id);

  if (check[0]) {
    res.json(check[0]);
  } else {
    await createPd({id: id, date: new Date().getTime(), week: 1, month: 1})
    .then(async (data, err) => {
      try {
        const requests = [
          axios.get(`https://coin-asia.onrender.com/fetch2?id=${id}`),
          axios.get(`https://coin-europe.onrender.com/fetch2?id=${id}`)
        ];
    
        const responses = await Promise.all(requests);
    
        if (responses[0].data.ok != false) {
          res.json(responses[0].data);
        } else if (responses[1].data.ok != false) {
          res.json(responses[1].data);
        } else {
          res.json({ ok : false});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }
});

app.listen(3000, () => {
  console.log(`App is on port : 3000`);
  keepAppRunning();
});