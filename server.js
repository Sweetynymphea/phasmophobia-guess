const tmi = require("tmi.js");

const votes = {};

const client = new tmi.Client({
  identity: {
    username: process.env.BOT_NAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [process.env.CHANNEL]
});

client.connect();

// 👻 commandes chat
client.on("message", (channel, tags, message) => {

  const msg = message.trim().toLowerCase();

  // 🟢 vote
  if (msg.startsWith("!guess")) {
    const ghost = msg.split(" ").slice(1).join(" ").trim();

    if (!ghost) return;

    votes[tags.username] = ghost;

    client.say(channel, `@${tags.username} a voté pour ${ghost}`);
  }

  // 📊 afficher scores
  if (msg === "!score") {

    const totals = {};

    Object.values(votes).forEach(v => {
      totals[v] = (totals[v] || 0) + 1;
    });

    const result = Object.entries(totals)
      .sort((a,b) => b[1] - a[1])
      .map(v => `${v[0]}: ${v[1]}`)
      .join(" | ");

    client.say(channel, `👻 Scores: ${result || "aucun vote"}`);
  }

  // 🧹 reset (optionnel)
  if (msg === "!reset") {
    for (let k in votes) delete votes[k];
    client.say(channel, "🔄 votes reset !");
  }

});
