const db_user = require('../models/db_user');
const _db_user = new db_user();

module.exports =
{
    async login(req, res)
    {
        // intialize accounts
        let admin = await _db_user.findOne({ email: 'admin@reporting.system' });

        if (!admin)
        {
            await _db_user.add(
            {
                first_name: 'Default',
                middle_name: 'Admin',
                last_name: 'Account',
                full_name: 'Default Admin Account',
                email: 'admin@reporting.system',
                password: 'water123',
                keywords: 'Default Admin Account',
                role: 'Admin',
                is_verified: true
            });
        }

        res.send(await _db_user.findOne({ email: req.body.email, password: req.body.password }));
    },
    async register(req, res)
    {
        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.password || !req.body.confirm_password)
        {
            throw new Error('Please fill up all fields');
        }

        let exist = await _db_user.findOne({ email: req.body.email });
        if (exist) throw new Error('Email already exists.');
        
        await _db_user.add(
        {
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            last_name: req.body.last_name,
            full_name: `${ req.body.first_name } ${ req.body.middle_name } ${ req.body.last_name }`,
            email: req.body.email,
            password: req.body.password,
            keywords: `${ req.body.first_name } ${ req.body.middle_name } ${ req.body.last_name }`,
            role: 'Member',
            is_verified: false
        });

        res.send(true);
    }
}