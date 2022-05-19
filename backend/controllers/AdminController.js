const db_user = require('../models/db_user');
const _db_user = new db_user();

module.exports =
{
    async listUsers(req, res)
    {
        res.send(await _db_user.find({ role: "Member" }));
    },
    async verifyUser(req, res)
    {
        await _db_user.update(req.body.user_id,
        {
            is_verified: true
        });

        res.send(true);
    }
}