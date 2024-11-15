const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use('/api/auth', require('./routes/user.route'))
app.use("/api/image", require('./routes/image.route'));
app.use("/api/post", require('./routes/post.route'));
app.use("/api/activity", require('./routes/activity.route'));
app.use("/api/subscribes", require('./routes/subscribes.route'));
app.use("/api/chat", require('./routes/chat.route'));
app.use("/api/group_chat", require('./routes/group.chat.route'));
app.use("/api/notify", require('./routes/notify.route'));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log("Запущен на порте: " + PORT);
});

