module.exports = async (client) => {
  client.lang.pt = {
    interactions: {
      dm: 'Hello. I like my privacy, and do not handle things in DMs. It appears this is a direct message. You should interact with me in your guild instead.'
    },
    geral: {
      naoTa: 'Por favor se conecte a algum canal de voz',
      mesmo: 'Por favor se conecte ao mesmo canal de voz que eu',
      nada: 'Não tem nada tocando neste servidor'
    },
    voiceUpdate: {
      sairei: 'Sairei do canal',
      em: 'em',
      minuto: 'por ficar sozinho',
      sai: 'Eu sai do canal',
      final: 'pq fiquei solitario'
    },
    erela: {
      tocando: 'Tocando agora',
      solicitado: 'Música solicitada por',
      saindo: 'Saindo do canal de voz. Acabaram as músicas'
    },
    message: {
      prefixo: 'Meu prefixo é',
      desabilitado: 'Este comando esta desabilitado',
      dono: 'Este comando esta liberado apenas para o dono do bot',
      manutencao: 'Bot em manutenção, por favor tente novamente mais tarde.',
      nsfw: 'Este comando so pode ser usando em canais NSFW',
      args: 'Desculpe, este comando requer argumentos para funcionar. Use:',
      userPerms: 'Esta faltando a permissão',
      userPerms2: 'para você usar este comando',
      botPerm: 'Esta faltando esta(s) permissão',
      botPerm2: 'para rodar este comando'
    },
    help: {
      invalid: 'Comando inexistente',
      Aliases: 'Sem aliases',
      description: 'Descrição',
      category: 'Categoria',
      usage: 'Modo de uso',
      dev: 'Desenvolvedor',
      musica: 'Música',
      filtros: 'Filtros',
      outros: 'Outros',
      footer: 'Não inclua <> ou [], isso significa <> é necessário e [] é opcional'
    },
    ping: {
      pong: '**Pong!** Meu ping é de',
      latency: 'A latencia da API é'
    },
    play: {
      semCanal: 'Entre em algum canal de voz e use o comando novamente',
      semPerm: 'Não tenho permissão para me conectar as teste canal de voz',
      tocandoJa: 'Já estou tocando música neste servidor',
      erro: 'Um erro aconteceu desculpa',
      semResultado: 'Não encontrei resultados',
      musgaAdd: 'Música adicionada',
      duracao: 'Duração',
      solicitado: 'Solicitado por',
      playlist: 'Adicionado a playlist',
      com: 'com',
      musicas: 'músicas',
      fila: 'Adicionado',
      fila2: 'a fila'
    },
    botinfo: {
      servidores: 'Servidores',
      tocandoEm: 'Tocando em',
      memoria: 'Uso de ram',
      suporte: 'Servidor de suporte',
      convide: 'Me convide',
      version: 'Versão'
    },
    search: {
      semCanal: 'Entre em algum canal de voz e use o comando novamente',
      semPerm: 'Não tenho permissão para me conectar as teste canal de voz',
      tocandoJa: 'Já estou tocando música neste servidor',
      erro: 'Um erro aconteceu desculpa',
      semResultado: 'Não encontrei resultados',
      fila: 'Adicionado',
      fila2: 'a fila',
      semLink: 'Por favor não coloque links',
      numero: 'Envie o numero da música para adicionar a fila. Caso queira cancelar envie',
      tempo: 'O tempo de seleção acabou',
      cancel: 'Seleção cancelada',
      invalid: 'Você deu um numero invalido',
      solicitado: 'Solicitado por',
      duracao: 'Duração',
      por: 'Por'
    },
    bassboost: {
      nada: 'Não tem nada tocando no momento',
      tocandoJa: 'Já estou tocando música neste servidor',
      ativado: 'Bassboost ativado',
      desativado: 'Bassboost desativado'
    },
    queue: {
      nothing: 'Não há nada tocando, infelizmente',
      np: 'Tocando agora',
      fila: 'Fila de reprodução de',
      nohasmusic: 'Não ha músicas na',
      arg1: 'página',
      arg2: 'fila',
      arg3: 'de'
    },
    np: {
      nada: 'Não ha nada tocando no momento'
    },
    vaporwave: {
      ativado: 'Filtro vaporwave ativado',
      desativado: 'Filtro vaporwave desativado'
    },
    nightcore: {
      ativado: 'Filtro nightcore ativado',
      desativado: 'Filtro nightcore desativado'
    },
    stop: {
      nada: 'Não há nada tocando',
      conectar: 'Você tem que se conectar a algum canal de voz',
      conectar2: 'Conecte-se ao mesmo canal de voz que eu',
      parou: 'Parei de tocar e sai do canal'
    },
    skip: {
      nada: 'Não há nada tocando',
      conectar: 'Você tem que se conectar a algum canal de voz',
      conectar2: 'Conecte-se ao mesmo canal de voz que eu'

    },
    volume: {
      nada: 'Não há nada tocando',
      conectar: 'Você tem que se conectar a algum canal de voz',
      conectar2: 'Conecte-se ao mesmo canal de voz que eu',
      invalido: 'Você tem que colocar um número entre 1 e 100',
      mudado: 'Eu mudei o volume do player para ',
      setadoJa: 'O Volume do player é '
    },
    shuffle: {
      finish: 'Embaralhei a fila de música'
    },
    pause: {
      pausadoJa: 'A música já esta pausada',
      pausado: 'Pausei a música'
    },
    resume: {
      resumidoJa: 'A música não esta pausada',
      resumido: 'I unpaused the music'
    }
  }
}
