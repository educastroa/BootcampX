const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'vagrant'
});

const cohortName = process.argv[2]

pool.query(`
SELECT teachers.name as teacher, cohorts.name as cohort, count(assistance_requests) as total_assistances
FROM teachers
JOIN assistance_requests ON teacher_id = teachers.id
JOIN students ON student_id = students.id
JOIN cohorts ON cohort_id = cohorts.id
WHERE cohorts.name = $1
GROUP BY teachers.name, cohorts.name
ORDER BY teacher;
`, [cohortName])
.then(res => {
  res.rows.forEach(user => {
    console.log(`${user.cohort}: ${user.teacher} `);
  })
}).catch(err => console.error('query error', err.stack));