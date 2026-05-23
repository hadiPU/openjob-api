const {
  createApplication, getAllApplications, getApplicationsByUser,
  getApplicationsByJob, getApplicationById, updateApplicationStatus,
  deleteApplication
} = require('../repositories/application-repositories');

const addApplication = async (req, res, next) => {
  try {
    const id = await createApplication({ ...req.body, user_id: req.user.id });
    res.status(201).json({ status: 'success', data: { id } });
  } catch (err) { next(err); }
};

const getApplications = async (req, res, next) => {
  try {
    const applications = await getAllApplications();
    res.json({ status: 'success', data: { applications } });
  } catch (err) { next(err); }
};

const getApplicationsByUserHandler = async (req, res, next) => {
  try {
    const applications = await getApplicationsByUser(req.params.userId);
    res.json({ status: 'success', data: { applications } });
  } catch (err) { next(err); }
};

const getApplicationsByJobHandler = async (req, res, next) => {
  try {
    const applications = await getApplicationsByJob(req.params.jobId);
    res.json({ status: 'success', data: { applications } });
  } catch (err) { next(err); }
};

const getApplication = async (req, res, next) => {
  try {
    const application = await getApplicationById(req.params.id);
    res.json({ status: 'success', data: { ...application } });
  } catch (err) { next(err); }
};

const editApplicationStatus = async (req, res, next) => {
  try {
    await updateApplicationStatus({ id: req.params.id, status: req.body.status });
    res.json({ status: 'success', message: 'Application status updated' });
  } catch (err) { next(err); }
};

const removeApplication = async (req, res, next) => {
  try {
    await deleteApplication({ id: req.params.id, user_id: req.user.id });
    res.json({ status: 'success', message: 'Application deleted' });
  } catch (err) { next(err); }
};

module.exports = {
  addApplication, getApplications, getApplicationsByUserHandler,
  getApplicationsByJobHandler, getApplication, editApplicationStatus,
  removeApplication
};