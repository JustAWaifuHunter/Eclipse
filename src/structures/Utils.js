const path = require('path')
const { promisify } = require('util')
const glob = promisify(require('glob'))
const Command = require('../interfaces/Command')
const Event = require('../interfaces/Event')
const logger = require('../modules/logger')

class Util {
  constructor (client) {
    this.client = client
  }

  isClass (input) {
    return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class'
  }

  get directory () {
    return `${path.dirname(require.main.filename)}${path.sep}`
  }

  trimArray (arr, maxLen = 10) {
    if (arr.length > maxLen) {
      const len = arr.length - maxLen
      arr = arr.slice(0, maxLen)
      arr.push(`${len} mais...`)
    }
    return arr
  }

  formatBytes (bytes) {
    if (bytes === 0) return '0 Bytes'
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
  }

  removeDuplicates (arr) {
    return [...new Set(arr)]
  }

  capitalise (string) {
    return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ')
  }

  checkOwner (target, owners = process.env.BOT_OWNERS) {
    return owners.includes(target)
  }

  comparePerms (member, target) {
    return member.roles.highest.position < target.roles.highest.position
  }

  formatPerms (perm) {
    return perm
  }

  formatArray (array, type = 'conjunction') {
    return new Intl.ListFormat('en-GB', { style: 'short', type: type }).format(array)
  }

  formatArray2 (array, type = 'conjunction') {
    return new Intl.ListFormat('pt-BR', { style: 'short', type: type }).format(array)
  }
  // eslint-disable-next-line
	time2(s) {
    function pad (n, z) {
      z = z || 2
      return ('00' + n).slice(-z)
    }
    const ms = s % 1000
    s = (s - ms) / 1000
    const secs = s % 60
    s = (s - secs) / 60
    const mins = s % 60
    let hrs = (s - mins) / 60

    let days = parseInt(Math.floor(hrs / 24))
    hrs = parseInt(hrs % 24)

    const meses = parseInt(Math.floor(days / 30))
    days = parseInt(days % 30)

    return (meses > 0 ? pad(meses) + 'm, ' : '') + (days > 0 ? pad(days) + 'd, ' : '') + (hrs > 0 ? pad(hrs) + 'h, ' : '') + (mins > 0 ? pad(mins) + 'm ' : '') + (pad(secs) + 's')
  }

  time (s) {
    function pad (n, z) {
      z = z || 2
      return ('00' + n).slice(-z)
    }
    const ms = s % 1000
    s = (s - ms) / 1000
    const secs = s % 60
    s = (s - secs) / 60
    const mins = s % 60
    let hrs = (s - mins) / 60

    let days = parseInt(Math.floor(hrs / 24))
    hrs = parseInt(hrs % 24)

    const meses = parseInt(Math.floor(days / 30))
    days = parseInt(days % 30)

    return (meses > 0 ? pad(meses) + 'm, ' : '') + (days > 0 ? pad(days) + 'd, ' : '') + (hrs > 0 ? pad(hrs) + 'h, ' : '') + (mins > 0 ? pad(mins) + 'm ' : '') + (pad(secs) + 's')
  }

  async loadCommands () {
    logger.info('Commands loaded')
    return glob(`${this.directory}commands/**/*.js`).then(commands => {
      for (const commandFile of commands) {
        delete require.cache[commandFile]
        const { name } = path.parse(commandFile)
        const File = require(commandFile)
        if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`)
        const command = new File(this.client, name.toLowerCase())
        if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesnt belong in Commands.`)
        let slashCommand
        if (command.options) {
          slashCommand = {
            name: command.name,
            description: command.description,
            options: command.options
          }
        } else {
          // eslint-disable-next-line no-unused-vars
          slashCommand = {
            name: command.name,
            description: command.description
          }
        }
        this.client.application?.commands.set([slashCommand])
        this.client.commands.set(command.name, command)
      }
    })
  }

  async loadEvents () {
    logger.info('Events loaded')
    return glob(`${this.directory}events/*.js`).then(events => {
      for (const eventFile of events) {
        delete require.cache[eventFile]
        const { name } = path.parse(eventFile)
        const File = require(eventFile)
        if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`)
        const event = new File(this.client, name)
        if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events`)
        this.client.events.set(event.name, event)
        event.emitter[event.type](name, (...args) => event.run(...args))
      }
    })
  }
}

module.exports = Util
