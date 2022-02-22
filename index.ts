import TelegramBot from 'node-telegram-bot-api';
import YAML from 'js-yaml'
import fs from 'fs'

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

    scenarioParser.getResponse(userState, text)
    
})