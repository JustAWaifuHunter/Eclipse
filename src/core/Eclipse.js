const Sentry = require('@sentry/node')
const { Client, Options, Collection, Permissions } = require('discord.js')
const DatabaseManager = require('denky-database')
const Util = require('../structures/Utils.js')
const pkg = require('../../package.json')

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  release: `eclipse@${pkg.version}`
})

class Eclipse
  extends Client {
  constructor (options = {}) {
    super({
      shardCount: 2,
      intents: 4737,
      partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION'
      ],
      restTimeOffset: 0,
      allowedMentions: {
        parse: [
          'users',
          'roles'
        ]
      },
      makeCache: Options.cacheWithLimits({
        UserManager: 1,
        GuildEmojiManager: 0,
        StageInstanceManager: 0,
        ThreadMemberManager: 0,
        GuildBanManager: 0,
        ApplicationCommandManager: 0,
        ApplicationCommandPermissionsManager: 0,
        GuildApplicationCommandManager: 0,
        GuildEmojiRoleManager: 0,
        GuildInviteManager: 0
      })
    })

    this.validate(options)

    this.commands = new Collection()

    this.aliases = new Collection()

    this.events = new Collection()

    this.utils = new Util(this)

    this.lang = {}

    this.version = pkg.version

    // provisional database
    this.db = new DatabaseManager('./data/db.json')

    this.sentry = Sentry
  }

  validate () {
    this.token = process.env.BOT_TOKEN

    this.prefix = process.env.BOT_PREFIX

    this.defaultPerms = new Permissions(['SEND_MESSAGES', 'READ_MESSAGE_HISTORY']).freeze()
  }

  async start (token = this.token) {
    this.utils.loadCommands()
    this.utils.loadEvents()
    await super.login(token)
  }
}

module.exports = Eclipse
