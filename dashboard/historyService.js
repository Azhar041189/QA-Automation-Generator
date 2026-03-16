const fs = require('fs');
const path = require('path');

const historyFile = path.join(__dirname, 'history.json');

function initHistory() {
    if (!fs.existsSync(historyFile)) {
        fs.writeFileSync(historyFile, JSON.stringify([]));
    }
}

function getHistory() {
    initHistory();
    try {
        const data = fs.readFileSync(historyFile, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function addHistoryRecord(record) {
    const history = getHistory();
    record.id = history.length + 1;
    record.timestamp = new Date().toISOString();
    
    // Add to top of stack
    history.unshift(record);
    
    // Keep max 50 records
    if (history.length > 50) history.pop();
    
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
    return record;
}

module.exports = { getHistory, addHistoryRecord };
