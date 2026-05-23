const {
  getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory
} = require('../repositories/category-repositories');

const getCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.json({ status: 'success', data: { categories } });
  } catch (err) { next(err); }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);
    res.json({ status: 'success', data: { ...category } });
  } catch (err) { next(err); }
};

const addCategory = async (req, res, next) => {
  try {
    const id = await createCategory(req.body);
    res.status(201).json({ status: 'success', data: { id } });
  } catch (err) { next(err); }
};

const editCategory = async (req, res, next) => {
  try {
    await updateCategory({ id: req.params.id, name: req.body.name });
    res.json({ status: 'success', message: 'Category updated' });
  } catch (err) { next(err); }
};

const removeCategory = async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);
    res.json({ status: 'success', message: 'Category deleted' });
  } catch (err) { next(err); }
};

module.exports = { getCategories, getCategory, addCategory, editCategory, removeCategory };