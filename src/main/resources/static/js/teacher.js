// Teacher Portal Logic

// Mock Data
let myClasses = [
    { id: 'C001', name: '8-A', subject: 'English', studentsCount: 20 },
    { id: 'C002', name: '9-B', subject: 'English', studentsCount: 18 },
    { id: 'C003', name: '10-A', subject: 'English', studentsCount: 15 }
];

let classStudents = {
    'C001': [
        { id: 'S001', name: 'Alisher Qodirov', attendance: 'Present' },
        { id: 'S002', name: 'Madina Karimova', attendance: 'Present' },
        { id: 'S003', name: 'Jasur Mominov', attendance: 'Present' }
    ],
    'C002': [
        { id: 'S004', name: 'Dilshod Rahmatov', attendance: 'Present' },
        { id: 'S005', name: 'Zarina Alieva', attendance: 'Present' }
    ],
    'C003': [
        { id: 'S006', name: 'Rustam Karimov', attendance: 'Present' },
        { id: 'S007', name: 'Aziza Turaeva', attendance: 'Present' },
        { id: 'S008', name: 'Nodir Ergashev', attendance: 'Present' }
    ]
};

let selectedClassId = null;

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderClassCards();
});

// Navigation Logic
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.getAttribute('href') && item.getAttribute('href').includes('index.html')) return;
            e.preventDefault();

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const targetSection = item.getAttribute('data-section');
            if(targetSection) {
                sections.forEach(sec => sec.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
            }
        });
    });
}

function renderClassCards() {
    const container = document.getElementById('classListContainer');
    if(!container) return;

    container.innerHTML = '';

    myClasses.forEach(c => {
        const card = document.createElement('div');
        card.className = `class-card ${c.id === selectedClassId ? 'active' : ''}`;
        card.onclick = () => selectClass(c.id);

        card.innerHTML = `
            <div>
                <h4 style="color: white; font-size: 1.2rem; margin-bottom: 0.3rem;">${c.name}</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">${c.subject} - ${c.studentsCount} Students</p>
            </div>
            <div style="font-size: 1.5rem;">➡️</div>
        `;

        container.appendChild(card);
    });
}

function selectClass(classId) {
    selectedClassId = classId;
    renderClassCards(); // re-render to update active styling

    const cls = myClasses.find(c => c.id === classId);

    // Update header
    document.getElementById('currentClassHeader').innerText = `Class ${cls.name} (${cls.subject})`;

    // Show table
    document.getElementById('studentsSection').style.display = 'block';
    document.getElementById('noClassSelected').style.display = 'none';

    renderStudentsForAttendance();
}

function renderStudentsForAttendance() {
    const tbody = document.getElementById('attendanceTableBody');
    if(!tbody || !selectedClassId) return;

    tbody.innerHTML = '';

    const students = classStudents[selectedClassId];

    students.forEach((student, index) => {
        const tr = document.createElement('tr');

        // Dynamic border color based on status
        let borderColor = 'rgba(16, 185, 129, 0.4)'; // Present
        if(student.attendance === 'Absent') borderColor = 'rgba(239, 68, 68, 0.4)';
        if(student.attendance === 'Late') borderColor = 'rgba(245, 158, 11, 0.4)';

        tr.innerHTML = `
            <td style="font-weight: 500;">${student.name}</td>
            <td>
                <div class="custom-select">
                    <select id="att_${index}" style="padding: 0.5rem; font-size: 0.85rem; border-color: ${borderColor}; width: 120px;" onchange="updateRowColor(this, ${index})">
                        <option value="Present" ${student.attendance === 'Present' ? 'selected' : ''}>Present</option>
                        <option value="Absent" ${student.attendance === 'Absent' ? 'selected' : ''}>Absent</option>
                        <option value="Late" ${student.attendance === 'Late' ? 'selected' : ''}>Late</option>
                    </select>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateRowColor(selectObj, index) {
    const val = selectObj.value;
    let borderColor = 'rgba(16, 185, 129, 0.4)';
    if(val === 'Absent') borderColor = 'rgba(239, 68, 68, 0.4)';
    if(val === 'Late') borderColor = 'rgba(245, 158, 11, 0.4)';
    selectObj.style.borderColor = borderColor;

    // update mock data
    if(classStudents[selectedClassId] && classStudents[selectedClassId][index]) {
        classStudents[selectedClassId][index].attendance = val;
    }
}

function saveTopicAndAttendance() {
    if(!selectedClassId) {
        alert("Please select a class first.");
        return;
    }

    const topic = document.getElementById('todayTopic').value;
    if(!topic) {
        alert("Please enter today's topic.");
        return;
    }

    const cls = myClasses.find(c => c.id === selectedClassId);
    alert(`Successfully saved! \nClass: ${cls.name}\nTopic: ${topic}\nAttendance records updated.`);

    // Clear the topic input as feedback
    document.getElementById('todayTopic').value = '';
}
