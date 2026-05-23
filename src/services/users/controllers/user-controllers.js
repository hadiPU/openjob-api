const { createUser, getUserById } = require('../repositories/user-repositories');

const registerUser = async (req, res, next) => {
  try {
    const id = await createUser(req.body);
    res.status(201).json({ status: 'success', data: { id } });
  } catch (err) { next(err); }
};

const getUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    res.json({ status: 'success', data: { ...user } });
  } catch (err) { next(err); }
};

module.exports = { registerUser, getUser };