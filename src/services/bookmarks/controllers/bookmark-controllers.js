const {
  getAllBookmarks, getBookmarkById, createBookmark, deleteBookmark
} = require('../repositories/bookmark-repositories');

const getBookmarks = async (req, res, next) => {
  try {
    const result = await getAllBookmarks(req.user.id);
    res.set('X-Data-Source', result.fromCache ? 'cache' : 'database');
    res.json({ status: 'success', data: { bookmarks: result.data } });
  } catch (err) { next(err); }
};

const getBookmark = async (req, res, next) => {
  try {
    const bookmark = await getBookmarkById({
      id: req.params.id,
      jobId: req.params.jobId,
    });
    res.json({ status: 'success', data: { ...bookmark } });
  } catch (err) { next(err); }
};

const addBookmark = async (req, res, next) => {
  try {
    const id = await createBookmark({
      user_id: req.user.id,
      job_id: req.params.jobId,
    });
    res.status(201).json({ status: 'success', data: { id } });
  } catch (err) { next(err); }
};

const removeBookmark = async (req, res, next) => {
  try {
    await deleteBookmark({
      user_id: req.user.id,
      job_id: req.params.jobId,
    });
    res.json({ status: 'success', message: 'Bookmark deleted' });
  } catch (err) { next(err); }
};

module.exports = { getBookmarks, getBookmark, addBookmark, removeBookmark };