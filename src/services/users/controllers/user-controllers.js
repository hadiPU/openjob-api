const { createUser, getUserById } = require('../repositories/user-repositories');

const registerUser = async (req, res, next) => {
  try {
    const id = await createUser(req.body);
    res.status(201).json({ status: 'success', data: { id } });
  } catch (err) { next(err); }
};

const getUser = async (req, res, next) => {
  try {
    const result = await getUserById(req.params.id);
    const { fromCache, ...user } = result;
    res.set('X-Data-Source', fromCache ? 'cache' : 'database');
    res.json({ status: 'success', data: { ...user } });
  } catch (err) { next(err); }
};

module.exports = { registerUser, getUser };