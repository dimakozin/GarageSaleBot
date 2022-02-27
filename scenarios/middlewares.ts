/**
 *   IMPORTANT! 
 *   Every function must have arguments:
 *   @bot - instance of telegram bot
 *   @msg - user message
 * 
 *   Every middleware function must return true or false
 *   If function return false, message action can be execute
 * 
 */

import UsersPrivileges from "../modules/UsersPrivileges"

export default {
    IsUserAdmin: (bot:any, msg: any) => {
        const username = msg.from.username // TODO: rewrite. Tis only for callbacks
        return UsersPrivileges.admins.includes(username)
    }
}