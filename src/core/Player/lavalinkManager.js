const { Manager } = require('erela.js')
const { MessageEmbed } = require('discord.js')
const Deezer = require('erela.js-deezer')
const logger = require('../../modules/logger')

module.exports = async (client) => {
  require('./EclipsePlayer')
  client.manager = new Manager({
    nodes: [
      {
        host: process.env.LAVALINK_HOST,
        password: process.env.LAVALINK_PASSWORD,
        port: 2333,
        identifier: 'Bluma',
        retryDelay: 500
      }
    ],
    plugins: [
      new Deezer()
    ],
    autoPlay: true,
    send (id, payload) {
      const guild = client.guilds.cache.get(id)
      if (guild) guild.shard.send(payload)
    }
  })

    .on('nodeError', (node, error) => logger.error(5, `The node ${node.options.identifier} had the following error when trying to connect: ${error.message}`))
    .on('nodeConnect', node => logger.info(`Node ${node.options.identifier} has been connected`))

    .on('trackStart', (player, track) => {
      const channel = client.channels.cache.get(player.textChannel)
      let lang = client.db.get(channel.guild.id) || 'en'
      if (lang === 'en') lang = client.lang.en
      if (lang === 'pt') lang = client.lang.pt
      const embed = new MessageEmbed()
      embed.setTitle(lang.erela.tocando)
      embed.setDescription(`[${track.title}](${track.uri})`)
      embed.setColor(client.colors.default)
      player.get('interaction').reply({ embeds: [embed] }).then(msg => {
        player.set('interaction', null)
        player.set('message', msg)
      })
    })

    .on('trackEnd', (player) => {
      if (player.get('message') && !player.get('message').deleted) player.get('message').delete()
    })

    .on('playerMove', (player, currentChannel, newChannel) => {
      player.voiceChannel = client.channels.cache.get(newChannel)
    })

    .on('socketClosed', (player, payload) => {
      if (payload.byRemote) {
        return player.destroy()
      }
    })

    .on('trackError', (player, track, payload) => {
      if (payload.type === 'TrackExceptionEvent') {
        const channel = client.channels.cache.get(player.textChannel)
        let lang = client.db.get(channel.guild.id) || 'en'
        if (lang === 'en') lang = client.lang.en
        if (lang === 'pt') lang = client.lang.pt
        const embed = new MessageEmbed()
        embed.setDescription(`${lang.play.erro} \`${payload.error}\``)
        embed.setColor(client.colors.error)
        channel.send({ embeds: [embed] })
      }
    })

    .on('trackStuck', (player, track, payload) => {
      if (payload.type === 'TrackExceptionEvent') {
        const channel = client.channels.cache.get(player.textChannel)
        let lang = client.db.get(channel.guild.id) || 'en'
        if (lang === 'en') lang = client.lang.en
        if (lang === 'pt') lang = client.lang.pt
        const embed = new MessageEmbed()
        embed.setDescription(`${lang.play.erro} \`${payload.error}\``)
        embed.setColor(client.colors.error)
        channel.send({ embeds: [embed] })
      }
    })

    .on('queueEnd', player => {
      const channel = client.channels.cache.get(player.textChannel)
      let lang = client.db.get(channel.guild.id) || 'en'
      if (lang === 'en') lang = client.lang.en
      if (lang === 'pt') lang = client.lang.pt
      const embed = new MessageEmbed()
      embed.setDescription(lang.erela.saindo)
      embed.setColor(client.colors.default)
      channel.send({ embeds: [embed] })
      player.destroy()
    })
}
