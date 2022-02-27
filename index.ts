import TelegramBot from 'node-telegram-bot-api';

import StateMachine from './modules/stateMachine'
import ScenarioParser from './modules/scenarioParser'
import * as settings from './settings.json' 

import Actions from './modules/actions'
import Middlewares from './scenarios/middlewares'

const token = settings.token;
const bot = new TelegramBot(token, {polling: true});

const scenarioParser = new ScenarioParser(settings.scenarioFile)

const getMsgParameters = (msg: any, actionType: string) => {
    switch (actionType) {
        case 'message':
            return {
                chatId: msg.chat.id,
                text: msg.text    
            }
        case 'callback_query':
            return {
                chatId: msg.message.chat.id,
                text: JSON.parse(msg.data).action
            }
        }
}

const doAction = (actionType: string, msg: any) => {
    const {chatId, text} = getMsgParameters(msg, actionType)
    const userState = StateMachine.getState(chatId)

    const response = scenarioParser.getResponse(actionType, userState, text)

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
                    if(actionType == 'message'){
                        Actions[action](bot, msg);
                    }
                    else {
                        const data = JSON.parse(msg.data)
                        Actions[action](bot, msg, data)
                    }   
                }   
            })
        }
    } else {
        bot.sendMessage(chatId, 'Действие запрещено') 
    }

    if(response.stateParameters.dropState){
        StateMachine.dropState(chatId)
    } else if(response.stateParameters.setStateName){
        StateMachine.setState(chatId, response.stateParameters.setStateName)
    }

}


bot.on('message', (msg: any) => doAction('message', msg))

bot.on('callback_query', (msg: any) => doAction('callback_query', msg))

bot.on("polling_error", console.log);
