try {

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

client.on("connected", () => {
  console.log("BOT CONNECTED");
});

client.on("message", (channel, tags, message) => {

  const msg = message.trim().toLowerCase();

  if (msg.startsWith("!guess")) {
    const ghost = msg.split(" ").slice(1).join(" ").trim();
    if (!ghost) return;

    votes[tags.username] = ghost;

    client.say(channel, `@${tags.username} vote ${ghost}`);
  }

  if (msg === "!score") {

    const totals = {};
    Object.values(votes).forEach(v => {
      totals[v] = (totals[v] || 0) + 1;
    });

    const result = Object.entries(totals)
      .sort((a,b) => b[1] - a[1])
      .map(v => `${v[0]}:${v[1]}`)
      .join(" | ");

    client.say(channel, `👻 Scores: ${result || "vide"}`);
  }

  if (msg === "!reset") {
    for (let k in votes) delete votes[k];
    client.say(channel, "reset ok");
  }

});

} catch (e) {
  console.log("CRASH:", e);
}
