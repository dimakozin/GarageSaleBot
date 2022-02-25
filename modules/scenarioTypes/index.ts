interface IScenario {
    version: string,
    states: Array<object>
}

interface IBranch {
    endpoints: Array<object>
}

interface IResponseOptions {
    reply_markup: IReplyKeyboardMarkup|IInlineKeyboardMarkup
}

interface IKeyboardMarkup {

}

interface IButton {
    text: string,
    url?: string,
    callback_data?: string
}

interface IReplyKeyboardMarkup extends IKeyboardMarkup {
    one_time_keyboard: Boolean,
    resize_keyboard: Boolean,
    keyboard: Array<object>
}

interface IInlineKeyboardMarkup extends IKeyboardMarkup {
    inline_keyboard: Array<object>,
}

export {IScenario, 
    IBranch, 
    IResponseOptions, 
    IReplyKeyboardMarkup, 
    IInlineKeyboardMarkup, 
    IButton
}