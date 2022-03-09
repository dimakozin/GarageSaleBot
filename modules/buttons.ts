
abstract class TelegramButton {
    protected text: string
    protected readonly action: string

    constructor(text: string, action: string){
        this.text = text
        this.action = action
    }

    public toObject(): object { return {} }
}

class ProductButton extends TelegramButton {
    protected categoryId: string
    protected seqNumber: number

    constructor(text: string, categoryId: string, seqNumber: number){
        super(text, 'getProdFromCategory')
        this.categoryId = categoryId
        this.seqNumber = seqNumber
    }

    public toObject(): object {
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

    public toObject(): object {
        return {
            text: this.text,
            callback_data: JSON.stringify({
                action: this.action,
                product: this.productId
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

    public toObject(): object {
        return {
            text: this.text,
            callback_data: JSON.stringify({
                action: this.text,
                product: this.categoryId
            })
        }
    }
}

export {ProductButton, FirstProductButton, LikeButton, AddProductButton}