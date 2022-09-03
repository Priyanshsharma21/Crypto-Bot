import axios from 'axios'
import TelegramBot from 'node-telegram-bot-api'
import shortNumber from '@pogix3m/short-number';
import express from 'express'
import fetch from 'node-fetch'
import {convert} from 'html-to-text';
import dotenv from 'dotenv'
dotenv.config()
const TOKEN = process.env.TOKEN
const PORT = process.env.PORT || 5000
const app = express()

const bot = new TelegramBot(TOKEN, {
    polling: true
});


app.get('/', (req, res) => {
    res.send('🤎🖤🤍❤️‍🔥💗Hello Crypto Lovers💙💚💛❤️💜🧡')
})


const options = {
    method: 'GET',
    url: 'https://coinranking1.p.rapidapi.com/coins',
    params: {
        referenceCurrencyUuid: 'yhjMzLPhuIDl',
        timePeriod: '24h',
        'tiers[0]': '1',
        orderBy: 'marketCap',
        orderDirection: 'desc',
        limit: '100',
        offset: '0'
    },
    headers: {
        'X-RapidAPI-Key': 'c4f5254226msh10570caa9c1f5f8p1def93jsnb6055c72ecd0',
        'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
    }
};

const options2 = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'c4f5254226msh10570caa9c1f5f8p1def93jsnb6055c72ecd0',
        'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
    }
}

const options3 = {
    method: 'GET',
    headers: {
      'X-BingApis-SDK': 'true',
      'X-RapidAPI-Key': 'c4f5254226msh10570caa9c1f5f8p1def93jsnb6055c72ecd0',
      'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
    }
  };



axios.request(options).then(function (response) {
    const coins = response.data.data.coins
    const {
        total,
        totalCoins,
        totalMarkets,
        totalExchanges,
        totalMarketCap,
        total24hVolume
    } = response.data.data.stats


    bot.on('message', (message) => {
        const userId = message.from.id
        const chatId = message.chat.id
        const name = message.from.first_name + " " + message.from.last_name
        const input = message.text

        if (input == 'hello' || input == 'hi') {
            bot.sendMessage(userId, `
            Hello ${name} it's CryptoBot from 99t content
            type 'help' to know more...
            `)
        }

        if (input == '/start' || input=='help') {
            bot.sendMessage(userId, `
                Hello ${name} Welcome to CryptoCurrencies bot by 99t content.
                Here are the list of things you can do with this bot - 
                👉 'stats' - To get current total stats of crypto currencies.
                👉 'bitcoin'(or any other crypto name) - To get all the possible information of that crypto currency.
                👉 'list' - To get list of all crypto currencies with there rank, name, uuid.
                👉 'news bitcoin'(or any other crypto name) - To get top 5 news articles of that crypto currency.

                Things to remember while using this bot - 
                👉 Make sure of the format given above otherwise it will not work.
                👉 If the name of crypto didn't work then type 'list' to get all the list of crypto and from that list you can copy name in order to get information of that crypto currency.
                Thanks for visiting this bot.
            `)
        }


        if (input == 'stats') {
            bot.sendMessage(userId,
                `   Total = ${shortNumber(total)}
                Total Coins = ${shortNumber(totalCoins)}
                Total Markets = ${shortNumber(totalMarkets)}
                Total Exchanges = ${shortNumber(totalExchanges)}
                Total Market Cap = ${shortNumber(totalMarketCap)}
                Total 24h Volume = ${shortNumber(total24hVolume)}
         `)
        }


        const crypto = (query) => {

            function toTitleCase(str) {
                return str.replace(
                  /\w\S*/g,
                  function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                  }
                );
              }

              function toUpperCase(str) {
                return str.replace(
                  /\w\S*/g,
                  function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toUpperCase();
                  }
                );
              }

              const item = toTitleCase(query)
              const item2 = toUpperCase(query)

            coins.filter(coin => {
                if (item === coin.name || query===coin.name || item2 === coin.name) {
                    const uuid = coin.uuid
                    const url = `https://coinranking1.p.rapidapi.com/coin/${uuid}?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`;
        
                    fetch(url, options2)
                    .then(res => res.json())
                    .then(json => {
                        const data = json.data.coin
                        bot.sendMessage(userId,`
                        Rank = ${data.rank}
                        Name = ${data.name}
                        Symbol = ${data.symbol}
                        Price = ${shortNumber(data.price)}
                        Number of Markets = ${shortNumber(data.numberOfMarkets)}
                        Number of Exchanges = ${shortNumber(data.numberOfExchanges)}
                        24h Volume = ${shortNumber(data['24hVolume'])}
                        Market Cap = ${shortNumber(data.marketCap)}
                        Official Website = ${data.websiteUrl}
                        Description = 
                        ${convert(data.description)}
                        Learn More = ${data.coinrankingUrl}
                        `)


                        data?.links?.map(link=>{
                            bot.sendMessage(userId,
                                `${link.name}-->${link.url}`
                                )
                        })
            
            
                    })
                    .catch(err => console.error('error:' + err));

                }

            })
        }
        crypto(input)




        const cryptoNews = (query) => {

            function toLowerCase(str) {
                return str.replace(
                  /\w\S*/g,
                  function(txt) {
                    return txt.charAt(0).toLowerCase() + txt.substr(1).toLowerCase();
                  }
                );
              }

              const item = toLowerCase(query)

            coins.filter(coin => {
                if (item.includes('news' || 'News')) {

                    const q = item.slice(5)
                    const url = `https://bing-news-search1.p.rapidapi.com/news/search?q=${q}&count=5&freshness=Day&textFormat=Raw&safeSearch=Off`
        
                fetch(url, options3)
                .then(res => res.json())
                .then(json => {
                    const data = json?.value
                    data?.map(item=>{
                        bot.sendMessage(userId,`
                        ${item?.about[0]?.name}
                        Title -> ${item?.name}
                        Description -> ${item?.description}
                        ${item.url}
                        `)

                    })
                })
                .catch(err => console.error('error:' + err));
                }
            })
        }
        cryptoNews(input)


        if (input === 'crypto list' || input === 'list' || input === 'show all crypto') {
            for (let i = 0; i <= coins.length; i++) {
                bot.sendMessage(userId,
                    `
                    Rank - ${coins[i].rank}
                    Name - ${coins[i].name}
                    id - ${coins[i].uuid}
                    `)
            }
        }



    })


}).catch(function (error) {
    console.error(error);
});










// using fetch api 
// bot.on('message',(message)=>{
//         const userId = message.from.id
//         const chatId = message.chat.id
//         const name = message.from.first_name + " " + message.from.last_name
//         const input = message.text

//         if(input.includes('about')){
           
//         }

       






// })






















app.listen(PORT, () => {
    console.log(`Running up the hill at ${PORT}km/hr speed`)
})