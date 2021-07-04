INSERT INTO departments (name)
VALUES ('Architecture'),
  ('Healthcare'),
  ('Computer'),
  ('Mathematical'),
  ('Administrative');
INSERT INTO roles (title, salary, department_id)
VALUES ('Ironworker', 500, 1),
  ('Ordnance handling expert', 1000, 1),
  ('Marine oiler', 2000, 2),
  ('Safety and health practitioner', 1500, 2),
  ('Paraprofessional', 1200, 3),
  ('Gaming dealer', 1500, 4),
  ('Payroll representative', 2200, 4);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Philip', 'Smith', 4, 2),
  ('Robert ', 'Hood', 7, 2),
  ('Ruth', 'Black', 3, 3),
  ('Mary', 'Custer', 5, 2),
  ('Donna', 'Gower', 6, 2),
  ('Carol', 'Taylor', 4, 3),
  ('Christopher', 'Bowles', 1, 2),
  ('Amy', 'Oliva', 2, 3),
  ('Tyrone', 'Napper', 1, 3);