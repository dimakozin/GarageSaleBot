import TelegramBot from 'node-telegram-bot-api';

import StateMachine from './modules/stateMachine'
import { ScenarioParser  } from './modules/scenarioParser'
import * as settings from './settings.json' 


const token = settings.token;
const bot = new TelegramBot(token, {polling: true});

const scenarioParser = new ScenarioParser(settings.scenarioFile)

bot.on('message', (msg) => {
    const chatId = msg.chat.id
    const text = msg.text

    const userState = StateMachine.getState(chatId)

    const response = scenarioParser.getResponse(userState, text)
    bot.sendMessage(chatId, response.text, response.options)

    if(response.stateParameters.dropState){
        StateMachine.dropState(chatId)
    } else if(response.stateParameters.setState){
        StateMachine.setState(chatId, response.stateParameters.setStateName)
    }
})

bot.on("polling_error", console.log);