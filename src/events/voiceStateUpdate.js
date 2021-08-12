/* eslint-disable promise/param-names */
/* eslint-disable eqeqeq */
const Event = require('../interfaces/Event')

module.exports = class extends Event {
  async run (oldVoice, newVoice) {
    const player = this.client.manager.players.get(oldVoice.guild.id)

    let lang = this.client.db.get(oldVoice.guild.id) || 'pt'
    if (lang === 'en') lang = this.client.lang.en
    if (lang === 'pt') lang = this.client.lang.pt

    if (!player) return

    if (!newVoice.guild.members.cache.get(this.client.user.id).voice.channelId) return player.destroy()

    if (oldVoice.id === this.client.user.id) return

    if (!oldVoice.guild.members.cache.get(this.client.user.id).voice.channelId) return

    if (oldVoice.guild.members.cache.get(this.client.user.id).voice.channel.id === oldVoice.channelId) {
      if (oldVoice.guild.me.voice.channel && oldVoice.guild.me.voice.channel.members.size == 1) {
        const vcName = oldVoice.guild.me.voice.channel.name
        const msg = await this.client.channels.cache.get(player.textChannel).send(`${lang.voiceUpdate.sairei} **${vcName}** ${lang.voiceUpdate.em} ${this.client.utils.time(60000)} ${lang.voiceUpdate.minuto}`)

        const delay = ms => new Promise(res => setTimeout(res, ms))
        await delay(60000)

        const vcMembers = oldVoice.guild.me.voice.channel.members.size

        if (!vcMembers || vcMembers === 1) {
          const newPlayer = this.client.manager.players.get(newVoice.guild.id)
          if (newPlayer) {
            player.destroy()
          } else {
            oldVoice.guild.voice.channel.leave()
          }
          return msg.edit(`${lang.voiceUpdate.sai} **${vcName}** ${lang.voiceUpdate.final}`)
        } else {
          return msg.delete()
        }
      }
    }
  }
}
