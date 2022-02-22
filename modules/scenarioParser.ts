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

    private getEndpointByEndpointName(endpoints, endpoint) {
        if(endpoint in endpoints){
            return endpoints[endpoint]
        } else if('default' in endpoints) {
            return endpoint['default']
        } else {
            return null
        }
    }

    public getResponse(state: string, endpoint: string) {
        const endpoints = this.getEndpointsByStates(state)
        const endpointData = this.getEndpointByEndpointName(endpoints, endpoint)
        
        console.log(endpointData)
    }

}

export {ScenarioParser}