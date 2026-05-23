const { login, refresh, logout } = require('../repositories/authentication-repositories');

const loginHandler = async (req, res, next) => {
  try {
    const data = await login(req.body);
    res.status(200).json({ status: 'success', data });
  } catch (err) { next(err); }
};

const refreshHandler = async (req, res, next) => {
  try {
    const data = await refresh(req.body);
    res.json({ status: 'success', data });
  } catch (err) { next(err); }
};

const logoutHandler = async (req, res, next) => {
  try {
    await logout(req.body);
    res.json({ status: 'success', message: 'Successfully logged out' });
  } catch (err) { next(err); }
};

module.exports = { loginHandler, refreshHandler, logoutHandler };