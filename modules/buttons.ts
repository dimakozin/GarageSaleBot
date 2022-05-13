
interface ITelegramButtonObject {
    text: string,
    callback_data: string
}

abstract class TelegramButton {
    protected text: string
    protected readonly action: string

    constructor(text: string, action: string){
        this.text = text
        this.action = action
    }

    public toObject(): ITelegramButtonObject { throw new Error('Method cannot implemented in abstract class'); }
}

class ProductButton extends TelegramButton {
    protected categoryId: string
    protected seqNumber: number

    constructor(text: string, categoryId: string, seqNumber: number){
        super(text, 'getProdFromCategory')
        this.categoryId = categoryId
        this.seqNumber = seqNumber
    }

    public toObject(): ITelegramButtonObject {
        return {
            text: this.text,
            callback_data: JSON.stringify({
                action: this.action,
                categoryId: this.categoryId,
                seqNumber: this.seqNumber
            })
        }
    }    
}

class CategoryButton extends TelegramButton {
    protected categoryId: string
    
    constructor(text: string, categoryId: string){
        super(text, 'sendFirstFromCategory')
        this.categoryId = categoryId
    }

    public toObject(): ITelegramButtonObject {
        return {
            text: this.text,
            callback_data: JSON.stringify({
                action: this.action,
               categoryId: this.categoryId,
            })
        }
    }
}
class FirstProductButton extends ProductButton {
    constructor(categoryId: string){
        super('⏪', categoryId, 0)
    }
}

class LikeButton extends TelegramButton {
    private productId: number

    constructor(productId: number){
        super('❤️', 'likeProduct')
        this.productId = productId
    }

    public toObject(): ITelegramButtonObject {
        return {
            text: this.text,
            callback_data: JSON.stringify({
                action: this.action,
                productId: this.productId
            })
        }
    }
}

class DislikeButton extends TelegramButton {
    private productId: number

    constructor(productId: number){
        super('💔', 'likeProduct')
        this.productId = productId
    }

    public toObject(): ITelegramButtonObject {
        return {
            text: this.text,
            callback_data: JSON.stringify({
                action: this.action,
                productId: this.productId
            })
        }
    }
}

class AddProductButton extends TelegramButton {
    protected readonly categoryId: string

    constructor(categoryId: string){
        super('➕ Добавить товар в категорию', 'addProduct')
        this.categoryId = categoryId
    }

    public toObject(): ITelegramButtonObject {
        return {
            text: this.text,
            callback_data: JSON.stringify({
                action: this.action,
                categoryId: this.categoryId
            })
        }
    }
}

class AddCategoryButton extends TelegramButton {
    constructor() {
        super('➕ Добавить категорию', 'addCategory')
    }

    public toObject(): ITelegramButtonObject {
        return {
            text: this.text,
            callback_data: JSON.stringify({
                action: this.action
            })
        }
    }
}

export {ProductButton, FirstProductButton, LikeButton, DislikeButton, AddProductButton, CategoryButton, AddCategoryButton}