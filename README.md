# Blum Airdrop Bot

## Description

Blum Airdrop Bot automates interactions with the Blum airdrop platform. It includes functionalities to claim rewards, manage farming sessions, complete tasks, and play games automatically.

## Features

- **Claim Farm Reward**: Automatically claim rewards from farming activities.
- **Start Farming Session**: Begin a new farming session.
- **Auto Complete Tasks**: Automatically complete available tasks and claim rewards.
- **Auto Play and Claim Game Points**: Play games and claim game points automatically.
- **Claim Daily Reward**: Automatically claim daily rewards.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/DanXs12/blum-auto-bot.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd blum-airdrop-bot
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

### Configuration

1. **Create a `.env` file** in the root directory of the project.

2. **Add your `QUERY_IDS` to the `.env` file, use `,` in query_id to multi-account**. Example format:

    ```env
    QUERY_IDS=YOUR_QUERY_ID_VALUE1_HERE,YOUR_QUERY_ID_VALUE2_HERE,YOUR_QUERY_ID_VALUE3_HERE
    ```

   - To find your `QUERY_ID`, follow these steps:
     1. Open [Web Telegram](https://web.telegram.org) in your browser.
     2. Open the [Blum Bot](https://t.me/blum/app?startapp=ref_U0ukWHnhnu).
     3. Open DevTools (right-click on the page and select "Inspect" or press `F12`).
     4. Go to the "Application" tab, then "Local Storage", and choose `https://telegram.blum.codes`.
     5. Find `QUERY_ID`, copy its value.

   - **Connection Issues on Telegram Web?** If you can't open the Blum bot, you may need to use the following Chrome extension to bypass connection restrictions: [Ignore X-Frame-Headers](https://chromewebstore.google.com/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe).

### Running the Bot

To start the bot, run:

```bash
npm start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
