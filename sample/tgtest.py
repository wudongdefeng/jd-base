from telethon import TelegramClient

# Use your own values from my.telegram.org

api_id = 123456799

api_hash = '1234567890123'

# The first parameter is the .session file name (absolute paths allowed)

with TelegramClient('id_' +api_id, api_id, api_hash) as client:

    client.loop.run_until_complete(client.send_message('me', 'Hello, myself!'))

