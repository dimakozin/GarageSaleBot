import YAML from 'js-yaml'
import fs from 'fs'

import { IScenario, 
    IBranch, 
    IReplyKeyboardMarkup, 
    IInlineKeyboardMarkup, 
    IButton 
} from './scenarioTypes'

class ScenarioParser {
    scenario: IScenario

    /**
     * Constructor of scenarioParser class
     * @param scenarioPath - path to bot scenario
     */
    constructor(scenarioPath){
        const file = fs.readFileSync(scenarioPath)
        this.scenario = YAML.load(file)
    }

    private getEndpointsByStates(state: string): Array<IBranch> {
        return this.scenario.states[state].endpoints
    }

    private getCallbacksByStates(state: string): Array<IBranch> {
        return this.scenario.states[state].callbacks
    }

    private getEndpointByEndpointName(endpoints, endpoint) {
        if(endpoint in endpoints){
            return endpoints[endpoint]
        } else if('default' in endpoints) {
            return endpoints['default']
        } else {
            return null
        }
    }

    private getOptions(endpointData){
        if('reply_markup' in endpointData){
            let options = {
                reply_markup: null
            }

            if('ReplyKeyboardMarkup' in endpointData.reply_markup){
                options.reply_markup = {} as IReplyKeyboardMarkup

                options.reply_markup.one_time_keyboard = false // TODO: get from scenarion
                options.reply_markup.resize_keyboard = true // TODO: get from scenario
                options.reply_markup.keyboard = []
                
                const keyboardRows = endpointData.reply_markup.ReplyKeyboardMarkup.keyboard
                keyboardRows.forEach(row => {
                    const buttons = []
                    row.row.forEach(button => {
                        buttons.push(button.button.text)
                    })
                    options.reply_markup.keyboard.push(buttons)
                })
            }

            if('InlineKeyboardMarkup' in endpointData.reply_markup){
                options.reply_markup = {} as IInlineKeyboardMarkup
                options.reply_markup.inline_keyboard = []

                const keyboardRows = endpointData.reply_markup.InlineKeyboardMarkup.inline_keyboard
                keyboardRows.forEach(row => {
                    const buttons = []
                    row.row.forEach(button => {
                        let btn = {
                            text: button.button.text
                        } as IButton

                        if('url' in button.button){
                            btn.url = button.button.url
                        }

                        if('callback_data' in button.button){
                            btn.callback_data = button.button.callback_data
                        }

                        buttons.push(btn)
                    })
                    options.reply_markup.inline_keyboard.push(buttons)
                })
            }

            return options

        }
        else return {}
    }

    public getResponse(actionType: string, state: string, endpoint: string) {
        const endpoints = actionType == "message" ?
        this.getEndpointsByStates(state) : this.getCallbacksByStates(state);
        
        const endpointData = this.getEndpointByEndpointName(endpoints, endpoint)
        
        const text = endpointData?.text ? endpointData.text.join('\n') : null
        const options = this.getOptions(endpointData)

        const stateParameters = {
            dropState: 'dropState' in endpointData ? endpointData.dropState : null,
            setState: 'setState' in endpointData ? endpointData.setState : null,
            setStateName: 'setStateName' in endpointData ? endpointData.setStateName : null
        }
        
        const actions = {
            middlewares: 'middlewares' in endpointData? endpointData.middlewares : null,
            postActions: 'postActions' in endpointData ? endpointData.postActions : null,
        }

        return {text, options, stateParameters, actions}
    }

}

export default ScenarioParser