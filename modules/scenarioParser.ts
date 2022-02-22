import YAML from 'js-yaml'
import fs from 'fs'

import {IScenario, IBranch} from './scenarioTypes'


class ScenarioParser {
    scenario: IScenario

    /**
     * Constructor of scenarioParser class
     * @param scenarioPath - path to bot scenario
     */
    constructor(scenarioPath){
        const file = fs.readFileSync(scenarioPath)
        this.scenario = YAML.load(file)
    }

    private getEndpointsByStates(state: string): Array<IBranch> {
        return this.scenario.states[state].endpoints
    }

    public getResponse(state: string, endpoint: string) {
        const endpoints = this.getEndpointsByStates(state)
        /*
        TODO: parse endpoint

        
        let responseParameters = null
        if(endpoint in endpoints){
            responseParameters = endpoints[endpoint]
        } else {
            responseParameters = endpoint['default']
        }
        */

    }

}

export {ScenarioParser}