
class ActionsParser {
    actionsModule: any;
    bot: object

    constructor(actionsFile: string, bot: object) {
        this.bot = bot       
        import(actionsFile)
            .then(obj => this.actionsModule = obj.default)
    }

    public doAction(msg) {
        const data = JSON.parse(msg.data)
        const action = data.action
        
        delete data.action

        this.actionsModule[action](this.bot, msg, data)
    }

}

export default ActionsParser
