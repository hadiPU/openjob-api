exports.up = (pgm) => {
  pgm.createTable('jobs', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    title: { type: 'TEXT', notNull: true },
    description: { type: 'TEXT' },
    salary: { type: 'TEXT' },
    location: { type: 'TEXT' },
    type: { type: 'TEXT' },
    job_type: { type: 'TEXT' },
    experience_level: { type: 'TEXT' },
    location_type: { type: 'TEXT' },
    location_city: { type: 'TEXT' },
    salary_min: { type: 'NUMERIC' },
    salary_max: { type: 'NUMERIC' },
    is_salary_visible: { type: 'BOOLEAN', default: true },
    status: { type: 'TEXT', default: "'open'" },
    company_id: { type: 'VARCHAR(50)', references: '"companies"' },
    category_id: { type: 'VARCHAR(50)', references: '"categories"' },
    created_at: { type: 'TIMESTAMP', default: pgm.func('NOW()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('jobs');
};