interface IStateCollection {
    chatId: number,
    state: string
}

class StateMachine {
    private collection: Array<IStateCollection>

    /**
     * Constructor of StateMachine class
     */
    constructor() {
        this.collection = []
    }

    /**
     * Устанавливает пользовательское состояние
     * @param chatId идентификатор пользователя
     * @param state состояние пользователя
     */
    public setState(chatId: number, state: string){
        let obj = this.collection.find( instance => {
            return instance.chatId == chatId
        })
        if(!!obj) obj.state = state
        else this.collection.push({chatId: chatId, state: state})
    }

    /**
     * Возвращает текущее состояние пользователя
     * @param chatId идентификатор пользователя
     * @returns состояние пользователя
     */
    public getState(chatId: number) : string {
        const foundState = this.collection.find( instance => {
            return instance.chatId == chatId
        })
        return !!foundState ? foundState.state : "none"

    }

    /**
     * Сбрасывает состояние пользователя 
     * @param chatId идентификатор пользователя
     */
    public dropState(chatId: number){
        this.collection = this.collection.filter(instance => instance.chatId !== chatId)
    }

}

export default new StateMachine();