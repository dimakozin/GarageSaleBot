

enum BPMState {
    setProductName,
    setProductPhoto,
    setProductPrice
}

interface IBPMState {
    userId: number,
    state: BPMState,
    data: object
}


class BPM {
    private context: Array<IBPMState>

    constructor(){
        this.context = []
    }

    public getUserState(userId: number): BPMState {
        const userState = this.context.find( obj => obj.userId === userId )
        return !!userState ? userState.state : null
    }

    public startProccess(userId: number) {
        this.context.push({
            userId: userId,
            state: BPMState.setProductName,
            data: {}
        })

        return BPMState.setProductName
    }

    public setNextState(userId: number) {
        const userState = this.context.find(obj => obj.userId === userId)

        if(userState.state == BPMState.setProductPrice){
            userState.state = BPMState.setProductName
        } else {
            userState.state++
        }
    }

    public dropState(userId: number){
        this.context = this.context.filter( obj => obj.userId !== userId)
    }

    public addParameterToUserState(userId:number, parameter: object) {
        const userState = this.context.find(obj => obj.userId == userId)
        Object.keys(parameter).forEach(key => {
            userState.data[key] = parameter[key]
        })
    }

    public getStateData(userId: number): object {
        return this.context.find(obj => obj.userId === userId).data
    }
}

export {
    BPM,
    BPMState
}

