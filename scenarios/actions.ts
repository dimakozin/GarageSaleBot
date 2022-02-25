/**
 *   IMPORTANT! 
 *   Every function must have arguments:
 *   @bot - instance of telegram bot
 *   @msg - user message
 * 
 */

import { IInlineKeyboardMarkup } from "../modules/scenarioTypes"
import Storage from "../modules/Storage" 

const categories_per_rows = 3

export default {
    sendCategories: (bot, msg) => {
        let rows = []
        for(let i = 0; i < Math.ceil(Storage.categories.length/categories_per_rows); i++){
            rows[i] = Storage.categories.slice( i*categories_per_rows, (i+1)*categories_per_rows)
        }
        
        let options = {
            reply_markup: null
        }

        options.reply_markup = {} as IInlineKeyboardMarkup
        options.reply_markup.inline_keyboard = []

        rows.forEach( row => {
            let buttonsRow = []
            row.forEach(button => {
                buttonsRow.push({
                    text: button.name,
                    callback_data: JSON.stringify({
                        category_id: button.id
                    })
                })
            })
            options.reply_markup.inline_keyboard.push(buttonsRow)
        })

        bot.sendMessage(msg.chat.id, 'Выберите интересующую вас категорию:', options)

    }
}