const {
  getProfile, getProfileApplications, getProfileBookmarks
} = require('../repositories/profile-repositories');

const getProfileHandler = async (req, res, next) => {
  try {
    const user = await getProfile(req.user.id);
    res.json({
      status: 'success',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      }
    });
  } catch (err) { next(err); }
};

const getProfileApplicationsHandler = async (req, res, next) => {
  try {
    const applications = await getProfileApplications(req.user.id);
    res.json({ status: 'success', data: { applications } });
  } catch (err) { next(err); }
};

const getProfileBookmarksHandler = async (req, res, next) => {
  try {
    const bookmarks = await getProfileBookmarks(req.user.id);
    res.json({ status: 'success', data: { bookmarks } });
  } catch (err) { next(err); }
};

module.exports = {
  getProfileHandler, getProfileApplicationsHandler, getProfileBookmarksHandler
};