const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('🚀 Node App running with CI/CD pipeline!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});