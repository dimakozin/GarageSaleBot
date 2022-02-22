interface IScenario {
    version: string,
    states: Array<object>
}

interface IBranch {
    endpoints: Array<object>
}

export {IScenario, IBranch}