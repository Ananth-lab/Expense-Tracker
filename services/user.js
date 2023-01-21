const getExpenses = (req, where) => {
    req.user.getExpenses()
}


module.exports = {
    getExpenses
}