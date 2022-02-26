/**
 *   IMPORTANT! 
 *   Every function must have arguments:
 *   @bot - instance of telegram bot
 *   @msg - user message
 * 
 */

import { IInlineKeyboardMarkup } from "./scenarioTypes"
import Storage from "./Storage" 

const categories_per_rows = 3

export default {
    sendCategories: (bot, msg) => {
        let categories = Storage.getCategories()

        let rows = []
        for(let i = 0; i < Math.ceil(categories.length/categories_per_rows); i++){
            rows[i] = categories.slice( i*categories_per_rows, (i+1)*categories_per_rows)
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
                        action: 'getProductsFromCategory',
                        categoryId: button.id
                    })
                })
            })
            options.reply_markup.inline_keyboard.push(buttonsRow)
        })

        bot.sendMessage(msg.chat.id, 'Выберите интересующую вас категорию:', options)

    }
}