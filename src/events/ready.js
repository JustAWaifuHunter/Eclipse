/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
const Event = require('../interfaces/Event')
const LavalinkManager = require('../core/Player/lavalinkManager')
const logger = require('../modules/logger')

module.exports = class extends Event {
  constructor (...args) {
    super(...args, {
      once: true
    })
  }

  async run () {
    setInterval(() => {
      this.client.users.cache.sweep(u => u)
    }, 6000)

    LavalinkManager(this.client)
    this.client.manager.init(this.client.user.id)

    logger.info(`${this.client.user.username} started`)

    setInterval(() => {
      this.client.user.setActivity(`${this.client.prefix}help | Uptime ${this.client.utils.time(this.client.uptime)}`), { type: 5 }
    }, 60000)
  }
}
