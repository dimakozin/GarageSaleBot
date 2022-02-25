import TelegramBot from 'node-telegram-bot-api';

import StateMachine from './modules/stateMachine'
import { ScenarioParser  } from './modules/scenarioParser'
import * as settings from './settings.json' 


const token = settings.token;
const bot = new TelegramBot(token, {polling: true});

const scenarioParser = new ScenarioParser(settings.scenarioFile)

import Actions from './scenarios/actions'
import Middlewares from './scenarios/middlwares'

bot.on('message', (msg) => {
    const chatId = msg.chat.id
    const text = msg.text

    const userState = StateMachine.getState(chatId)

    const response = scenarioParser.getResponse(userState, text)
    
    const middlewares = response.actions.middlewares
    let middlewaresPassed = true
    if(middlewares){
        middlewares.forEach( middleware =>{
            if(middlewaresPassed){
                middlewaresPassed = Middlewares[middleware](bot, msg)
            }
        })
    }

    if(middlewaresPassed){
        if(response.text){
            bot.sendMessage(chatId, response.text, response.options)
        }

        const postActions = response.actions.postActions
        if(postActions){
            postActions.forEach( action => {
                if(action in Actions){
                    Actions[action](bot, msg);
                }   
            })
        }
    } else {
        bot.sendMessage(chatId, 'Действие запрещено') 
    }

    if(response.stateParameters.dropState){
        StateMachine.dropState(chatId)
    } else if(response.stateParameters.setState){
        StateMachine.setState(chatId, response.stateParameters.setStateName)
    }
})

bot.on("polling_error", console.log);

bot.on('callback_query', data => {
    console.log(data)
})