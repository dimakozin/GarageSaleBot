/**
 *   IMPORTANT! 
 *   Every function must have arguments:
 *   @bot - instance of telegram bot
 *   @msg - user message info
 *   @callback_data (nullable) - callback dataobject 
 * 
 */

import { IInlineKeyboardMarkup } from "./scenarioTypes"
import Storage from "./Storage" 
import UsersPrivileges from "./UsersPrivileges"

const categories_per_rows = 3

export default {
    sendCategories: (bot, msg, callback_data = null) => {
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
                        action: 'sendFirstFromCategory',
                        categoryId: button.id,
                    })
                })
            })
            options.reply_markup.inline_keyboard.push(buttonsRow)
        })

        if(UsersPrivileges.admins.includes(msg.from.username)){
            options.reply_markup.inline_keyboard.push([{
                text: 'Добавить категорию',
                callback_data: JSON.stringify({
                    action: 'addCategory'
                })
            }])
        }

        bot.sendMessage(msg.chat.id, 'Выберите интересующую вас категорию:', options)

    },
    getProdFromCategory: (bot, msg, callback_data = null) => {
        const {categoryId, seqNumber} = callback_data
        const productInfo = Storage.getProdFromCategory(categoryId, seqNumber);
        const product = productInfo.product

        let inline_keyboard = [[]]

        const firstButton = {
            text: '⏪',
            callback_data: JSON.stringify({
                action: 'getProdFromCategory',
                categoryId: categoryId,
                seqNumber: 0
            })
        }

        const prevButton = {
            text: '◀️',
            callback_data: JSON.stringify({
                action: 'getProdFromCategory',
                categoryId: categoryId,
                seqNumber: seqNumber-1
            })
        }

        const nextButton = {
            text: '▶️',
            callback_data: JSON.stringify({
                action: 'getProdFromCategory',
                categoryId: categoryId,
                seqNumber: seqNumber + 1
            })
        }

        const lastButton = {
            text: '⏩',
            callback_data: JSON.stringify({
                action: 'getProdFromCategory',
                categoryId: categoryId,
                seqNumber: productInfo.categoryLength-1
            })
        }

        const likeButton = {
            text: '❤️',
            callback_data: JSON.stringify({
                action: 'likeProduct',
                product: product.id
            })
        }

        if(seqNumber > 0){
            inline_keyboard[0].push(firstButton, prevButton)
        } 

        inline_keyboard[0].push(likeButton)

        if(seqNumber < productInfo.categoryLength-1){
            inline_keyboard[0].push(nextButton, lastButton)
        }

        const description = `${product.name}. Стоимость: ${product.price}`

        bot.editMessageMedia({
            type: 'photo',
            media: product.file_id
        }, {
            chat_id: msg.message.chat.id,
            message_id: msg.message.message_id,
            reply_markup: {
                inline_keyboard: inline_keyboard
            },
        }).then(() => {
            bot.editMessageCaption(description, {
                chat_id: msg.message.chat.id,
                message_id: msg.message.message_id,
                reply_markup: {
                    inline_keyboard: inline_keyboard
                }
            })
        })
    },
    sendFirstFromCategory: (bot, msg, callback_data = null) => {
        const {categoryId} = callback_data
        const productInfo = Storage.getProdFromCategory(categoryId, 0);
        const product = productInfo.product

        let inline_keyboard = [[]]

        const nextButton = {
            text: '▶️',
            callback_data: JSON.stringify({
                action: 'getProdFromCategory',
                categoryId: categoryId,
                seqNumber: 1
            })
        }

        const lastButton = {
            text: '⏩',
            callback_data: JSON.stringify({
                action: 'getProdFromCategory',
                categoryId: categoryId,
                seqNumber: productInfo.categoryLength-1
            })
        }

        const likeButton = {
            text: '❤️',
            callback_data: JSON.stringify({
                action: 'likeProduct',
                product: product.id
            })
        }

        const addNewProduct = {
            text: '➕ Добавить товар в категорию',
            callback_data: JSON.stringify({
                action: 'addProduct',
                categoryId: categoryId
            })
        }

        inline_keyboard[0].push(likeButton)

        if(productInfo.categoryLength !== 1){
            inline_keyboard[0].push(nextButton, lastButton)
        }

        if(UsersPrivileges.admins.includes(msg.from.username)){
            inline_keyboard.push([addNewProduct])
        }

        const description = `${product.name}. Стоимость: ${product.price}`

        bot.sendPhoto(msg.message.chat.id,
            product.file_id, {
                caption: description,
                reply_markup: {
                    inline_keyboard: inline_keyboard
                }
            })
    },
    addCategory: (bot, msg, callback_data = null) => {
        const categoryName = msg.text
        try{
            Storage.addCategory(categoryName)
        } catch(ex) {
            bot.sendMessage(msg.chat.id, 'Произошла ошибка при добавлении категории')
        }
    }
}