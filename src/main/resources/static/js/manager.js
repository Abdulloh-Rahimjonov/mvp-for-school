// Manager Portal Logic

// Mock Data
let students = [
    { id: 'S001', firstName: 'Alisher', lastName: 'Qodirov', class: '8-A', status: 'Active' },
    { id: 'S002', firstName: 'Madina', lastName: 'Karimova', class: '9-B', status: 'Active' },
    { id: 'S003', firstName: 'Sardor', lastName: 'Toshmatov', class: '10-A', status: 'Active' }
];

let classes = [
    { id: 'C001', name: '8-A', teacher: 'Nodira V.', students: 24, capacity: 25 },
    { id: 'C002', name: '9-B', teacher: 'Sardor I.', students: 22, capacity: 30 },
    { id: 'C003', name: '10-A', teacher: 'Zamira M.', students: 18, capacity: 20 }
];

let teachers = [
    { id: 'T001', firstName: 'Nodira', lastName: 'Vohidova', subject: 'Math', classes: ['8-A'] },
    { id: 'T002', firstName: 'Sardor', lastName: 'Ikromov', subject: 'Physics', classes: ['9-B'] }
];

let archivedStudents = [
    { id: 'S004', firstName: 'Jasur', lastName: 'Mominov', departed: '2025-06', reason: 'Graduated' }
];

let archivedClasses = [
    { id: 'C004', name: '11-A (2025)', archivedDate: '2025-06' }
];

// Initialize DOM elements when loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderStudentList();
    renderClassList();
    renderTeacherList();
    renderArchivedClasses();
    renderArchivedStudents();
});

// Navigation Logic
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't switch if it's the logout link
            if (item.getAttribute('href') && item.getAttribute('href').includes('index.html')) return;

            e.preventDefault();

            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Find target section
            const targetSection = item.getAttribute('data-section');
            if(targetSection) {
                // Hide all sections
                sections.forEach(sec => sec.classList.remove('active'));
                // Show target section
                document.getElementById(targetSection).classList.add('active');
            }
        });
    });
}

// Student Logic
function renderStudentList(searchQuery = '') {
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filteredStudents = students.filter(s =>
        s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filteredStudents.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.id}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.class}</td>
            <td><span class="badge badge-success">${student.status}</span></td>
            <td>
                <button class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;" onclick="archiveStudent('${student.id}')">Archive</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function handleStudentSearch(e) {
    const query = e.target.value;
    renderStudentList(query);
}

function submitAddStudent() {
    const fName = document.getElementById('newStudentFName').value;
    const lName = document.getElementById('newStudentLName').value;
    const assignedClass = document.getElementById('newStudentClass').value;

    if(!fName || !lName || assignedClass === 'Select Class...') {
        alert('Please fill out all fields');
        return;
    }

    const newStudent = {
        id: 'S' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        firstName: fName,
        lastName: lName,
        class: assignedClass,
        status: 'Active'
    };

    students.push(newStudent);
    alert('Student added successfully!');

    // Clear form
    document.getElementById('newStudentFName').value = '';
    document.getElementById('newStudentLName').value = '';
    document.getElementById('newStudentClass').selectedIndex = 0;

    renderStudentList();
}

function archiveStudent(id) {
    const index = students.findIndex(s => s.id === id);
    if(index !== -1) {
        const student = students[index];
        const archived = {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            departed: new Date().toISOString().split('T')[0],
            reason: 'Archived manually'
        };
        archivedStudents.push(archived);
        students.splice(index, 1);

        renderStudentList();
        renderArchivedStudents();
    }
}


// Class Logic
function renderClassList() {
    const tbody = document.getElementById('classTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';

    classes.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.name}</td>
            <td>${c.teacher}</td>
            <td>${c.students} / ${c.capacity}</td>
            <td>
                <button class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;" onclick="archiveClass('${c.id}')">Archive</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function submitAddClass() {
    const name = document.getElementById('newClassName').value;
    const teacher = document.getElementById('newClassTeacher').value;
    const capacity = document.getElementById('newClassCapacity').value;

    if(!name || teacher === 'Select Teacher...' || !capacity) {
        alert('Please fill out all required fields');
        return;
    }

    const newClass = {
        id: 'C' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        name: name,
        teacher: teacher,
        students: 0,
        capacity: parseInt(capacity)
    };

    classes.push(newClass);
    alert('Class created successfully!');

    // Clear form
    document.getElementById('newClassName').value = '';
    document.getElementById('newClassTeacher').selectedIndex = 0;
    document.getElementById('newClassCapacity').value = '';

    renderClassList();

    // Update class dropdowns in other forms
    updateClassDropdowns();
}

function archiveClass(id) {
    const index = classes.findIndex(c => c.id === id);
    if(index !== -1) {
        const cls = classes[index];
        const archived = {
            id: cls.id,
            name: cls.name + ' (' + new Date().getFullYear() + ')',
            archivedDate: new Date().toISOString().split('T')[0]
        };
        archivedClasses.push(archived);
        classes.splice(index, 1);

        renderClassList();
        renderArchivedClasses();
        updateClassDropdowns();
    }
}

function updateClassDropdowns() {
    const dropdown = document.getElementById('newStudentClass');
    if(dropdown) {
        dropdown.innerHTML = '<option>Select Class...</option>';
        classes.forEach(c => {
            dropdown.innerHTML += `<option value="${c.name}">${c.name}</option>`;
        });
    }
}


// Teacher Logic
function renderTeacherList() {
    const tbody = document.getElementById('teacherTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';

    teachers.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${t.id}</td>
            <td>${t.firstName} ${t.lastName}</td>
            <td>${t.subject}</td>
            <td>${t.classes.join(', ')}</td>
        `;
        tbody.appendChild(tr);
    });
}

function submitAddTeacher() {
    const fName = document.getElementById('newTeacherFName').value;
    const lName = document.getElementById('newTeacherLName').value;
    const subject = document.getElementById('newTeacherSubject').value;

    if(!fName || !lName || !subject) {
        alert('Please fill out all fields');
        return;
    }

    const newTeacher = {
        id: 'T' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        firstName: fName,
        lastName: lName,
        subject: subject,
        classes: []
    };

    teachers.push(newTeacher);
    alert('Teacher added successfully!');

    document.getElementById('newTeacherFName').value = '';
    document.getElementById('newTeacherLName').value = '';
    document.getElementById('newTeacherSubject').value = '';

    renderTeacherList();
    updateTeacherDropdowns();
}

function updateTeacherDropdowns() {
    const dropdown = document.getElementById('newClassTeacher');
    if(dropdown) {
        dropdown.innerHTML = '<option>Select Teacher...</option>';
        teachers.forEach(t => {
            dropdown.innerHTML += `<option value="${t.firstName} ${t.lastName} (${t.subject})">${t.firstName} ${t.lastName} (${t.subject})</option>`;
        });
    }
}

// Archive Logic
function renderArchivedClasses() {
    const tbody = document.getElementById('archivedClassTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';

    archivedClasses.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.archivedDate}</td>
            <td><span class="badge badge-secondary">Archived</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderArchivedStudents() {
    const tbody = document.getElementById('archivedStudentTableBody');
    if(!tbody) return;
    tbody.innerHTML = '';

    archivedStudents.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${s.id}</td>
            <td>${s.firstName} ${s.lastName}</td>
            <td>${s.departed}</td>
            <td>${s.reason}</td>
        `;
        tbody.appendChild(tr);
    });
}
