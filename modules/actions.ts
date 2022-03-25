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

import {BPM, BPMState} from './BPM'

const BPMEngine = new BPM()
const categories_per_rows = 3


const getProductsButtons = (categoryId, productId, seqNumber, categoryLength, username) => {
    const inline_keyboard = []

    const addNewProduct = new AddProductButton(categoryId)

    if(categoryLength != 0)
    {
        inline_keyboard.push([])

        const firstButton = new FirstProductButton(categoryId)
        const prevButton = new ProductButton('◀️', categoryId, seqNumber - 1)
        const nextButton = new ProductButton('▶️', categoryId, seqNumber + 1)
        const lastButton = new ProductButton('⏩', categoryId, categoryLength-1)
    
        const likeButton = new LikeButton(productId)
    
        if(seqNumber > 0){
            inline_keyboard[0].push(firstButton.toObject(), prevButton.toObject())
        } 
    
        inline_keyboard[0].push(likeButton.toObject())
    
        if(seqNumber < categoryLength-1){
            inline_keyboard[0].push(nextButton.toObject(), lastButton.toObject())
        } 
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
        const userId = msg.message.chat.id
        const productInfo = Storage.getProdFromCategory(categoryId, 0);
        const product = productInfo.product

        const inline_keyboard = getProductsButtons(categoryId, product ? product.id : 0, 
            0, productInfo.categoryLength, msg.from.username)
        
        if(productInfo.categoryLength == 0){
            bot.sendMessage(userId, 'Категория пуста', {
                reply_markup: {
                    inline_keyboard: inline_keyboard
                }
            })
            return
        }

        const description = `${product.name}. Стоимость: ${product.price}`

        bot.sendPhoto(userId,
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
    },
    startAddProductProcess: (bot, msg, callback_data = null) => {
        const userId = msg.message.chat.id
        BPMEngine.startProccess(userId)
        BPMEngine.addParameterToUserState(userId, {
            categoryId: callback_data.categoryId
        })
    },
    addProduct: (bot, msg, callback_data = null) => {
        const userId = msg.chat.id
        let bpmUserState = BPMEngine.getUserState(userId)   
             
        switch(bpmUserState){
            case BPMState.setProductName:
                BPMEngine.addParameterToUserState(userId, {
                    name: msg.text
                })
                BPMEngine.setNextState(userId)
                bot.sendMessage(userId, 'Теперь пришлите фотографию продукта')
                break;
            case BPMState.setProductPhoto:
                const photos = msg.photo
                const bestQualityPhoto = photos[photos.length-1]
                const fileId = bestQualityPhoto.file_id
                BPMEngine.addParameterToUserState(userId, {
                    file_id: fileId
                })
                BPMEngine.setNextState(userId)
                bot.sendMessage(userId, 'И цену:')
                break;
            case BPMState.setProductPrice:
                BPMEngine.addParameterToUserState(userId, {
                    price: msg.text
                })
                const data = BPMEngine.getStateData(userId)
                Storage.addNewProduct(data)
                BPMEngine.setNextState(userId)
                bot.sendMessage(userId, 'Продукт добавлен!\
                \nЕсли хотите добавить еще продукт - просто введите наименование\
                \nЕсли хотите выйти из режима добавления - введите /stop')
                break;
        }
    },
    dropBPMUserState: (bot, msg, callback_data = null) => {
        BPMEngine.dropState(msg.chat.id)
    },
    likeProduct: (bot, msg, callback_data = null) => {
        const username = msg.from.username
        const {product} = callback_data

        const productLiked = Storage.isLikeSetted(username, product)

        if(!productLiked){
            Storage.setLike(username, product)
        }

    }
}