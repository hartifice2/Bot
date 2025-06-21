const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys")
const { Boom } = require("@hapi/boom")
const { state, saveState } = useSingleFileAuthState('./auth_info.json')

async function startSock() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    })

    sock.ev.on('creds.update', saveState)
    sock.ev.on('messages.upsert', m => {
        console.log(JSON.stringify(m, undefined, 2))
        if (m.messages[0]?.message?.conversation === '!ping') {
            sock.sendMessage(m.messages[0].key.remoteJid, { text: 'pong' })
        }
    })
}

startSock()
