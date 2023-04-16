# keepa-discord

Reference Keepa's API for product analysis using commands via Discord. 

Uses [Discord JS 14 Template](https://github.com/TSLARoadster/TypeScript-Discord.js-v14-Template) for file and folder structure. 

#

# Setup
- In [/src](https://github.com/mckay/keepa-discord/tree/main/src) Raname``example.env`` to ``.env``. 
- All fields in ``.env`` are required. You can find your [Keepa API key](https://keepa.com/#!api) and [create a Discord application](https://discordapp.com/developers)
- Please ensure you understand Keepa's token-based credential system. 
- Run ``npm install`` in the project directory. 
- To launch the service, simply run ``ts-node-esm --files index.ts`` in the ``/src`` directory.

# Discord Commands
- ``/keepa`` General product details and performance insights for a given ASIN. Defaults to Amazon US. 

- ``/keepachart`` Keepa chart for a given ASIN based on a duration chosen in the command. 

- ``/sellerinfo`` View a Storefront's reviews, business information, and selling performance. 

- ``/tokens`` Display Keepa's API token usage & refill rate for the bot. 
