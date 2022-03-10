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
import {ProductButton, 
    FirstProductButton, 
    LikeButton, 
    AddProductButton,
    CategoryButton,
    AddCategoryButton } from './buttons'

const categories_per_rows = 3

const getProductsButtons = (categoryId, productId, seqNumber, categoryLength, username) => {
    const inline_keyboard = [[]]

    const firstButton = new FirstProductButton(categoryId)
    const prevButton = new ProductButton('◀️', categoryId, seqNumber - 1)
    const nextButton = new ProductButton('▶️', categoryId, seqNumber + 1)
    const lastButton = new ProductButton('⏩', categoryId, categoryLength-1)
    const addNewProduct = new AddProductButton(categoryId)

    const likeButton = new LikeButton(productId)

    if(seqNumber > 0){
        inline_keyboard[0].push(firstButton.toObject(), prevButton.toObject())
    } 

    inline_keyboard[0].push(likeButton.toObject())

    if(seqNumber < categoryLength-1){
        inline_keyboard[0].push(nextButton.toObject(), lastButton.toObject())
    }

    if(UsersPrivileges.admins.includes(username)){
        inline_keyboard.push([addNewProduct.toObject()])
    }

    return inline_keyboard
}

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
                const categoryButton = new CategoryButton(button.name, button.id)
                buttonsRow.push(categoryButton.toObject())
            })
            options.reply_markup.inline_keyboard.push(buttonsRow)
        })

        if(UsersPrivileges.admins.includes(msg.from.username)){
            options.reply_markup.inline_keyboard.push([new AddCategoryButton().toObject()])
        }

        bot.sendMessage(msg.chat.id, 'Выберите интересующую вас категорию:', options)

    },
    getProdFromCategory: (bot, msg, callback_data = null) => {
        const {categoryId, seqNumber} = callback_data
        const productInfo = Storage.getProdFromCategory(categoryId, seqNumber);
        const product = productInfo.product

        const description = `${product.name}. Стоимость: ${product.price}`

        const inline_keyboard = getProductsButtons(categoryId, product.id, 
            seqNumber, productInfo.categoryLength, msg.from.username)

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

        const inline_keyboard = getProductsButtons(categoryId, product.id, 
            0, productInfo.categoryLength, msg.from.username)
        
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