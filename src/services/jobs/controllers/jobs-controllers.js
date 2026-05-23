const {
  getAllJobs, getJobsByCompany, getJobsByCategory,
  getJobById, createJob, updateJob, deleteJob
} = require('../repositories/job-repositories');

const getJobs = async (req, res, next) => {
  try {
    const { title, 'company-name': companyName } = req.query;
    const jobs = await getAllJobs({ title, companyName });
    res.json({ status: 'success', data: { jobs } });
  } catch (err) { next(err); }
};

const getJobsByCompanyHandler = async (req, res, next) => {
  try {
    const jobs = await getJobsByCompany(req.params.companyId);
    res.json({ status: 'success', data: { jobs } });
  } catch (err) { next(err); }
};

const getJobsByCategoryHandler = async (req, res, next) => {
  try {
    const jobs = await getJobsByCategory(req.params.categoryId);
    res.json({ status: 'success', data: { jobs } });
  } catch (err) { next(err); }
};

const getJob = async (req, res, next) => {
  try {
    const job = await getJobById(req.params.id);
    res.json({ status: 'success', data: { ...job } });
  } catch (err) { next(err); }
};

const addJob = async (req, res, next) => {
  try {
    const id = await createJob(req.body);
    res.status(201).json({ status: 'success', data: { id } });
  } catch (err) { next(err); }
};

const editJob = async (req, res, next) => {
  try {
    await updateJob(req.params.id, req.body);
    res.json({ status: 'success', message: 'Job updated' });
  } catch (err) { next(err); }
};

const removeJob = async (req, res, next) => {
  try {
    await deleteJob(req.params.id);
    res.json({ status: 'success', message: 'Job deleted' });
  } catch (err) { next(err); }
};

module.exports = {
  getJobs, getJobsByCompanyHandler, getJobsByCategoryHandler,
  getJob, addJob, editJob, removeJob
};