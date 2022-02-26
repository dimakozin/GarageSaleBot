
class ActionsParser {
    actionsModule: object;
    bot: object

    constructor(actionsFile: string, bot: object) {
        this.bot = bot       
        import(actionsFile)
            .then(obj => this.actionsModule = obj)
    }

    public doAction(msg) {
        const data = JSON.parse(msg.data)
        const action = data.action

        if(!(action in this.actionsModule)){
            return
        }

        delete data.action

        this.actionsModule[action](this.bot, data)
    }

}

export default ActionsParser
