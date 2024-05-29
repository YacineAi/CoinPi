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
      return 'aeu_cid=6196a5c6399b4d2fa0ce481153f8a89f-1717020339477-04878-_DEM9iex; af_ss_a=1; af_ss_b=1; intl_locale=ar_MA; e_id=pt100; lwrid=AgGPxmMyzzEzOlq073zAX39uIxyM; xlly_s=1; _m_h5_tk=71253cecf4beb674ce79d0f24d445075_1717022323572; _m_h5_tk_enc=e858e4df97dfe1ced389f746cba0c4bf; ali_apache_id=33.3.132.185.1717020344976.130681.1; _hvn_login=13; aep_common_f=JVuIm/vQ5XQ364MXXtG6ctzqWdDOiEfoKTZSLjZOf3qnAwbNJPXyCw==; ali_apache_tracktmp=W_signed=Y; AB_ALG=; AB_STG=st_StrategyExp_1694492533501%23stg_687; cna=u5TeHumRGzsCAWnriAiM5Wy7; AB_DATA_TRACK=472051_617385; AKA_A2=A; XSRF-TOKEN=16fa3c09-4be3-4731-9f01-4c7ed2e45e04; _gcl_au=1.1.1476907570.1717020498; _gid=GA1.2.1885052926.1717020498; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005003877962998%091005005779897124; acs_usuc_t=x_csrf=wv4xarc3qzzx&acs_rt=8f67662c867d450693918d22118ab6ea; havana_tgc=NTGC_278ec0069c3782e22c51beb78a84d412; x_router_us_f=x_alimid=4804984411; xman_us_t=x_lid=dz3200778411wwaae&sign=y&rmb_pp=djenidi.dev@gmail.com&x_user=+ti7iGFQSaZY4XEsaIVYawDiQpzcM6s6/3WeH5W7p4k=&ctoken=dxpm2klbb8rb&l_source=aliexpress; sgcookie=E100Zh9cPq85QU1achGywr51uEDTBOFHDAXchFLZj9Opw5G/sVW+tQh+IY61azKUTSPsuG2Vpg5za2JsA3wpUoOVh3181CwHZearzZDXx9tSr1s=; xman_f=oNcIgNQu6HJpNENzmj5IFGQeja8gYZXVIRePmE9Zi1K003Vo3cHV7NnrrouGOAOfvrF495kYGakTujx5dYzyrMmAyA7bk8NEN8Cei9jo+GpxgF0LtnMIanRhOmiRXiMsn3tcNGXS6XPhmh3wPYaSk6BzrLMmPJoHR+kfkhXw4Q8pIdRqmib4+3Ck9AGI9fool3HDa+dVpeeonPBz9b5V0w3JvcgkywpxmRdqmIezrCoiKpYRyhfnQMdc46cBBb1ZSz7NjvK2Qj7N8E6Vtx1fCfgG7Mc8ol6sJPUHjOWs3TawFixt+cqkKF4mW1Krk9i64e7ECvfHR9tAPxJTE2Yzc4nJkTdocSKZWofJbdPDC1sfrl/PzmU+AMh/r35Vj3ptk3N2NAVdUB9O0BJuf8UMHEJKJp8wl6zj; ali_apache_track=mt=1|ms=|mid=dz3200778411wwaae; _history_login_user_info={"userName":"hacking","avatar":"","accountNumber":"djenidi.dev@gmail.com","phonePrefix":"","expiresTime":1719613097322}; xman_us_f=x_locale=ar_MA&x_l=0&x_user=DZ|hacking|baka|ifm|2720217087&x_lid=dz1119513087freae&x_c_chg=1&x_as_i=%7B%22aeuCID%22%3A%226196a5c6399b4d2fa0ce481153f8a89f-1717020339477-04878-_DEM9iex%22%2C%22af%22%3A%22a_ah3nySR%22%2C%22affiliateKey%22%3A%22_DEM9iex%22%2C%22channel%22%3A%22AFFILIATE%22%2C%22cv%22%3A%221%22%2C%22isCookieCache%22%3A%22N%22%2C%22ms%22%3A%221%22%2C%22pid%22%3A%224057770974%22%2C%22tagtime%22%3A1717020339477%7D&acs_rt=8f67662c867d450693918d22118ab6ea; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=4804984411&isb=y&region=DZ&b_locale=ar_MA&ae_u_p_s=2; JSESSIONID=1A0E91CC4433F70AC9808D25D7A769DD; intl_common_forever=muOdbQK9mnOO0N0UVSnNJhjWoik5wxDs8vSHBzWVu817M5vSagnNVg==; xman_t=8UgYlJD1qtWjOVx3xIn0vAGMTTJzA6pgddcLfDoQmUC0G19ZxlRLC1pU4EHK/EenP7w4ZgbjQDlblQxSKNWPhkOiflXUcK4b7uE0V9RZH48kZr7smWpjA8xlz0OpmHjXyvTp5RpuxMCUD7dxvwbhoMx45OTwDUuxm1vFciBg9/ChUk13trmyNKfPBqHjmgm/JkW0eZ8cwLeippwD9j6tt7vVOR8WkEmH9aUsuTXyP9khPB0h4Q5IoMUxS6kmu/9DrJydGGoeHq7cpShMlznDXmfq6gY/0B/xRlfYuNYnenUOe72iNtq+2ZWr2zHDk0RLaDtCQbXV3XQtgUU0QPSWJ/FSoU+QG5cQaNjKOtnTOSMqfvNsYVDI553koOQI8hwoQmr+wmDy0narqRe9zfIR7dvtCDLuGoV+LNT8Js47/e5sMI/IJNUzqX2Fjytr3kEEApTD+y8AcPMVnXVdj1QNBEcT9VDWDCib/9/9e3p2mMMmbbPrOm+fW129gOhSmKDtlWYPfPS1BLEW9lYUbiI3i95iB/BfPsYRTiOvUuYJmOrG5VH3Vogbgfijalq0DNpD8aQ6xsoarPkU4ZXo3P+I16RwJgrjDjfcPjBI6Uzc37FW0ssHFg1hNQaFIXwjreca/VNU59rK1FYiIvqnjz/yb0rQVLeuq2PLNfWz/cv5jPFoGOcEBC6BDoFgRFOaaBtd2vD0wuW64es1WK4cuV6XNk4AR7YniAjPkAa+Ly/0dlFpcUpPXebCMvQRJ8UH0Y7s; _ga_VED1YSGNC7=GS1.1.1717020497.1.1.1717021109.48.0.0; _ga=GA1.1.1267843140.1717020498; cto_bundle=Q08XsF9DaDhiYjRydk9rTXN2Z2ZrRkM3QmVTcWk0ZThsVENGNmt1alk2ZlpSbG4zZEhoJTJCcWVncE02TWwlMkJ3dXNGb1UlMkZIJTJGTUFIanlYRmlRWlNpZko4WUZlM2VMREtiYWloUXVibERFME9RS0UyT0hoNlhHSU9Yc2h2UUtyVVlJRTRaTW4ybFgwVm9KWjRvdDc0d21LcU9TRW9HZyUzRCUzRA; tfstk=fx8qeJag-q34U_KGUT_NUHd6ej7AuwHQSF61sCAGGtXmDGtP7Lp2cR_1fPWMsTTfhI_m71vBUtfcSN4kZ1CUn-q0S42l11aGjF667f7vPna1hxQwsp_ZdvgIRIdAyNDId0MJ7z_F1Sf0COflqSUpqvgIRIYsH-eZdfUx8xWGsNfcjs2oasC4INjcs4cPs1w0jrvMZb5OEsXgSr4lE6CLSPcUDIAgz6smHbTOkRq8Ki6Hitv6CUcPmodVUP4Mz3SVKV6zSPYPgQdT2pUEf9xdhM6JE4aV7QfwL6J4EY7MaELFqED87pJyxa5J2ArNLhAXvhjriqAPutSePgN0bZ-MHFSv05hpZZvJv9Im2YCylesNpgyonQOPnM-whYUGhHRkUMT7Fy_kt37P4vwOZndpWnygbifRa9GrZRZzkW_ExWw_XlIlJ_WIGsZTXifRa9GralEOqTCPdj1f.; isg=BPX1rIwO_-NKPBtfQXyXXYu4BHGvcqmEYtxeEXcaNWy7ThRAP8OaVC-MnAr4DsE8; epssw=3*mmHLJReK1RvcgLI7mmJ-inixyaSvGkI_Nx02inayrPTYkLI7p5pu-6iw0rtrqHdDms7Td5e603vbC-1r1rMMtLqisSywp-q-QAnPmmmemJAmxgryrtA0grPz128S7orna5krzuRQrr_WmgrnBunLXSrnpmTIBSrnaruvmKOehr1r5meh0m5QRxex4AuPx-24LXLRbQS0cLRlzqJ4A28Ud57koEjGAsxkm5PazlRMeTRlvP2M1WD0gJR.'
    } else {
      return 'aeu_cid=6196a5c6399b4d2fa0ce481153f8a89f-1717020339477-04878-_DEM9iex; af_ss_a=1; af_ss_b=1; intl_locale=ar_MA; e_id=pt100; lwrid=AgGPxmMyzzEzOlq073zAX39uIxyM; xlly_s=1; _m_h5_tk=71253cecf4beb674ce79d0f24d445075_1717022323572; _m_h5_tk_enc=e858e4df97dfe1ced389f746cba0c4bf; ali_apache_id=33.3.132.185.1717020344976.130681.1; _hvn_login=13; aep_common_f=JVuIm/vQ5XQ364MXXtG6ctzqWdDOiEfoKTZSLjZOf3qnAwbNJPXyCw==; ali_apache_tracktmp=W_signed=Y; AB_ALG=; AB_STG=st_StrategyExp_1694492533501%23stg_687; cna=u5TeHumRGzsCAWnriAiM5Wy7; AB_DATA_TRACK=472051_617385; AKA_A2=A; XSRF-TOKEN=16fa3c09-4be3-4731-9f01-4c7ed2e45e04; _gcl_au=1.1.1476907570.1717020498; _gid=GA1.2.1885052926.1717020498; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005003877962998%091005005779897124; account_v=1; acs_usuc_t=acs_rt=8f67662c867d450693918d22118ab6ea&x_csrf=ekab4skh351z; havana_tgc=NTGC_21a6e044c8fba355539f14dbb0f4df0f; x_router_us_f=x_alimid=2720217087; xman_us_t=x_lid=dz1119513087freae&sign=y&rmb_pp=louktila.tk@gmail.com&x_user=rXoSflDo50TLFvONAVCDe/XjdBq4tUjQBY0y2PTdFfo=&ctoken=1586wcq2n31td&l_source=aliexpress; sgcookie=E1001e2gV6R+n1lKFC7SSq/ylfr82YoNkKuzIjUOnSw+gxp8YQ+ETcjuKI4Yq66N1mMuz9VpZ0k9LXxBHuSU8dH1lmVPsy9ASsQvJzqgLK6Mxn8=; xman_f=SWJvJdEytQRqQKcPkDdNK8dX6+4OLnia/BDsYoBjaOgClN8zPq0k5RtniHMItPlamgwhTgqojOv/u8qR1XUnpUF+lNDKo452A6yRPrEDmsmMS/bOmH1/X/+Edz5S2U5PfAR/+98pcuzAwSjLgtYxMt25MK/p2JqVWQqK3dM4DFVY3TO7Bb1eqoDjYu5kQRMqm5HHJccIRAoQoMmJKyNyBw4yg3P7wnpOEKaT66vrcuAYKdcQvQMg9CtnbbQkQX7X/CEWtuI6Wbp+zqzbv+CMsLJPpQsH/P15uQ26vGy50w4FMTgfIS02Pu5cen5CPdnH6/zmClPdVulksBNowgrMiBy+SmonzLVPecFNBHAyg+22WlWdYyGxMt++rYrWSSgDgOOMl1YieuqZQEDdzUk0nhiDPjzU/8wb; ali_apache_track=mt=1|ms=|mid=dz1119513087freae; _history_login_user_info={"userName":"hacking","avatar":"https://ae01.alicdn.com/kf/Ae471be8be30049709844f4093924cb335.jpg_100x100.jpg","accountNumber":"louktila.tk@gmail.com","phonePrefix":"","expiresTime":1719613390472}; RT="z=1&dm=aliexpress.com&si=1137f130-b8f3-43c3-bec1-f3005a819907&ss=lwse5s72&sl=2&tt=pzx&obo=1&rl=1"; _gat=1; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=2720217087&isb=y&region=MA&b_locale=ar_MA&ae_u_p_s=2; xman_us_f=x_locale=ar_MA&x_l=0&x_user=DZ|hacking|baka|ifm|2720217087&x_lid=dz1119513087freae&x_c_chg=1&x_as_i=%7B%22aeuCID%22%3A%226196a5c6399b4d2fa0ce481153f8a89f-1717020339477-04878-_DEM9iex%22%2C%22af%22%3A%22a_ah3nySR%22%2C%22affiliateKey%22%3A%22_DEM9iex%22%2C%22channel%22%3A%22AFFILIATE%22%2C%22cv%22%3A%221%22%2C%22isCookieCache%22%3A%22N%22%2C%22ms%22%3A%221%22%2C%22pid%22%3A%224057770974%22%2C%22tagtime%22%3A1717020339477%7D&acs_rt=8f67662c867d450693918d22118ab6ea; JSESSIONID=19C455801E019F6A6068DE9E4FC9357C; intl_common_forever=McVRxpjL7uunpbqXW1DwIUBokzW18s4lAkrsE4PWEi0bi9OXq1sPEQ==; xman_t=fCnoB66I7zQhIVQ1O1vFTAEZ5mL7m/2ikBXzQU30YZ6fPYchKkSVYmNXwSDx8amR2/DY1CqmPvz1RYwLm1qSRj30RGFBuJJJo/J1o8S7R44kmCdEUbugU3UK6bJU53K+RJPKsJE7VxJz344SCazinXsIoZVGv2JNjQL83Y+xYX0oMD7wNnzOtxMhoLHvXUenZBcRnAOR+6Tt1kKxuvZn4iwV5XJ34IKj9GoJk1IzFlVN2mwHEoh5CnBmlFBB8wK50rpQ1I3CXi04CHsmAJem+sZuGlqAx73ar6RGw/Ha/Ls3XzUOQJb4/2EuoaVP6T35RBCQ3Jokr72pCbCWck4Ey6+FN2eAZDgeniio52hEgM5WgtRq5P9EgfaOoWBHY47CpuWU1E0NCbWHpcLL95EAChv/mh726rr53bZ6ASyMgvVlYLxxA+xKAfuD62S4HjS0cgXgYgjCoLI9tLlzpMtWgvt9dpdhBJPe2/rJkyxAMwmMpcS1AmT8p6/O/ik9fx9LzkQGNtltzWQlQQ7AIcP1pkgoKsw86h6l1V0hJ0mBhweFTEupovEvPsV3Xu0MXa16sVqizgn8f+oeZCQJEYJf52oSK0+mgFTegywERX1urt2TjjP9IwcTA0OD1t8a/2ZI8GFLXjRH2Q8mlEvEp8xCNKMEHu25CERQfe7yBoasy90X1UuvhM1xPcYCppwhKVn54FfPM2xMDP3WPLkIGmTacm0yxHnBYc4abNWu+5XeAEGC2fLCk7OAqIJETtCO+Y6n; tfstk=fTnqnwsGxnK2-cgga7Zaa2efK0rYDkdCjcN_IADghSVDkPgzbbhql1Z_5GPiI7ibGxZDbRcIaS20jljoEReFisbcj3fuCRsgScNsbdrxVqs_GIEZIXZwOBtBAxHY2lABOaPzZBrgIhNgSM1dYlEMOQgAQRUUXX1Yq5OqELy_CZbisSDuq7easscgizfuLJEgsfqMU82_QNbGmZ2lZJGduxDG4JaDMLgmFVp_UrPnU3IGb4jQuWD0aGAn4-RTtxVPjGVxNLGSUxOVvYZxVXyIG3jqTx0ns2ck4iz-oYoaJcCDEl4iP2aqzIjaNmwa-l4PIGDzm7UKjkxha83ohVmxgOSgHmiQ7WUyIGU_qDan-jW9pYq0IfUKfBIYiADKv2Zebgq4SgyC680xpc3VsNz0e8PBULf1ziBQYeXC1NQTrkezOKwfWNU0e8PBUL7OWzV8UW9bh; isg=BO3tsFrydxuwWhN3ORQv9cMQ_IlnSiEcuoRWOS_yOATzpg1Y95vt74N0lGJAJjnU; _ga_VED1YSGNC7=GS1.1.1717020497.1.1.1717021557.16.0.0; _ga=GA1.1.1267843140.1717020498; cto_bundle=-Mx_zF9DaDhiYjRydk9rTXN2Z2ZrRkM3QmVWUGZuWVl2djFMQXNIV1pVUTV5cFNtazVXYkxhV2tPYzVDa3daN2wlMkZWbThidnYwbHVXZGpyTXVQNnVmamR6NGxBZFJvRWdKR0lGSjNleXhSV3hVYVVDcndsNHpxWHhXTEIxMXh1RjhOcCUyQm13MiUyQjhVRWxsa3pjWGtyQ3JBUU1kNnclM0QlM0Q; epssw=3*mmQwb8AQGNAqsnixAkI7ANmmWJUaF8JmALFmmmTmRZQmmmJL886THU7rvISrHLNndISzqjQnVZQ_BZ3WvEQBZV2nrUezNtTBqxgr1RQmLApo1zvTHxIk1UackR7Wrr7cBQNABIrrrniTJmJWUdE4rrzdyoiT1rOWmC5-7Ak1gQ3Q645-ATQFxNZMEOnpAeRhDgBFfS9TOD-_sfFcTwAtVV4iCoixCxBxK17gOh8Q'
    }
  };
  const coo = cookier();
  const headers = {
    "cookie": coo
  };

  try {
    const result = { "ok": true };
    let extractionFailed = false;
    const requests = [
      axios.get(`https://ar.aliexpress.com/item/${id}.html`, { headers }),
      axios.get(`https://ar.aliexpress.com/item/${id}.html?sourceType=620&aff_fcid=`, { headers }),
      axios.get(`https://ar.aliexpress.com/item/${id}.html?sourceType=562&aff_fcid=`, { headers }),
      axios.get(`https://ar.aliexpress.com/item/${id}.html?sourceType=561&aff_fcid=`, { headers })
    ];

    const responses = await Promise.all(requests);

    responses.forEach((response, index) => {
      const $ = cheerio.load(response.data);
      const html = $('script:contains("window.runParams")');
      const content = html.html();
      //console.log(content);
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
    'cookie': 'aeu_cid=6196a5c6399b4d2fa0ce481153f8a89f-1717020339477-04878-_DEM9iex; af_ss_a=1; af_ss_b=1; intl_locale=ar_MA; e_id=pt100; lwrid=AgGPxmMyzzEzOlq073zAX39uIxyM; xlly_s=1; _m_h5_tk=71253cecf4beb674ce79d0f24d445075_1717022323572; _m_h5_tk_enc=e858e4df97dfe1ced389f746cba0c4bf; ali_apache_id=33.3.132.185.1717020344976.130681.1; _hvn_login=13; aep_common_f=JVuIm/vQ5XQ364MXXtG6ctzqWdDOiEfoKTZSLjZOf3qnAwbNJPXyCw==; ali_apache_tracktmp=W_signed=Y; AB_ALG=; AB_STG=st_StrategyExp_1694492533501%23stg_687; cna=u5TeHumRGzsCAWnriAiM5Wy7; AB_DATA_TRACK=472051_617385; AKA_A2=A; XSRF-TOKEN=16fa3c09-4be3-4731-9f01-4c7ed2e45e04; _gcl_au=1.1.1476907570.1717020498; _gid=GA1.2.1885052926.1717020498; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005003877962998%091005005779897124; acs_usuc_t=x_csrf=wv4xarc3qzzx&acs_rt=8f67662c867d450693918d22118ab6ea; havana_tgc=NTGC_278ec0069c3782e22c51beb78a84d412; x_router_us_f=x_alimid=4804984411; xman_us_t=x_lid=dz3200778411wwaae&sign=y&rmb_pp=djenidi.dev@gmail.com&x_user=+ti7iGFQSaZY4XEsaIVYawDiQpzcM6s6/3WeH5W7p4k=&ctoken=dxpm2klbb8rb&l_source=aliexpress; sgcookie=E100Zh9cPq85QU1achGywr51uEDTBOFHDAXchFLZj9Opw5G/sVW+tQh+IY61azKUTSPsuG2Vpg5za2JsA3wpUoOVh3181CwHZearzZDXx9tSr1s=; xman_f=oNcIgNQu6HJpNENzmj5IFGQeja8gYZXVIRePmE9Zi1K003Vo3cHV7NnrrouGOAOfvrF495kYGakTujx5dYzyrMmAyA7bk8NEN8Cei9jo+GpxgF0LtnMIanRhOmiRXiMsn3tcNGXS6XPhmh3wPYaSk6BzrLMmPJoHR+kfkhXw4Q8pIdRqmib4+3Ck9AGI9fool3HDa+dVpeeonPBz9b5V0w3JvcgkywpxmRdqmIezrCoiKpYRyhfnQMdc46cBBb1ZSz7NjvK2Qj7N8E6Vtx1fCfgG7Mc8ol6sJPUHjOWs3TawFixt+cqkKF4mW1Krk9i64e7ECvfHR9tAPxJTE2Yzc4nJkTdocSKZWofJbdPDC1sfrl/PzmU+AMh/r35Vj3ptk3N2NAVdUB9O0BJuf8UMHEJKJp8wl6zj; ali_apache_track=mt=1|ms=|mid=dz3200778411wwaae; _history_login_user_info={"userName":"hacking","avatar":"","accountNumber":"djenidi.dev@gmail.com","phonePrefix":"","expiresTime":1719613097322}; xman_us_f=x_locale=ar_MA&x_l=0&x_user=DZ|hacking|baka|ifm|2720217087&x_lid=dz1119513087freae&x_c_chg=1&x_as_i=%7B%22aeuCID%22%3A%226196a5c6399b4d2fa0ce481153f8a89f-1717020339477-04878-_DEM9iex%22%2C%22af%22%3A%22a_ah3nySR%22%2C%22affiliateKey%22%3A%22_DEM9iex%22%2C%22channel%22%3A%22AFFILIATE%22%2C%22cv%22%3A%221%22%2C%22isCookieCache%22%3A%22N%22%2C%22ms%22%3A%221%22%2C%22pid%22%3A%224057770974%22%2C%22tagtime%22%3A1717020339477%7D&acs_rt=8f67662c867d450693918d22118ab6ea; aep_usuc_f=site=ara&province=null&city=null&c_tp=USD&x_alimid=4804984411&isb=y&region=DZ&b_locale=ar_MA&ae_u_p_s=2; JSESSIONID=1A0E91CC4433F70AC9808D25D7A769DD; intl_common_forever=muOdbQK9mnOO0N0UVSnNJhjWoik5wxDs8vSHBzWVu817M5vSagnNVg==; xman_t=8UgYlJD1qtWjOVx3xIn0vAGMTTJzA6pgddcLfDoQmUC0G19ZxlRLC1pU4EHK/EenP7w4ZgbjQDlblQxSKNWPhkOiflXUcK4b7uE0V9RZH48kZr7smWpjA8xlz0OpmHjXyvTp5RpuxMCUD7dxvwbhoMx45OTwDUuxm1vFciBg9/ChUk13trmyNKfPBqHjmgm/JkW0eZ8cwLeippwD9j6tt7vVOR8WkEmH9aUsuTXyP9khPB0h4Q5IoMUxS6kmu/9DrJydGGoeHq7cpShMlznDXmfq6gY/0B/xRlfYuNYnenUOe72iNtq+2ZWr2zHDk0RLaDtCQbXV3XQtgUU0QPSWJ/FSoU+QG5cQaNjKOtnTOSMqfvNsYVDI553koOQI8hwoQmr+wmDy0narqRe9zfIR7dvtCDLuGoV+LNT8Js47/e5sMI/IJNUzqX2Fjytr3kEEApTD+y8AcPMVnXVdj1QNBEcT9VDWDCib/9/9e3p2mMMmbbPrOm+fW129gOhSmKDtlWYPfPS1BLEW9lYUbiI3i95iB/BfPsYRTiOvUuYJmOrG5VH3Vogbgfijalq0DNpD8aQ6xsoarPkU4ZXo3P+I16RwJgrjDjfcPjBI6Uzc37FW0ssHFg1hNQaFIXwjreca/VNU59rK1FYiIvqnjz/yb0rQVLeuq2PLNfWz/cv5jPFoGOcEBC6BDoFgRFOaaBtd2vD0wuW64es1WK4cuV6XNk4AR7YniAjPkAa+Ly/0dlFpcUpPXebCMvQRJ8UH0Y7s; _ga_VED1YSGNC7=GS1.1.1717020497.1.1.1717021109.48.0.0; _ga=GA1.1.1267843140.1717020498; cto_bundle=Q08XsF9DaDhiYjRydk9rTXN2Z2ZrRkM3QmVTcWk0ZThsVENGNmt1alk2ZlpSbG4zZEhoJTJCcWVncE02TWwlMkJ3dXNGb1UlMkZIJTJGTUFIanlYRmlRWlNpZko4WUZlM2VMREtiYWloUXVibERFME9RS0UyT0hoNlhHSU9Yc2h2UUtyVVlJRTRaTW4ybFgwVm9KWjRvdDc0d21LcU9TRW9HZyUzRCUzRA; tfstk=fx8qeJag-q34U_KGUT_NUHd6ej7AuwHQSF61sCAGGtXmDGtP7Lp2cR_1fPWMsTTfhI_m71vBUtfcSN4kZ1CUn-q0S42l11aGjF667f7vPna1hxQwsp_ZdvgIRIdAyNDId0MJ7z_F1Sf0COflqSUpqvgIRIYsH-eZdfUx8xWGsNfcjs2oasC4INjcs4cPs1w0jrvMZb5OEsXgSr4lE6CLSPcUDIAgz6smHbTOkRq8Ki6Hitv6CUcPmodVUP4Mz3SVKV6zSPYPgQdT2pUEf9xdhM6JE4aV7QfwL6J4EY7MaELFqED87pJyxa5J2ArNLhAXvhjriqAPutSePgN0bZ-MHFSv05hpZZvJv9Im2YCylesNpgyonQOPnM-whYUGhHRkUMT7Fy_kt37P4vwOZndpWnygbifRa9GrZRZzkW_ExWw_XlIlJ_WIGsZTXifRa9GralEOqTCPdj1f.; isg=BPX1rIwO_-NKPBtfQXyXXYu4BHGvcqmEYtxeEXcaNWy7ThRAP8OaVC-MnAr4DsE8; epssw=3*mmHLJReK1RvcgLI7mmJ-inixyaSvGkI_Nx02inayrPTYkLI7p5pu-6iw0rtrqHdDms7Td5e603vbC-1r1rMMtLqisSywp-q-QAnPmmmemJAmxgryrtA0grPz128S7orna5krzuRQrr_WmgrnBunLXSrnpmTIBSrnaruvmKOehr1r5meh0m5QRxex4AuPx-24LXLRbQS0cLRlzqJ4A28Ud57koEjGAsxkm5PazlRMeTRlvP2M1WD0gJR.'
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