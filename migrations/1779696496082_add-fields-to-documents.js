exports.up = (pgm) => {
  pgm.addColumn('documents', {
    originalname: { type: 'TEXT' },
    size: { type: 'INTEGER' },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('documents', 'originalname');
  pgm.dropColumn('documents', 'size');
};