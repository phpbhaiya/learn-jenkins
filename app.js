const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello, Jenkins!');
});

if (require.main === module) {
  const PORT = process.env.PORT || 6666;
  app.listen(PORT, () => {
    console.log(`Server running on port... ${PORT}`);
  });
}

module.exports = app;
