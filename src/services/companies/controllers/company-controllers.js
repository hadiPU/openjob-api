const {
  getAllCompanies, getCompanyById, createCompany, updateCompany, deleteCompany
} = require('../repositories/company-repositories');

const getCompanies = async (req, res, next) => {
  try {
    const companies = await getAllCompanies();
    res.json({ status: 'success', data: { companies } });
  } catch (err) { next(err); }
};

const getCompany = async (req, res, next) => {
  try {
    const result = await getCompanyById(req.params.id);
    const { fromCache, ...company } = result;
    res.set('X-Data-Source', fromCache ? 'cache' : 'database');
    res.json({ status: 'success', data: { ...company } });
  } catch (err) { next(err); }
};

const addCompany = async (req, res, next) => {
  try {
    const id = await createCompany({ ...req.body, owner_id: req.user.id });
    res.status(201).json({ status: 'success', data: { id } });
  } catch (err) { next(err); }
};

const editCompany = async (req, res, next) => {
  try {
    await updateCompany({ ...req.body, id: req.params.id, owner_id: req.user.id });
    res.json({ status: 'success', message: 'Company updated' });
  } catch (err) { next(err); }
};

const removeCompany = async (req, res, next) => {
  try {
    await deleteCompany({ id: req.params.id, owner_id: req.user.id });
    res.json({ status: 'success', message: 'Company deleted' });
  } catch (err) { next(err); }
};

module.exports = { getCompanies, getCompany, addCompany, editCompany, removeCompany };